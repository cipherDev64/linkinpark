import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const styles = {
        success: "bg-green-100 border-green-800 text-green-900 shadow-[4px_4px_0px_#166534]",
        error: "bg-red-100 border-red-800 text-red-900 shadow-[4px_4px_0px_#991b1b]"
    };

    return (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-3xl border-2 font-bold animate-fade-in-up w-max max-w-sm ${styles[type]}`}>
            {type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span className="flex-1">{message}</span>
            <button onClick={onClose} className="hover:opacity-70"><X size={20} /></button>
        </div>
    );
}
