import { Trash2Icon, TrashIcon } from "lucide-react"
import { useState, useEffect } from "react"
import useDrive from "../hooks/useDrive"
import { useApp } from "../context/AppContext"
import api from "../config/api";
import toast from "react-hot-toast";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Spinner } from "../components/ui/Spinner";

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
                    <div key={item.id}>
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            ))
            }
          </div>
        )
      )}
    </div>
  )
}

export default Trash