import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";
import { getCurrentUser } from "../services/authService";
import { calculateCompatibility } from "../services/matchService";
import MatchCard from "../components/MatchCard";
import { Sparkles } from "lucide-react";

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndCalculate = async () => {
            const allUsers = await getAllUsers();
            const currentUserAuth = getCurrentUser();

            const currentUserData = allUsers.find(u => u.uid === currentUserAuth?.uid);

            if (!currentUserData) {
                setLoading(false);
                return;
            }

            const calculatedMatches = allUsers
                .filter(u => u.uid !== currentUserAuth.uid)
                .map(u => ({
                    user: u,
                    score: calculateCompatibility(currentUserData, u)
                }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);

            setMatches(calculatedMatches);
            setLoading(false);
        };

        fetchAndCalculate();
    }, []);

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-neonPink/20 rounded-xl">
                    <Sparkles className="text-neonPink" size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-bold">Top <span className="neon-text-pink">Matches</span></h1>
                    <p className="text-gray-400 mt-1">AI-powered compatibility scoring based on skills and interests</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="w-12 h-12 border-4 border-neonPink border-t-transparent rounded-full animate-spin glow"></div>
                </div>
            ) : matches.length === 0 ? (
                <div className="glass-card p-12 text-center text-gray-400">
                    No matches found. Try updating your profile with more skills and interests!
                </div>
            ) : (
                <div className="space-y-6">
                    {matches.map((match, idx) => (
                        <MatchCard key={match.user.uid} match={match} rank={idx + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}
