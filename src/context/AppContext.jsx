import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../config/api";
import { toast } from "react-hot-toast";

const AppContext = createContext();

const ROOT_BREADCRUMB = [{ id: null, name: "My Drive" }]

const getErrMsg = (err, fallback) => err.response?.data?.error || fallback || "Something went wrong."

export const AppProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Upload Global State
  const [isUploading, setIsUploading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Drive View State
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState(ROOT_BREADCRUMB);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [isDriveLoading, setIsDriveLoading] = useState(false);

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");;

  // Refresh User Profile & Storage Stats
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data.user);
      return data.user;
    } catch (error) {
      setUser(null);
      return null;
    }
  }, []);

  // Check Auth Status on App Load
  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  //Auth Actions Helper
  const authAction = async (requestFn, successMsg, errorFallback) => {
    try {
      const { data } = await requestFn();
      setUser(data.user);
      if (successMsg) toast.success(successMsg);
      return true;
    } catch (error) {
      toast.error(getErrMsg(error, errorFallback));
      return false;
    }
  }

  const login = (email, password) => {
    return authAction(() => api.post(
      "/api/auth/login",
      { email, password }),
      "Welcome back!",
      "Login failed."
    )
  }

  const register = (name, email, password) => {
    return authAction(() => api.post(
      "/api/auth/register",
      { name, email, password }),
      "Account created successfully!",
      "Registration failed."
    )
  }

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      toast.success("Logged out");
    } catch (error) {
      toast.error("Logout failed.");
    }
  }

  /**
   * Obtiene carpetas, archivos y la ruta de migas de pan según la carpeta actual.
   * Recibe 'folderId', 'search' y 'sort' como parámetros directos para evitar incluir
   * estados volátiles en las dependencias del useCallback, previniendo recreaciones
   * innecesarias de la función y condiciones de carrera al navegar.
   */
  const fetchDriveContent = useCallback(
    async (folderId = null, search = "", sort = "name_asc") => {
      if (!user) return; // Si no hay usuario autenticado se cancela la petición
      setIsDriveLoading(true); // Activa el estado visual de carga
      try {
        const parentParam = folderId || "null"; // "null" indica el nivel raíz a la API
        const [folderRes, fileRes, detailRes] = await Promise.all([
          api.get("/api/folders", { params: { parent_id: parentParam } }),               // Subcarpetas directas
          api.get("/api/files", { params: { folder_id: parentParam, search, sort } }),   // Archivos de la carpeta con filtros
          folderId ? api.get(`/api/folders/${folderId}`) : null,                         // Metadatos y breadcrumbs si no es raíz
        ]);

        setFolders(folderRes.data.folders || []);
        setFiles(fileRes.data.files || []);
        setBreadcrumbs(detailRes?.data?.breadcrumbs || ROOT_BREADCRUMB);
      } catch {
        toast.error("Error loading drive contents");
      } finally {
        setIsDriveLoading(false);
      }

    }, [user])

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user, // false -> user es null o undefined, true -> user existe como un objeto
    isUploading,
    setIsUploading,
    uploadProgress,
    setUploadProgress,
    refreshUser,
    currentFolderId,
    setCurrentFolderId,
    breadcrumbs,
    folders,
    files,
    setFiles,
    isDriveLoading,
    fetchDriveContent,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext);