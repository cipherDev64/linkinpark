import { useEffect, useState } from "react";
import { getUserById, updateUserProfile } from "../services/userService";
import { getCurrentUser } from "../services/authService";
import toast from "react-hot-toast";
import Avatar, { AVATAR_COLORS, POPULAR_EMOJIS } from "../components/Avatar";
import { Save, X, Plus, Github, Linkedin, Globe, Briefcase, ShieldCheck, Sparkles, User, Award, UserPlus, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToConnections, acceptConnection } from "../services/connectionService";

export default function Profile() {
    const [profile, setProfile] = useState({
        displayName: "",
        username: "",
        department: "",
        year: "",
        bio: "",
        github: "",
        linkedin: "",
        portfolio: "",
        rolePreference: "",
        availability: "Available",
        skills: [],
        interests: [],
        projects: [],
        badges: [],
        avatarConfig: { colorId: "blue", emoji: "" }
    });
    const [userContext, setUserContext] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("identity");

    const [skillInput, setSkillInput] = useState("");
    const [interestInput, setInterestInput] = useState("");
    const [requests, setRequests] = useState([]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const user = getCurrentUser();
            if (user) {
                setUserContext(user);
                const data = await getUserById(user.uid);
                if (data) {
                    setProfile({
                        displayName: data.displayName || "",
                        username: data.username || "",
                        department: data.department || "",
                        year: data.year || "",
                        bio: data.bio || "",
                        github: data.github || "",
                        linkedin: data.linkedin || "",
                        portfolio: data.portfolio || "",
                        rolePreference: data.rolePreference || "",
                        availability: data.availability || "Available",
                        skills: data.skills || [],
                        interests: data.interests || [],
                        projects: data.projects || [],
                        badges: data.badges || [],
                        avatarConfig: data.avatarConfig || { colorId: "blue", emoji: "" }
                    });
                }
            }
            setLoading(false);
        };
        fetchProfile();

        const user = getCurrentUser();
        let unsubscribe;
        if (user) {
            unsubscribe = subscribeToConnections(user.uid, (reqs) => {
                setRequests(reqs.filter(r => r.status === "pending"));
            });
        }

        return () => unsubscribe && unsubscribe();
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
        if (saving) return;
        setSaving(true);
        const toastId = toast.loading("Syncing profile data...");
        try {
            const user = getCurrentUser();
            if (user) {
                await updateUserProfile(user.uid, profile);
                toast.success("Identity Updated!", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Sync failed.", { id: toastId });
        }
        setSaving(false);
    };

    const handleAcceptRequest = async (reqId) => {
        try {
            await acceptConnection(reqId);
            toast.success("Identity Linked!");
        } catch (error) {
            toast.error("Handshake failed");
        }
    };

    if (loading) return <div className="p-20 text-center text-slate-400 font-bold animate-pulse">Syncing Identity...</div>;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-10 pb-20"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-heading">Student Node</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your identity and network connections.</p>
                </div>
                {activeTab === 'identity' && (
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="h-12 px-6 rounded-2xl bg-white border border-border text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="h-12 px-8 btn-primary shadow-premium flex items-center gap-2"
                        >
                            {saving ? <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> Update Node</>}
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Tabs */}
            <motion.div variants={itemVariants} className="flex gap-8 border-b border-border pb-px">
                <button
                    onClick={() => setActiveTab('identity')}
                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'identity' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Identity Settings
                    {activeTab === 'identity' && <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('network')}
                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'network' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Network & Connections
                    {requests.length > 0 && <span className="ml-2 bg-primary text-[10px] text-white px-1.5 py-0.5 rounded-full">{requests.length}</span>}
                    {activeTab === 'network' && <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                </button>
            </motion.div>

            <AnimatePresence mode="wait">
                {activeTab === 'identity' ? (
                    <motion.div
                        key="identity"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                    >
                        <div className="space-y-8">
                            <div className="saas-card overflow-hidden bg-white">
                                <div className="h-32 bg-gradient-to-br from-primary via-primary-hover to-accent" />
                                <div className="px-8 pb-10 relative">
                                    <div className="flex justify-center -mt-16 mb-6">
                                        <div className="p-2 bg-bg rounded-[40px] shadow-premium">
                                            <Avatar user={userContext} config={profile.avatarConfig} className="w-28 h-28 text-5xl rounded-[32px] shadow-soft" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h2 className="text-2xl font-black text-heading leading-tight">{profile.displayName || "Node User"}</h2>
                                        <p className="text-primary font-bold text-sm">@{profile.username || "node_user"}</p>
                                        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                                            <ShieldCheck size={14} className="text-primary" /> Verified Student
                                        </p>
                                    </div>
                                    <div className="mt-10 pt-10 border-t border-border space-y-8">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Color Spectrum</label>
                                            <div className="flex gap-4 flex-wrap justify-center">
                                                {AVATAR_COLORS.map(color => (
                                                    <button
                                                        key={color.id}
                                                        onClick={() => setProfile({ ...profile, avatarConfig: { ...profile.avatarConfig, colorId: color.id } })}
                                                        className={`w-9 h-9 rounded-2xl ${color.bg} transition-all duration-300 relative ${profile.avatarConfig.colorId === color.id ? 'scale-110 shadow-lg ring-2 ring-primary ring-offset-4 ring-offset-bg' : 'opacity-60 hover:opacity-100'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Icon</label>
                                            <div className="flex gap-3 flex-wrap justify-center">
                                                <button
                                                    onClick={() => setProfile({ ...profile, avatarConfig: { ...profile.avatarConfig, emoji: "" } })}
                                                    className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all ${!profile.avatarConfig.emoji ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-300 hover:border-slate-200'}`}
                                                >
                                                    <User size={18} />
                                                </button>
                                                {POPULAR_EMOJIS.map(emoji => (
                                                    <button
                                                        key={emoji}
                                                        onClick={() => setProfile({ ...profile, avatarConfig: { ...profile.avatarConfig, emoji } })}
                                                        className={`w-10 h-10 rounded-2xl text-lg flex items-center justify-center border-2 transition-all ${profile.avatarConfig.emoji === emoji ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-10">
                            <div className="saas-card bg-white p-10 space-y-10">
                                <h2 className="text-xl font-bold text-heading flex items-center gap-3">
                                    <Sparkles className="text-accent" size={20} /> Core Attributes
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Display Name</label>
                                        <input
                                            type="text" name="displayName" value={profile.displayName} onChange={handleChange}
                                            className="saas-input w-full" placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Username (@)</label>
                                        <input
                                            type="text" name="username" value={profile.username}
                                            onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                            className="saas-input w-full" placeholder="john_doe"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                                        <input
                                            type="text" name="department" value={profile.department} onChange={handleChange}
                                            className="saas-input w-full" placeholder="Software Engineering"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Graduation Cycle</label>
                                        <select name="year" value={profile.year} onChange={handleChange} className="saas-input w-full">
                                            <option value="">Status Pending</option>
                                            <option value="1">Alpha (1st Year)</option>
                                            <option value="2">Beta (2nd Year)</option>
                                            <option value="3">Gamma (3rd Year)</option>
                                            <option value="4">Delta (4th Year)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Bio Transmission</label>
                                    <textarea
                                        name="bio" value={profile.bio} onChange={handleChange}
                                        className="saas-input w-full h-32 resize-none" placeholder="Tell the network about your journey..."
                                    />
                                </div>
                            </div>
                            <div className="saas-card bg-white p-10 space-y-10">
                                <h2 className="text-xl font-bold text-heading">Competency Matrix</h2>
                                <TagSection label="Technical Arsenal" items={profile.skills} onAdd={(v) => handleAddTag('skills', v, setSkillInput)} onRemove={(t) => handleRemoveTag('skills', t)} value={skillInput} onValueChange={setSkillInput} placeholder="Add skill..." theme="primary" />
                                <TagSection label="Domain Interests" items={profile.interests} onAdd={(v) => handleAddTag('interests', v, setInterestInput)} onRemove={(t) => handleRemoveTag('interests', t)} value={interestInput} onValueChange={setInterestInput} placeholder="Add domain..." theme="accent" />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="network"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-10"
                    >
                        <div className="saas-card bg-white p-10 space-y-8">
                            <h3 className="text-xl font-bold text-heading flex items-center gap-3">
                                <UserPlus className="text-primary" size={20} /> Incoming Requests
                            </h3>
                            <div className="space-y-4">
                                {requests.length > 0 ? requests.map(req => (
                                    <div key={req.id} className="bg-slate-50 p-6 rounded-3xl border border-border flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-heading">{req.fromName}</h4>
                                            <p className="text-xs text-slate-400 font-bold">@{req.fromUsername}</p>
                                        </div>
                                        <button onClick={() => handleAcceptRequest(req.id)} className="h-10 px-6 btn-primary text-xs">Accept</button>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/30">
                                        <p className="text-slate-400 font-bold">No active requests</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="saas-card bg-white p-10 space-y-8">
                            <h3 className="text-xl font-bold text-heading flex items-center gap-3">
                                <Globe className="text-accent" size={20} /> My Roster
                            </h3>
                            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/30">
                                <p className="text-slate-400 font-bold">Scanning connections...</p>
                                <p className="text-xs text-slate-300 mt-2">Accepted collaborators appear here.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function SocialInput({ icon, name, value, onChange, placeholder }) {
    return (
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>
            <input type="text" name={name} value={value} onChange={onChange} className="saas-input pl-12 w-full text-xs font-bold" placeholder={placeholder} />
        </div>
    );
}

function TagSection({ label, items, onAdd, onRemove, value, onValueChange, placeholder, theme }) {
    return (
        <div className="space-y-6">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
            <div className="flex gap-3">
                <input type="text" value={value} onChange={e => onValueChange(e.target.value)} onKeyDown={e => e.key === 'Enter' && onAdd(value)} className="saas-input flex-1 h-12 px-6" placeholder={placeholder} />
                <button onClick={() => onAdd(value)} className="h-12 w-12 btn-secondary rounded-2xl flex items-center justify-center p-0"><Plus size={20} /></button>
            </div>
            <div className="flex flex-wrap gap-3">
                <AnimatePresence>
                    {items.map(item => (
                        <motion.span key={item} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`h-10 pl-4 pr-2 rounded-xl flex items-center gap-3 text-xs font-bold ${theme === 'primary' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-accent/10 text-accent border border-accent/20'}`}>
                            {item}
                            <button onClick={() => onRemove(item)} className="h-6 w-6 rounded-lg bg-black/5 flex items-center justify-center"><X size={12} /></button>
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
