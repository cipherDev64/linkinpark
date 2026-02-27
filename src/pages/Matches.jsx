import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";
import { getCurrentUser } from "../services/authService";
import { calculateCompatibility } from "../services/matchService";
import MatchCard from "../components/MatchCard";
import SkeletonCard from "../components/SkeletonCard";
import { Sparkles, Filter } from "lucide-react";

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

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

                setMatches(calculatedMatches);
            }
            setLoading(false);
        };
        fetchMatches();
    }, []);

    const filteredMatches = matches.filter(m => {
        if (filter === "high") return m.score >= 80;
        return true;
    });

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-display font-black text-slate-900 mb-2">Your <span className="text-pink-500">Connections</span></h1>
                    <p className="text-slate-500 font-bold">Discover students with complementary skills and interests.</p>
                </div>

                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="doodle-input py-2 text-sm bg-white"
                    >
                        <option value="all">All Matches</option>
                        <option value="high">High Compatibility (80%+)</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : filteredMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMatches.map(match => (
                        <MatchCard key={match.user.uid} match={match} />
                    ))}
                </div>
            ) : (
                <div className="text-center p-12 doodle-card bg-slate-50 border-dashed">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-pink-100 border-2 border-slate-800 shadow-[4px_4px_0px_#1e293b] rounded-3xl rotate-3">
                            <Sparkles className="text-pink-500 text-4xl" size={48} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">No matches found for this filter</h3>
                    <p className="text-slate-500 font-medium">Try updating your profile skills or adjusting the filter.</p>
                </div>
            )}
        </div>
    );
}
