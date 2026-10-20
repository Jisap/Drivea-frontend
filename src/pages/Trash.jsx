import { Trash2Icon } from "lucide-react"

const Trash = () => {
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
      </div>
    </div>
  )
}

export default Trash