import { Link, useLocation } from "react-router-dom";
import { Home, Users, User, LogOut, Network } from "lucide-react";

export default function Navbar({ handleLogout }) {
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
        { name: "Matches", path: "/matches", icon: <Users size={20} /> },
        { name: "Campus Graph", path: "/graph", icon: <Network size={20} /> },
        { name: "Team Builder", path: "/team-builder", icon: <Users size={20} /> },
        { name: "Profile", path: "/profile", icon: <User size={20} /> }
    ];

    return (
        <div className="w-full bg-white border-b border-slate-200 px-4 md:px-8 py-3 z-[60] sticky top-0 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4 md:gap-8">
                <Link to="/dashboard" className="flex items-center">
                    <img src="/logo.png" alt="LinkInPark" className="h-[40px] md:h-[48px] object-contain drop-shadow-sm" />
                </Link>

                <nav className="hidden lg:flex items-center gap-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold transition-all border-2 border-transparent ${isActive
                                    ? "bg-[#fffae6] text-slate-900 border-slate-800 shadow-[2px_2px_0px_#1e293b] -translate-y-0.5"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:-translate-y-0.5"
                                    }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="flex items-center gap-2">
                {/* Mobile/Tablet small menu icons */}
                <div className="lg:hidden flex items-center gap-1 mr-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`p-2 rounded-xl font-bold transition-all border-2 border-transparent ${isActive
                                    ? "bg-[#fffae6] text-slate-900 border-slate-800 shadow-[2px_2px_0px_#1e293b]"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                title={item.name}
                            >
                                {item.icon}
                            </Link>
                        )
                    })}
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
                    title="Logout"
                >
                    <LogOut size={20} />
                    <span className="hidden md:inline">Logout</span>
                </button>
            </div>
        </div>
    );
}
