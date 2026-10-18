import { useNavigate, useParams } from "react-router-dom"
import FileGrid from "../components/files/fileGrid"
import Breadcrumbs from "../components/layout/Breadcrumbs"
import { useApp } from "../context/AppContext";
import useDrive from "../hooks/useDrive";
import { useEffect, useState } from "react";
import FilePreview from "../components/files/FilePreview";
import ShareModal from "../components/files/ShareModal";
import RenameModal from "../components/files/RenameModal";
import MoveModal from "../components/files/MoveModal";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";



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
  const [isDeleting, setIsDeleting] = useState(false);

  // Sincroniza la carpeta activa en el contexto global y consulta los datos
  // cada vez que cambia la URL (/drive/:folderId), el filtro de búsqueda o el orden.
  useEffect(() => {
    const id = folderId || null;
    setCurrentFolderId(id);
    fetchDriveContent(id, searchQuery, sortBy);
  }, [folderId, searchQuery, sortBy, fetchDriveContent, setCurrentFolderId]);

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    const success = await removeDriveItem(deleteItem);
    setIsDeleting(false);
    if (success) {
      setDeleteItem(null);
    }
  };


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

      {/* Modals */}
      {previewFile && <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />}
      {shareItem && <ShareModal item={shareItem} isOpen={!!shareItem} onClose={() => setShareItem(null)} />}
      {renameItem && <RenameModal item={renameItem} isOpen={!!renameItem} onClose={() => setRenameItem(null)} />}
      {moveItem && <MoveModal item={moveItem} isOpen={!!moveItem} onClose={() => setMoveItem(null)} />}
      {deleteItem && (
        <ConfirmDialog
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title={`Move "${deleteItem.name}" to Trash`}
          message="You can restore this item from Trash at an time"
          confirmText="Move to Trash"
        />
      )}
    </div>
  )
}

export default Drive