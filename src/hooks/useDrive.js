import toast from "react-hot-toast";
import { useApp } from "../context/AppContext"
import api from "../config/api";

/**
 * Helper para identificar si un item es una carpeta.
 * Verifica la propiedad explícita 'item_type' o, en su defecto, 
 * asume que es carpeta si carece de 'mime_type' y 'path' (carpetas virtuales).
 */
const isFolderItem = (item) => {
  return item?.item_type === "folder" || (!item?.mime_type && item?.path === undefined);
};

const useDrive = () => {
  // 1. Extraemos del contexto global todo lo necesario para manejar el estado del Drive
  const {
    fetchDriveContent,     // Función para recargar los archivos de la carpeta actual
    refreshUser,           // Función para actualizar los datos del usuario (ej. espacio en disco usado)
    currentFolderId,       // ID de la carpeta en la que el usuario está navegando actualmente
    isUploading,           // Booleano para mostrar spinners o deshabilitar botones
    setIsUploading,        // Setter del estado de carga
    uploadProgress,        // Número (0-100) para la barra de progreso
    setUploadProgress      // Setter del progreso
  } = useApp();

  /**
   * 2. Ejecutor reutilizable de acciones de API (Patrón DRY - Don't Repeat Yourself)
   * Centraliza el manejo de try/catch, notificaciones y callbacks post-éxito.
   * @param {Promise|Function} apiCall - La promesa o función que devuelve la promesa de la API.
   * @param {string} successMsg - Mensaje para el toast de éxito.
   * @param {string} errorMsg - Mensaje por defecto si falla.
   * @param {Function} afterSuccess - Callback opcional que recibe los datos de la respuesta.
   */
  const runAction = async (apiCall, successMsg, errorMsg, afterSuccess) => {
    try {
      const res = await (typeof apiCall === 'function' ? apiCall() : apiCall); // Si apiCall es una función, la ejecutamos, si es una promesa, la devolvemos

      if (successMsg) toast.success(successMsg);
      if (afterSuccess) await afterSuccess(res?.data);

      return true; // Indica que la operación fue exitosa
    } catch (error) {
      // Manejo robusto de errores: intenta leer el mensaje del backend, o usa el mensaje por defecto
      const errorMessage = error.response?.data?.error || error.message || errorMsg;
      toast.error(errorMessage);
      return false; // Indica que la operación falló
    }
  };

  /**
   * 3. Subida de archivos con progreso simulado
   * Simula el progreso hasta el 92% para mejorar la UX (evita que la barra salte de 0 a 100 
   * instantáneamente en archivos pequeños, o se quede estancada en archivos grandes).
   * El 8% restante se "reserva" para el tiempo real de respuesta del servidor.
   */
  const uploadFiles = async (fileList, folder_id = currentFolderId) => {
    if (!fileList?.length) return; // Validación: si no hay archivos, no hace nada

    setIsUploading(true);
    setUploadProgress(0);

    // Calcula el peso total de todos los archivos seleccionados en bytes
    const totalSize = Array.from(fileList).reduce((acc, f) => acc + (f.size || 0), 0);

    // Fórmula para simular progreso: determina cuánto sumar cada 100ms.
    // Se topa en 92% para dejar margen a la respuesta real del servidor.
    const step = 92 / Math.max(12, totalSize / 409715.2);

    // Intervalo que actualiza el estado del progreso visualmente
    const interval = setInterval(() => {
      setUploadProgress((p) => (p >= 92 ? p : Math.min(92, p + step)));
    }, 100);

    // Preparamos el payload para multipart/form-data (requerido para subir archivos)
    const formData = new FormData();
    Array.from(fileList).forEach((f) => {
      formData.append("files", f); // El backend debe esperar un array o múltiples campos "files"
    });

    // Agregamos el folder_id si existe
    if (folder_id) {
      formData.append("folder_id", folder_id);
    }

    try {
      // Llamada real a la API
      const { data } = await api.post("/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Éxito: Limpiamos la simulación y forzamos el 100%
      clearInterval(interval);
      setUploadProgress(100);

      // Pequeña pausa artificial (300ms) para que el usuario vea la barra llegar al 100% antes de desaparecer
      await new Promise((r) => setTimeout(r, 300));

      toast.success(`${data.files.length} file(s) uploaded successfully`);

      // Refrescamos la UI: nueva lista de archivos y nuevo espacio en disco del usuario
      await fetchDriveContent(folder_id);
      await refreshUser();

    } catch (error) {
      clearInterval(interval);
      toast.error(error.response?.data?.error || "File Upload Failed");
    } finally {
      // Limpieza garantizada independientemente de si hubo éxito o error
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  /**
    * Crea una carpeta y refresca el contenido del directorio padre
    */
  const createFolder = (name, parent_id = currentFolderId) => {
    return runAction(
      () => api.post("/api/folders", { name, parent_id }),
      "Folder created",
      "Error creating folder",
      () => fetchDriveContent(parent_id)
    );
  };

  // 5. Polymorphic operations 
  /**
   * Renombra un item (Polimórfico: acepta objeto o ID string)
   */
  const renameItem = (item, newName) => {
    const isFolder = isFolderItem(item);
    const endpoint = isFolder ? "folders" : "files";
    const id = item?.id || item; // Normalización polimórfica

    return runAction(
      () => api.patch(`/api/${endpoint}/${id}/rename`, { name: newName }),
      `${isFolder ? "Folder" : "File"} renamed`,
      "Error renaming item.",
      () => fetchDriveContent()
    );
  };


  /**
    * Mueve un item a otra carpeta (Polimórfico)
    * Nota: Maneja la diferencia de payload entre archivos (target_folder) y carpetas (target_parent)
    */
  const moveItem = (item, targetFolderId) => {
    const isFolder = isFolderItem(item);
    const endpoint = isFolder ? "folders" : "files";
    const payload = isFolder ? { target_parent: targetFolderId } : { target_folder: targetFolderId };
    const id = item?.id || item;

    return runAction(
      () => api.patch(`/api/${endpoint}/${id}/move`, payload),
      `${isFolder ? "Folder" : "File"} moved`,
      "Error moving item.",
      () => fetchDriveContent()
    );
  };



  /**
   * Elimina un item (Soft delete: lo mueve a la papelera) (Polimórfico)
   */
  const deleteItem = (item) => {
    // Comprueba si el elemento es una carpeta o un archivo
    const isFolder = isFolderItem(item);
    // Selecciona la ruta correspondiente ('folders' o 'files') para la petición
    const endpoint = isFolder ? "folders" : "files";
    // Obtiene el identificador tanto si se recibe el objeto completo como si solo se pasa el ID primitivo
    const id = item?.id || item;

    return runAction(
      () => api.delete(`/api/${endpoint}/${id}/delete`),
      `${isFolder ? "Folder" : "File"} moved to Trash`,
      "Error deleting item.",
      () => fetchDriveContent()
    );
  };


  /**
   * Restaura un item desde la papelera (Polimórfico)
   */
  const restoreItem = (item) => {
    const endpoint = isFolder ? "folders" : "files";
    const id = item?.id || item;

    return runAction(
      () => api.post(`/api/${endpoint}/${id}/restore`),
      "Item restored", "Error restoring item.",
    );
  };

  /**
   * Elimina permanentemente un item desde la papelera 
   */
  const permanentDeleteItem = (item) => {
    const endpoint = isFolder ? "folders" : "files";
    const id = item?.id || item;

    return runAction(
      () => api.delete(`/api/${endpoint}/${id}/permanent-delete`),
      "Item deleted permanently", "Error deleting item.",
    );
  };


  return {
    uploadFiles,
    createFolder,
    renameItem,
    moveItem,
    deleteItem,
    isUploading,
    uploadProgress,
    restoreItem,
    permanentDeleteItem,
    runAction, // Útil si algún componente necesita hacer una llamada API custom con toast incluido
  };
};

export default useDrive;



