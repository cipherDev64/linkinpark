import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";
import { getCurrentUser } from "../services/authService";
import { calculateCompatibility } from "../services/matchService";
import MatchCard from "../components/MatchCard";
import SkeletonCard from "../components/SkeletonCard";
import { Filter, SearchX, Users, GraduationCap, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const [scoreFilter, setScoreFilter] = useState("all");
    const [deptFilter, setDeptFilter] = useState("all");
    const [yearFilter, setYearFilter] = useState("all");

    const [availableDepts, setAvailableDepts] = useState([]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 25 } }
    };

    useEffect(() => {
        const fetchMatches = async () => {
            const currentUser = getCurrentUser();
            if (!currentUser) return;

            const users = await getAllUsers();
            const me = users.find(u => u.uid === currentUser.uid);

            if (me) {
                const calculatedMatches = users
                    .filter(u => u.uid !== me.uid)
                    .map(u => {
                        const { score, explanation } = calculateCompatibility(me, u);
                        return { user: u, score, explanation };
                    })
                    .sort((a, b) => b.score - a.score);

                const depts = [...new Set(calculatedMatches.map(m => m.user.department).filter(Boolean))];
                setAvailableDepts(depts);
                setMatches(calculatedMatches);
            }
            setLoading(false);
        };
        fetchMatches();
    }, []);

    const filteredMatches = matches.filter(m => {
        let pass = true;
        if (scoreFilter === "high" && m.score < 80) pass = false;
        if (scoreFilter === "medium" && (m.score < 60 || m.score >= 80)) pass = false;

        if (deptFilter !== "all" && m.user.department !== deptFilter) pass = false;
        if (yearFilter !== "all" && String(m.user.year) !== yearFilter) pass = false;

        return pass;
    });

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-10"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-heading">Discover Network</h1>
                    <p className="text-slate-500 font-medium mt-1">Finding the most compatible collaborators for your next big project.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    {/* Score Filter */}
                    <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-border shadow-soft flex-1 sm:flex-none">
                        <Users size={18} className="text-primary" />
                        <select
                            value={scoreFilter}
                            onChange={(e) => setScoreFilter(e.target.value)}
                            className="bg-transparent text-sm font-bold text-heading outline-none cursor-pointer appearance-none min-w-[120px]"
                        >
                            <option value="all">Any Compatibility</option>
                            <option value="high">High Match (80%+)</option>
                            <option value="medium">Good (60-79%)</option>
                        </select>
                    </div>

                    {/* Dept Filter */}
                    <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-border shadow-soft flex-1 sm:flex-none">
                        <GraduationCap size={18} className="text-primary" />
                        <select
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                            className="bg-transparent text-sm font-bold text-heading outline-none cursor-pointer appearance-none min-w-[120px]"
                        >
                            <option value="all">All Departments</option>
                            {availableDepts.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {/* Year Filter */}
                    <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-border shadow-soft flex-1 sm:flex-none">
                        <Calendar size={18} className="text-primary" />
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="bg-transparent text-sm font-bold text-heading outline-none cursor-pointer appearance-none min-w-[100px]"
                        >
                            <option value="all">Any Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : filteredMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredMatches.map(match => (
                            <motion.div
                                key={match.user.uid}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                variants={itemVariants}
                            >
                                <MatchCard match={match} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div variants={itemVariants} className="flex flex-col items-center justify-center p-20 saas-card border-dashed bg-slate-50/50 shadow-none">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-soft mb-6">
                        <SearchX className="text-slate-300" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-heading mb-2">No Compatibility Found</h3>
                    <p className="text-slate-500 font-medium max-w-sm text-center">
                        Try adjusting your filters or update your profile skills to find better matches in the network.
                    </p>
                    <button
                        onClick={() => { setScoreFilter("all"); setDeptFilter("all"); setYearFilter("all"); }}
                        className="mt-8 btn-secondary"
                    >
                        Reset All Filters
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
}
