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
        <div className="min-h-screen bg-[#fdfdfd] flex items-center justify-center relative overflow-hidden text-slate-800">
            <div className="doodle-card p-10 max-w-md w-full relative z-10 text-center mx-4 bg-white">
                <div className="flex justify-center mb-6 mt-4">
                    <img src="/logo.png" alt="LinkInPark" className="w-[80%] md:w-[90%] h-auto object-contain drop-shadow-sm scale-110" />
                </div>
                <p className="text-slate-500 mb-8 font-semibold text-lg">NHCE Campus Connector</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-start gap-3 text-left">
                        <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full btn-doodle btn-doodle-primary flex items-center justify-center gap-3 text-lg py-4"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-4 border-blue-200 border-t-white rounded-full animate-spin"></div>
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
