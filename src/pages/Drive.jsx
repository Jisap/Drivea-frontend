import { useNavigate, useParams } from "react-router-dom"
import FileGrid from "../components/files/fileGrid"
import Breadcrumbs from "../components/layout/Breadcrumbs"
import { useApp } from "../context/AppContext";
import useDrive from "../hooks/useDrive";
import { useEffect, useState } from "react";



const Drive = () => {

  const navigate = useNavigate();
  const { folderId } = useParams();
  const { fetchDriveContent, setCurrentFolderId, searchQuery, sortBy } = useApp();
  const { deleteItem: removeDriveItem } = useDrive();

  // Active item modals
  const [previewFile, setPreviewFile] = useState(null);
  const [shareItem, setShareItem] = useState(null);
  const [renameItem, setRenameItem] = useState(null);
  const [moveItem, setMoveItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // Sincroniza la carpeta activa en el contexto global y consulta los datos
  // cada vez que cambia la URL (/drive/:folderId), el filtro de búsqueda o el orden.
  useEffect(() => {
    const id = folderId || null;
    setCurrentFolderId(id);
    fetchDriveContent(id, searchQuery, sortBy);
  }, [folderId, searchQuery, sortBy, fetchDriveContent, setCurrentFolderId]);

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* folder & files */}
      <FileGrid
        onFolderClick={(folder) => navigate(`/drive/${folder.id}`)}
        onPreviewFile={setPreviewFile}
        onShareItem={setShareItem}
        onRenameItem={setRenameItem}
        onMoveItem={setMoveItem}
        onDeleteItem={setDeleteItem}
      />
    </div>
  )
}

export default Drive