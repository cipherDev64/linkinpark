import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";
import { Users, Code, Activity, Network } from "lucide-react";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        mostCommonSkill: "-",
        collabDept: "-"
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const users = await getAllUsers();

            let allSkills = {};
            let depts = {};

            users.forEach(u => {
                (u.skills || []).forEach(s => {
                    allSkills[s] = (allSkills[s] || 0) + 1;
                });
                if (u.department) {
                    depts[u.department] = (depts[u.department] || 0) + 1;
                }
            });

            const topSkill = Object.keys(allSkills).sort((a, b) => allSkills[b] - allSkills[a])[0] || "-";
            const topDept = Object.keys(depts).sort((a, b) => depts[b] - depts[a])[0] || "-";

            setStats({
                totalUsers: users.length,
                mostCommonSkill: topSkill,
                collabDept: topDept
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">System <span className="neon-text-blue">Overview</span></h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Users className="text-neonBlue" size={32} />}
                    title="Total Users"
                    value={loading ? "..." : stats.totalUsers}
                />
                <StatCard
                    icon={<Code className="text-neonPink" size={32} />}
                    title="Trending Skill"
                    value={loading ? "..." : stats.mostCommonSkill}
                />
                <StatCard
                    icon={<Network className="text-purple-400" size={32} />}
                    title="Most Active Dept"
                    value={loading ? "..." : stats.collabDept}
                />
                <StatCard
                    icon={<Activity className="text-green-400" size={32} />}
                    title="System Status"
                    value="Online"
                />
            </div>

            <div className="mt-12 glass-card p-8">
                <h2 className="text-2xl font-bold mb-4">Welcome to LinkInPark</h2>
                <p className="text-gray-400 leading-relaxed max-w-2xl">
                    The central hub for NHCE students to connect, find project collaborators, and build powerful teams.
                    Use the navigation menu to optimize your profile, discover compatible teammates, and view the campus skills network.
                </p>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value }) {
    return (
        <div className="glass-card p-6 flex items-center gap-5 hover:-translate-y-1 transition-transform cursor-default">
            <div className="p-4 bg-white/5 rounded-2xl">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            </div>
        </div>
    )
}
