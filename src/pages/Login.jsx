import { useState } from "react";
import { loginWithGoogle } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Fingerprint, AlertCircle, Network, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

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
        <div className="min-h-screen bg-bg flex items-center justify-center relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[130px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="saas-card p-12 max-w-lg w-full relative z-10 mx-4 border-white/60 shadow-premium"
            >
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6">
                        <Network className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-heading">
                        LinkIn<span className="text-primary">Park</span>
                    </h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-[0.2em] text-xs">NHCE Campus Connector</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl mb-8 flex items-start gap-4 text-left"
                    >
                        <AlertCircle size={20} className="mt-0.5 shrink-0" />
                        <p className="text-sm font-bold">{error}</p>
                    </motion.div>
                )}

                <div className="space-y-6">
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full h-16 btn-primary flex items-center justify-center gap-4 text-lg shadow-premium"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Fingerprint size={24} />
                                Authenticate via Google
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-slate-400">
                        <ShieldCheck size={16} />
                        <p className="text-sm font-bold">Secure NHCE Single Sign-On</p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-bold text-heading">1.2k+</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students</span>
                        </div>
                        <div className="flex flex-col items-center border-x border-slate-100">
                            <span className="text-xl font-bold text-heading">450+</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Projects</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-bold text-heading">24/7</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Support</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Subtle Footer Decorative Text */}
            <div className="absolute bottom-8 left-0 w-full text-center pointer-events-none opacity-20">
                <p className="text-[80px] font-black text-slate-300 select-none">CAMPUS CONNECT</p>
            </div>
        </div>
    );
}
