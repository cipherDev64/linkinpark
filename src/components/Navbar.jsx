import { Link, useLocation } from "react-router-dom";
import { Home, Users, User, LogOut, Network, Search, Rocket, Activity, Menu } from "lucide-react";

export default function Navbar({ handleLogout }) {
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
        { name: "Discover", path: "/matches", icon: <Search size={20} /> },
        { name: "Labs", path: "/team-builder", icon: <Rocket size={20} /> },
        { name: "Profile", path: "/profile", icon: <User size={20} /> }
    ];

    return (
        <div className="md:hidden w-full bg-white/80 backdrop-blur-xl border-b border-border px-6 py-4 z-[60] sticky top-0 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-premium">
                    <Network className="text-white" size={18} />
                </div>
                <h1 className="text-sm font-black tracking-tighter text-heading leading-none">
                    LINKIN<span className="text-primary">PARK</span>
                </h1>
            </Link>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`p-2 rounded-xl transition-all ${isActive ? "text-primary bg-primary/10" : "text-slate-400 hover:text-slate-600"}`}
                                title={item.name}
                            >
                                {item.icon}
                            </Link>
                        )
                    })}
                </div>
                <div className="w-px h-6 bg-border mx-1" />
                <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-all"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
}
