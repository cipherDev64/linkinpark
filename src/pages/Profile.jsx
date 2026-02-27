import { useEffect, useState } from "react";
import { getUserById, updateUserProfile } from "../services/userService";
import { getCurrentUser } from "../services/authService";
import { Save, X, Plus } from "lucide-react";

export default function Profile() {
    const [profile, setProfile] = useState({
        department: "",
        year: "",
        skills: [],
        interests: [],
        careerGoal: "",
        projects: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [skillInput, setSkillInput] = useState("");
    const [interestInput, setInterestInput] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const user = getCurrentUser();
            if (user) {
                const data = await getUserById(user.uid);
                if (data) {
                    setProfile({
                        department: data.department || "",
                        year: data.year || "",
                        skills: data.skills || [],
                        interests: data.interests || [],
                        careerGoal: data.careerGoal || "",
                        projects: data.projects || []
                    });
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleAddTag = (field, value, setter) => {
        const trimmed = value.trim();
        if (trimmed && !profile[field].includes(trimmed)) {
            setProfile({ ...profile, [field]: [...profile[field], trimmed] });
        }
        setter("");
    };

    const handleRemoveTag = (field, tagToRemove) => {
        setProfile({ ...profile, [field]: profile[field].filter(t => t !== tagToRemove) });
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            const user = getCurrentUser();
            if (user) {
                await updateUserProfile(user.uid, profile);
                setMessage("Profile updated successfully!");
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (error) {
            console.error(error);
            setMessage("Failed to update profile.");
        }
        setSaving(false);
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-400">Loading profile...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <h1 className="text-4xl font-bold mb-8">Your <span className="neon-text-blue">Profile</span></h1>

            {message && (
                <div className="mb-6 px-4 py-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 space-y-6">
                    <h2 className="text-xl font-bold border-b border-white/10 pb-4">Basic Information</h2>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Department</label>
                        <input
                            type="text" name="department" value={profile.department} onChange={handleChange}
                            className="w-full glass-input" placeholder="e.g. Computer Science"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Year of Study</label>
                        <select name="year" value={profile.year} onChange={handleChange} className="w-full glass-input bg-darkBg text-white focus:bg-darkBg">
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Career Goal</label>
                        <input
                            type="text" name="careerGoal" value={profile.careerGoal} onChange={handleChange}
                            className="w-full glass-input" placeholder="e.g. Full Stack Developer"
                        />
                    </div>
                </div>

                <div className="glass-card p-8 space-y-6">
                    <h2 className="text-xl font-bold border-b border-white/10 pb-4">Attributes</h2>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Skills</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddTag('skills', skillInput, setSkillInput)}
                                className="flex-1 glass-input" placeholder="e.g. React, Python"
                            />
                            <button
                                onClick={() => handleAddTag('skills', skillInput, setSkillInput)}
                                className="p-2 bg-neonBlue/20 text-neonBlue rounded-xl hover:bg-neonBlue/40 transition"
                            >
                                <Plus size={24} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-neonBlue/10 text-neonBlue text-sm rounded-full flex items-center gap-2 border border-neonBlue/30">
                                    {skill}
                                    <button onClick={() => handleRemoveTag('skills', skill)} className="hover:text-white"><X size={14} /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2 mt-6">Interests</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text" value={interestInput} onChange={e => setInterestInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddTag('interests', interestInput, setInterestInput)}
                                className="flex-1 glass-input" placeholder="e.g. AI, Cybersec"
                            />
                            <button
                                onClick={() => handleAddTag('interests', interestInput, setInterestInput)}
                                className="p-2 bg-neonPink/20 text-neonPink rounded-xl hover:bg-neonPink/40 transition"
                            >
                                <Plus size={24} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profile.interests.map(interest => (
                                <span key={interest} className="px-3 py-1 bg-neonPink/10 text-neonPink text-sm rounded-full flex items-center gap-2 border border-neonPink/30">
                                    {interest}
                                    <button onClick={() => handleRemoveTag('interests', interest)} className="hover:text-white"><X size={14} /></button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-neon btn-neon-primary flex items-center gap-2 px-8"
                >
                    {saving ? "Saving..." : <><Save size={20} /> Save Profile</>}
                </button>
            </div>
        </div>
    );
}
