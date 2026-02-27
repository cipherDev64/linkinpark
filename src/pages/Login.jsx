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
        <div className="min-h-screen bg-darkBg flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neonBlue/20 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neonPink/20 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="glass-card p-10 max-w-md w-full relative z-10 text-center">
                <h1 className="text-5xl font-black mb-2 tracking-tighter">
                    <span className="neon-text-blue">LinkIn</span>
                    <span className="neon-text-pink">Park</span>
                </h1>
                <p className="text-gray-400 mb-8 font-medium">NHCE Campus Connector</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 text-left">
                        <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full btn-neon btn-neon-primary flex items-center justify-center gap-3 text-lg"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <Fingerprint size={24} />
                            Authenticate with Google
                        </>
                    )}
                </button>

                <p className="text-sm text-gray-500 mt-6">
                    Connect with your Google account
                </p>
            </div>
        </div>
    );
}
