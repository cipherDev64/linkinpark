import { useState } from "react";
import { getAllUsers } from "../services/userService";
import { getCurrentUser } from "../services/authService";
import { calculateCompatibility } from "../services/matchService";
import MatchCard from "../components/MatchCard";
import { FlaskConical, Search, X } from "lucide-react";

export default function TeamBuilder() {
    const [idea, setIdea] = useState("");
    const [requiredSkills, setRequiredSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [recommended, setRecommended] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleAddSkill = () => {
        const trimmed = skillInput.trim();
        if (trimmed && !requiredSkills.includes(trimmed)) {
            setRequiredSkills([...requiredSkills, trimmed]);
        }
        setSkillInput("");
    };

    const handleFindTeam = async () => {
        if (requiredSkills.length === 0) return;
        setSearching(true);

        const allUsers = await getAllUsers();
        const currentUserAuth = getCurrentUser();

        const mockRequirementUser = {
            uid: "requirement_mock",
            skills: requiredSkills,
            interests: [],
        };

        const recommendations = allUsers
            .filter(u => u.uid !== currentUserAuth?.uid)
            .map(u => {
                const score = calculateCompatibility(mockRequirementUser, u);
                return { user: u, score };
            })
            .filter(m => m.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        setRecommended(recommendations);
        setSearching(false);
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-neonBlue/20 rounded-xl">
                    <FlaskConical className="text-neonBlue" size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-bold"><span className="neon-text-blue">Team</span> Builder</h1>
                    <p className="text-gray-400 mt-1">Input your project idea and required skills to find the perfect teammates.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 glass-card p-6 h-fit">
                    <h2 className="text-xl font-bold mb-4">Project Requirements</h2>

                    <div className="mb-4">
                        <label className="block text-sm text-gray-400 mb-2">Project Idea</label>
                        <textarea
                            value={idea} onChange={e => setIdea(e.target.value)}
                            className="w-full glass-input h-24 resize-none"
                            placeholder="Describe your hackathon or project idea..."
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm text-gray-400 mb-2">Required Skills (Tags)</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                                className="flex-1 glass-input" placeholder="e.g. Node.js, UI/UX"
                            />
                            <button
                                onClick={handleAddSkill}
                                className="p-2 bg-neonBlue/20 text-neonBlue rounded-xl hover:bg-neonBlue/40 transition font-bold"
                            >
                                +
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {requiredSkills.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-neonBlue/10 text-neonBlue text-sm rounded-full flex items-center gap-2 border border-neonBlue/30">
                                    {skill}
                                    <button onClick={() => setRequiredSkills(requiredSkills.filter(s => s !== skill))} className="hover:text-white"><X size={14} /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleFindTeam}
                        disabled={searching || requiredSkills.length === 0}
                        className="w-full btn-neon btn-neon-primary flex justify-center items-center gap-2"
                    >
                        {searching ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin glow"></div> : <><Search size={20} /> Find Teammates</>}
                    </button>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        Top Recommendations
                        {recommended.length > 0 && <span className="text-sm bg-neonPink/20 text-neonPink px-3 py-1 rounded-full">{recommended.length} found</span>}
                    </h2>

                    {recommended.length === 0 && !searching && (
                        <div className="glass-card p-12 text-center text-gray-400 border border-dashed border-white/20">
                            Enter required skills and click Find Teammates to see recommendations.
                        </div>
                    )}

                    {!searching && recommended.map((match, idx) => (
                        <MatchCard key={match.user.uid} match={match} rank={idx + 1} />
                    ))}
                </div>
            </div>
        </div>
    );
}
