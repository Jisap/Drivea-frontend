import { Trash2Icon, UserIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "../components/ui/EmptyState";
import { Spinner } from "../components/ui/Spinner";
import { getFileIcon } from "../assets/assets";
import api from "../config/api";
import toast from "react-hot-toast";
import { formatDate } from "date-fns";


const SharedFile = () => {

  const [shares, setShares] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingShare, setDeletingShare] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);

  const fetchShares = async (params) => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/shares")
      setShares(data.share_links || [])
    } catch {
      toast.error("Error loading shared links.")
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchShares();
  }, [])

  return (
    <div className="space-y-6">
      {/* page title & desc */}
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
          <UserIcon className="size-5" />
        </div>

        <div>
          <h2 className="text-xl font-medium text-slate-900">Shared Links</h2>
          <p className="text-xs text-slate-500">Share links you have created</p>
        </div>
      </div>

      {/* page content */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" className="text-orange-600" />
        </div>
      ) : shares.length === 0 ? (
        <EmptyState
          title="No shared links yet"
          description="Links you generate for sharing files and folders will appear here."
          icon={UsersIcon}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shares.map((share) => (
            <div key={share.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
              {/* card top */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {getFileIcon(share.resouce?.mime_type)}
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {share.resouce?.name || "Shared item"}
                    </h4>
                  </div>

                  <button
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
                    title="Delete Share Link"
                  >
                    <Trash2Icon className="size-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-500 space-y-1 mt-3">
                  <p>Access: <span className="text-slate-800">Anyone with link</span></p>
                  <p>Views: <span className="text-slate-800">{share.access_count ?? 0}</span></p>
                  <p>Created: {" "}<span className="text-slate-800">{formatDate(share.created_at, "MMM d, yyyy")}</span></p>
                </div>
              </div>

              {/* card bottom */}
              <div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SharedFile