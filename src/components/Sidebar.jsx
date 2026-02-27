import { Link, useLocation } from "react-router-dom";
import { Home, Users, User, LogOut, Network } from "lucide-react";

export default function Sidebar({ handleLogout }) {
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
        { name: "Matches", path: "/matches", icon: <Users size={20} /> },
        { name: "Campus Graph", path: "/graph", icon: <Network size={20} /> },
        { name: "Profile", path: "/profile", icon: <User size={20} /> },
        { name: "Team Builder", path: "/team-builder", icon: <Users size={20} /> }
    ];

    return (
        <div className="w-64 h-screen bg-white rounded-none border-t-0 border-l-0 border-b-0 border-r-4 border-slate-800 flex flex-col pt-8 z-50 relative sticky top-0 shadow-[4px_0px_0px_#1e293b]">
            <div className="px-8 mb-10 text-center">
                <h1 className="text-4xl font-display font-black tracking-tight drop-shadow-[2px_2px_0px_#1e293b]">
                    LinkIn<span className="text-blue-500">Park</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all border-2 border-transparent ${isActive
                                    ? "bg-[#fffae6] text-slate-900 border-slate-800 shadow-[2px_2px_0px_#1e293b] translate-x-2"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1"
                                }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="px-4 pb-8">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-500 border-2 border-transparent transition-all"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
}
