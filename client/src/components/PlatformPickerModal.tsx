// PlatformPickerModal.tsx
import { CircleCheckBig, ExternalLinkIcon, XIcon } from "lucide-react";  // ✅ removed unused CheckCheckIcon
import { PLATFORMS } from "../assets/assets";

interface PlatformPickerModalProps {  // ✅ "Model" → "Modal"
  connectedIds: string[];
  connecting: string | null;
  onClose: () => void;
  onConnect: (platform: string) => void;
}

const PlatformPickerModal = ({
  connectedIds,
  connecting,
  onClose,
  onConnect,
}: PlatformPickerModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shadow">
          <h3 className="text-slate-700">Choose a Platform</h3>  {/* ✅ onClick removed */}
          <button
            onClick={onClose}  // ✅ moved here
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Platform List */}
        <div className="p-6 flex flex-col gap-2">
          {PLATFORMS.map((p) => {
            const isConnected = connectedIds.includes(p.id);
            const isConnecting = connecting === p.id;
            return (
              <button
                key={p.id}  // ✅ key added
                disabled={isConnected || isConnecting}
                onClick={() => onConnect(p.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  isConnected
                    ? "border-emerald-200 bg-emerald-50 cursor-default"  // ✅ red → emerald
                    : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100 cursor-pointer"
                } ${isConnecting && "opacity-60"}`}
              >
                {/* Icon */}
                <div className="p-2">
                  <p.icon
                    className={`size-5 ${isConnected ? "text-emerald-600" : "text-slate-500"}`}  // ✅ red → emerald
                  />
                </div>
                {/* Label */}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${isConnected ? "text-emerald-700" : "text-slate-800"}`}>  {/* ✅ red → emerald */}
                    {p.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {isConnected ? "Already connected" : p.description}
                  </div>
                </div>
                {/* Status */}
                {isConnected && (
                  <CircleCheckBig className="size-4 text-emerald-500 shrink-0" />  // ✅ red → emerald
                )}
                {isConnecting && (
                  <div className="size-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin shrink-0" />  // ✅ border-2 added
                )}
                {!isConnected && !isConnecting && (
                  <ExternalLinkIcon className="size-3.5 text-slate-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlatformPickerModal;