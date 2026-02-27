import { Link, useLocation } from "react-router-dom";
import { Home, Users, User, LogOut, Network, Search, Rocket, Bell, Sparkles, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar({ handleLogout }) {
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
        { name: "Discover", path: "/matches", icon: <Search size={20} />, badge: 3 },
        { name: "Campus Graph", path: "/graph", icon: <Activity size={20} /> },
        { name: "Team Labs", path: "/team-builder", icon: <Rocket size={20} /> },
        { name: "Profile Node", path: "/profile", icon: <User size={20} /> }
    ];

    return (
        <aside className="hidden md:flex flex-col w-72 h-screen bg-white border-r border-border p-8 sticky top-0 z-50">
            {/* Logo Section */}
            <div className="flex items-center gap-4 px-2 mb-12">
                <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-premium transform hover:rotate-6 transition-transform">
                    <Network className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-lg font-black tracking-tighter text-heading leading-none">
                        LINKIN<span className="text-primary">PARK</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1">Network v2.0</p>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 flex flex-col gap-3">
                <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Internal Channels</p>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold group ${isActive ? "bg-primary text-white shadow-premium" : "text-slate-500 hover:bg-slate-50 hover:text-primary"}`}
                        >
                            <span className="relative">
                                {item.icon}
                                {item.badge && (
                                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent text-white text-[9px] font-black flex items-center justify-center rounded-lg border-2 border-white">
                                        {item.badge}
                                    </span>
                                )}
                            </span>
                            <span className="text-sm tracking-tight">{item.name}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="ml-auto"
                                >
                                    <Sparkles size={14} className="text-white/40" />
                                </motion.div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto space-y-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden group border-dashed">
                    <div className="relative z-10">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Sync Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <p className="text-xs font-bold text-heading">System Nominal</p>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium mt-2 leading-relaxed">Network encryption active. Profile visible to verified nodes.</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-bold text-sm"
                >
                    <LogOut size={20} />
                    <span>Terminate Session</span>
                </button>
            </div>
        </aside>
    );
}
