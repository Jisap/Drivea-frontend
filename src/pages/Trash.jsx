import { LucideFolder, RotateCcwIcon, Trash2Icon, TrashIcon } from "lucide-react"
import { useState, useEffect } from "react"
import useDrive from "../hooks/useDrive"
import { useApp } from "../context/AppContext"
import api from "../config/api";
import toast from "react-hot-toast";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Spinner } from "../components/ui/Spinner";
import { formatBytes, getFileIcon } from "../assets/assets";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";


const TrashItemCard = ({ item, isFolder, onRestore, onDelete }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0 pr-2">
        {isFolder
          ? <LucideFolder className="size-6 text-orange-600 shrink-0" />
          : getFileIcon(item.mime_type)
        }

        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
          {!isFolder && (
            <p className="text-[11px] text-slate-500">
              {formatBytes(item.size)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition"
          title="Restore"
          onClick={() => onRestore(item)}
        >
          <RotateCcwIcon className="size-4" />
        </button>

        <button
          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
          title="Delete Permanently"
          onClick={() => onDelete(item)}
        >
          <TrashIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}

const Trash = () => {

  const [{ files, folders }, setTrash] = useState({ files: [], folders: [] })
  const [isLoading, setIsLoading] = useState(false);
  const [isEmptying, setIsEmptying] = useState(false);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);

  const { restoreItem, permanentDeleteItem } = useDrive();
  const { refreshUser } = useApp();

  const fetchTrash = async (params) => {
    setIsLoading(true)
    try {
      const { data } = await api.get("/api/trash")
      setTrash({ files: data.files || [], folders: data.folders })
    } catch (error) {
      toast.error("Error loading trash")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrash()
  }, []);

  const hasItems = files.length > 0 || folders.length > 0;

  /**
   * actionFn: Una función asíncrona que viene por parámetro.
   * Al recibirla como argumento, se evita duplicar código para restaurar y borrar.
   * */
  const handleAction = async (item, actionFn, isFolder) => {
    // 1. Ejecutar la acción en el backend / servicio
    const ok = await actionFn({
      id: item.id,
      item_type: isFolder ? "folder" : "file"
    })

    // 2. Si la acción fue exitosa, actualizar el estado local (UI)
    if (ok) {
      setTrash((prev) => (
        {
          // Si NO era carpeta (era archivo), lo saca de prev.files con .filter()
          files: isFolder
            ? prev.files
            : prev.files.filter((f) => f.id !== item.id),
          // Si SÍ era carpeta, la saca de prev.folders con .filter()
          folders: isFolder
            ? prev.folders.filter((f) => f.id !== item.id)
            : prev.folders
        }
      ))
    }
  }

  const handleEmptyTrash = async () => {
    setIsEmptying(true);
    try {
      await api.post("/api/trash/empty")
      toast.success("Trash emptied.")
      setTrash({ files: [], folders: [] })
      await refreshUser();
    } catch (error) {
      toast.error("Failed to empty trash")
    } finally {
      setIsEmptying(false)
      setShowEmptyConfirm(false)
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200">
            <Trash2Icon className="size-5" />
          </div>

          <div>
            <h2 className="text-xl font-medium text-slate-900">Trash</h2>
            <p className="text-xs text-slate-500">Items in trash are soft deleted</p>
          </div>
        </div>

        {hasItems && (
          <Button
            variant="danger"
            size="sm"
            icon={TrashIcon}
            onClick={() => { setShowEmptyConfirm(true) }}
          >
            Empty Trash
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" className="text-orange-600" />
        </div>
      ) : (
        !hasItems ? (
          <EmptyState
            title="Trash is Empty"
            description="Items you delete will show up here before being permanently removed."
            icon={Trash2Icon}
          />
        ) : (
          <div className="space-y-6">
            {[
              { title: "Folders", items: folders, isFolder: true },
              { title: "Files", items: files, isFolder: false }
            ].filter(({ items }) => items.length > 0).map(({ title, items, isFolder }) => (
              <div key={title}>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {title}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <TrashItemCard
                      key={item.id}
                      item={item}
                      isFolder={isFolder}
                      onRestore={(it) => { handleAction(it, restoreItem, isFolder) }}
                      onDelete={(it) => { handleAction(it, permanentDeleteItem, isFolder) }}
                    />
                  ))}
                </div>
              </div>
            ))
            }
          </div>
        )
      )}

      <ConfirmDialog
        isOpen={showEmptyConfirm}
        onClose={() => setShowEmptyConfirm(false)}
        onConfirm={handleEmptyTrash}
        title="Empty Trash?"
        message="This action cannot be undone. Are you sure you want to permanently delete all items in the trash?"
        isLoading={isEmptying}
      />
    </div>
  )
}

export default Trash