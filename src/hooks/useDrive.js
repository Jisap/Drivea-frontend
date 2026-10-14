import { useApp } from "../context/AppContext"




const useDrive = () => {

  const {
    fetchDriveContent,
    refreshUser,
    currentFolderId,
    isUploading,
    setIsUploading,
    uploadProgress,
    setUploadProgress
  } = useApp();

  // Reusable API action runner with standard toast & callback
  const runAction = async (apiCall, successMsg, errorMsg, afterSuccess) => {
    try {
      const res = await apiCall;
      if (successMsg) toast.success(successMsg);
      if (afterSuccess) await afterSuccess(res?.data);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || errorMsg);
      return false
    }
  }

  // File Upload with simulated progress
  const uploadFiles = async (fileList, folder_id = currentFolderId) => {
    if (!fileList?.length) return;
    setIsUploading(true);
    setUploadProgress(0);

    const totalSize = Array.from(fileList).reduce((acc, f) => acc + (f.size || 0), 0); // Calcula el tamaño total de los archivos a subir
    const step = 92 / Math.max(12, totalSize / 409715.2);                             // 92% de progreso máximo
    const interval = setInterval(() => {                                              // Incrementa el progreso simulado
      setUploadProgress((p) => (p >= 92 ? p : Math.min(92, p + step)))
    }, 100)

    const formData = new FormData();
    Array.from(fileList).forEach((f) => {
      formData.append("files", f);
    });

    if (folder_id) formData.append("folder_id", folder_id)

    try {
      const { data } = await api.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      clearInterval(interval);
      setUploadProgress(100);
      await new Promise((r) => setTimeout(r, 300))
      toast.success(`${data.files.length} file(s) upload successfuly`)
      await fetchDriveContent(folder_id)
      await refreshUser()
    } catch (error) {
      clearInterval(interval);
      toast.error(error.response?.data?.error || "File Upload Failed")
    } finally {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
    }







  }
  // Create folder

  // Polumorphic operations (accepts file or folder item / id)
}

export default useDrive