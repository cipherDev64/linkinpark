import { useState, useEffect } from "react";
import { getUserById, updateUserProfile } from "../services/userService";
import { getCurrentUser } from "../services/authService";
import { ArrowRight, CheckCircle2, X, Sparkles, Rocket, Zap, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingModal({ onComplete }) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        department: "",
        year: "",
        rolePreference: "",
        skills: [],
    });
    const [skillInput, setSkillInput] = useState("");

    useEffect(() => {
        const checkNewUser = async () => {
            const user = getCurrentUser();
            if (user) {
                const data = await getUserById(user.uid);
                if (data && !data.department) {
                    setIsOpen(true);
                } else if (data && data.department) {
                    onComplete && onComplete();
                }
            }
            setLoading(false);
        };
        checkNewUser();
    }, [onComplete]);

    if (!isOpen || loading) return null;

    const handleNext = () => setStep(prev => prev + 1);

    const handleSave = async () => {
        const user = getCurrentUser();
        if (user) {
            await updateUserProfile(user.uid, formData);
            setIsOpen(false);
            onComplete && onComplete();
        }
    };

    const handleAddSkill = () => {
        const trimmed = skillInput.trim();
        if (trimmed && !formData.skills.includes(trimmed)) {
            setFormData({ ...formData, skills: [...formData.skills, trimmed] });
        }
        setSkillInput("");
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex justify-center items-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[40px] p-10 max-w-xl w-full shadow-premium relative overflow-hidden"
            >
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -ml-20 -mb-20" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Sparkles size={20} />
                        </div>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "50%" }}
                                animate={{ width: step === 1 ? "50%" : "100%" }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Step {step}/2</span>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-heading leading-tight tracking-tight">Initialize Your Node</h2>
                                    <p className="text-slate-500 font-medium mt-2">Let's configure your identity in the campus network.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Department</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            className="saas-input w-full"
                                            placeholder="e.g. Computer Science"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Year of Study</label>
                                        <select
                                            className="saas-input w-full appearance-none font-bold"
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        >
                                            <option value="">Select current phase</option>
                                            <option value="1">Alpha (1st Year)</option>
                                            <option value="2">Beta (2nd Year)</option>
                                            <option value="3">Gamma (3rd Year)</option>
                                            <option value="4">Delta (4th Year)</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={!formData.department || !formData.year}
                                    className="w-full h-14 btn-primary text-base disabled:opacity-50 disabled:grayscale transition-all shadow-premium"
                                >
                                    Proceed to Specs <ArrowRight size={20} />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-heading leading-tight tracking-tight">Capability Matrix</h2>
                                    <p className="text-slate-500 font-medium mt-2">Define your technical arsenal and role preference.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role Identity</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            className="saas-input w-full"
                                            placeholder="e.g. Backend Architect"
                                            value={formData.rolePreference}
                                            onChange={(e) => setFormData({ ...formData, rolePreference: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Core Arsenal</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={skillInput}
                                                onChange={e => setSkillInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                                                className="saas-input flex-1"
                                                placeholder="Add skill (e.g. Rust)"
                                            />
                                            <button onClick={handleAddSkill} className="w-12 h-12 rounded-xl bg-slate-50 border border-border flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                                                <Zap size={20} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {formData.skills.map(skill => (
                                                <span key={skill} className="h-9 px-4 rounded-xl bg-primary/5 text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-primary/10">
                                                    {skill}
                                                    <button onClick={() => setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) })} className="hover:text-red-500 transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="h-14 px-8 rounded-2xl bg-slate-50 border border-border text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={!formData.rolePreference || formData.skills.length === 0}
                                        className="flex-1 h-14 btn-primary text-base shadow-premium disabled:opacity-50"
                                    >
                                        Sync Now <CheckCircle2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
