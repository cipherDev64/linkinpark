import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "./Sidebar";

export default function ProtectedRoute() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return unsub;
    }, []);

    if (loading) {
        return (
            <div className="flex bg-darkBg h-screen items-center justify-center">
                <div className="w-12 h-12 border-4 border-neonBlue border-t-transparent rounded-full animate-spin" style={{ boxShadow: '0 0 15px #00f0ff' }}></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-darkBg text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 relative">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neonBlue/10 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neonPink/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
