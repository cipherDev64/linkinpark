import { NavLink } from 'react-router-dom';
import { logout } from '../services/authService';
import { LayoutDashboard, User, Users, FlaskConical, Network, LogOut } from 'lucide-react';

export default function Sidebar() {
    const links = [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/matches", icon: Users, label: "Matches" },
        { to: "/team-builder", icon: FlaskConical, label: "Team Builder" },
        { to: "/graph", icon: Network, label: "Campus Graph" },
    ];

    return (
        <div className="w-64 h-screen glass-card rounded-none border-t-0 border-l-0 border-b-0 flex flex-col pt-8 z-50 relative">
            <div className="px-6 mb-12">
                <h1 className="text-3xl font-bold tracking-tighter">
                    <span className="neon-text-blue">LinkIn</span>
                    <span className="neon-text-pink">Park</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-white/10 text-neonBlue border border-neonBlue/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span className="font-medium">{link.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
