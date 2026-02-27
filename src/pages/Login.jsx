import { useState } from "react";
import { loginWithGoogle } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Fingerprint, AlertCircle } from "lucide-react";

export default function Login() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setError("");
            setLoading(true);
            await loginWithGoogle();
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "An error occurred during login.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center relative overflow-hidden">
            <div className="doodle-card p-10 max-w-md w-full relative z-10 text-center mx-4 bg-white">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-blue-100 border-4 border-slate-800 rounded-3xl shadow-[4px_4px_0px_#1e293b] flex items-center justify-center rotate-3">
                        <span className="text-4xl">🚀</span>
                    </div>
                </div>

                <h1 className="text-5xl font-display font-black mb-2 tracking-tighter drop-shadow-[2px_2px_0px_#1e293b]">
                    <span className="text-slate-900">LinkIn</span><span className="text-blue-500">Park</span>
                </h1>
                <p className="text-slate-500 mb-8 font-bold">NHCE Campus Connector</p>

                {error && (
                    <div className="bg-red-100 border-2 border-red-800 text-red-900 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 text-left shadow-[2px_2px_0px_#991b1b]">
                        <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full btn-doodle btn-doodle-primary flex items-center justify-center gap-3 text-lg py-4"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-4 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <Fingerprint size={24} />
                            Authenticate with Google
                        </>
                    )}
                </button>

                <p className="text-sm font-bold text-slate-400 mt-6">
                    Connect with your Google account
                </p>
            </div>
        </div>
    );
}
