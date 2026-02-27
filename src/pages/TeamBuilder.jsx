import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";
import { getCurrentUser } from "../services/authService";
import { calculateCompatibility } from "../services/matchService";
import { createTeam } from "../services/teamService";
import { useNavigate } from "react-router-dom";
import { Plus, Users, ArrowRight } from "lucide-react";
import MatchCard from "../components/MatchCard";

export default function TeamBuilder() {
    const [skillsNeeded, setSkillsNeeded] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [recommended, setRecommended] = useState([]);
    const [users, setUsers] = useState([]);
    const [me, setMe] = useState(null);
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const currentUser = getCurrentUser();
            if (!currentUser) return;
            const all = await getAllUsers();
            setUsers(all);
            setMe(all.find(u => u.uid === currentUser.uid));
        };
        fetchUsers();
    }, []);

    const handleAddSkill = () => {
        const val = skillInput.trim();
        if (val && !skillsNeeded.includes(val)) {
            setSkillsNeeded([...skillsNeeded, val]);
            findMatches([...skillsNeeded, val]);
        }
        setSkillInput("");
    };

    const handleRemoveSkill = (skill) => {
        const newSkills = skillsNeeded.filter(s => s !== skill);
        setSkillsNeeded(newSkills);
        findMatches(newSkills);
    };

    const findMatches = (skills) => {
        if (!me || skills.length === 0) {
            setRecommended([]);
            return;
        }

        const matches = users
            .filter(u => u.uid !== me.uid)
            .map(u => {
                const hasNeededSkills = (u.skills || []).some(s => skills.some(req => req.toLowerCase() === s.toLowerCase()));
                if (!hasNeededSkills) return null;

                const { score, explanation } = calculateCompatibility(me, u);
                return {
                    user: u,
                    score: score + 10,
                    explanation: `Has requested skill. ${explanation}`
                };
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score);

        setRecommended(matches);
    };

    const handleCreateRoom = async () => {
        setCreating(true);
        try {
            const roomId = await createTeam(
                "New Project Team",
                "A clean slate to build something great.",
                skillsNeeded
            );
            navigate(`/room/${roomId}`);
        } catch (e) {
            console.error(e);
        }
        setCreating(false);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-display font-black text-slate-900 mb-8">Team <span className="text-blue-500">Builder</span></h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1 space-y-6">
                    <div className="doodle-card p-6 bg-[#ebf8ff]">
                        <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                            <Users size={20} /> Who do you need?
                        </h2>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                className="doodle-input flex-1 py-2 text-sm"
                                placeholder="E.g. React, UX, Database"
                                value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                            />
                            <button onClick={handleAddSkill} className="btn-doodle px-3 py-2">
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {skillsNeeded.map(skill => (
                                <span key={skill} className="text-xs font-bold bg-white text-slate-700 px-3 py-1.5 rounded-full border border-slate-300 flex items-center gap-1 shadow-sm">
                                    {skill}
                                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500 ml-1">X</button>
                                </span>
                            ))}
                            {skillsNeeded.length === 0 && (
                                <span className="text-sm italic text-slate-500">Add some skills to find teammates.</span>
                            )}
                        </div>

                        <button
                            onClick={handleCreateRoom}
                            disabled={creating}
                            className="w-full btn-doodle btn-doodle-primary"
                        >
                            {creating ? "Creating..." : <><ArrowRight size={18} /> Create Project Room</>}
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-display font-bold">Recommended Peers</h2>
                        {recommended.length > 0 && <span className="text-sm bg-pink-100 border border-pink-200 text-pink-800 px-3 py-1 rounded-full font-bold shadow-sm">{recommended.length} found</span>}
                    </div>

                    {skillsNeeded.length === 0 ? (
                        <div className="doodle-card p-12 text-center bg-white border-dashed">
                            <p className="text-slate-500 font-bold mb-2">Search for skills to see recommendations.</p>
                            <p className="text-sm text-slate-400">Add the tools and languages you need for your project.</p>
                        </div>
                    ) : recommended.length === 0 ? (
                        <div className="doodle-card p-12 text-center bg-white border-dashed">
                            <p className="text-slate-500 font-bold">No one perfectly matches those skills yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recommended.map(match => (
                                <MatchCard key={match.user.uid} match={match} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
