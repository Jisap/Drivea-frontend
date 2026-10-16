import { useState } from "react";
import { useSearchParams } from "react-router-dom"
import api from "../../config/api";
import { DownloadIcon, FileTextIcon, XIcon } from "lucide-react";
import { formatBytes } from "../../assets/assets";


const FilePreview = ({ file, onClose }) => {

  const [previewUrl, setPreviewUrl] = useSearchParams(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    api.get(`/api/files/${file.id}/preview`)                   // Obtiene el preview de la imagen cada vez que cambia el archivo
      .then(data => {
        if (isMounted) setPreviewUrl(data);                    // Guarda el preview de la imagen en el estado
      })
      .catch(() => {
        if (isMounted) setError('Failed to load preview');     // Si hay error, muestra un mensaje
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);                    // Detiene el loading
      })

    return () => {
      isMounted = false;
    }
  }, [file]);

  if (!file) return null;

  const mime = file.mime_type || "";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop:blur-xs animate-fade-in"
    >
      {/* Modal box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl flex flex-col max-h-[92vh] overflow-hidden animate-slide-up">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <FileTextIcon className="size-5 text-orange-600 shrink-0" />

            <div>
              <h3 className="text-base font-medium text-slate-900 truncate">{file.name}</h3>
              <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {previewUrl && (
              <a
                href={previewUrl}
                download={file.name}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-md transition">
                <DownloadIcon className="w-3.5 h-3.5" />
                <span>Donwload</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <XIcon className="size-5" />
            </button>
          </div>
        </div>


        {/* preview content */}
      </div>
    </div>
  )
}

export default FilePreview