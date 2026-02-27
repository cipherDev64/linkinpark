import { useState, useEffect } from "react";
import { getUserById, updateUserProfile } from "../services/userService";
import { getCurrentUser } from "../services/authService";
import { ArrowRight, CheckCircle2, X } from "lucide-react";

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
                // If they don't have a department set, assume they are new
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white border-4 border-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-[8px_8px_0px_#1e293b] relative">

                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    <div className={`h-2 flex-1 rounded-full border-2 border-slate-800 ${step >= 1 ? 'bg-pink-400' : 'bg-slate-200'}`}></div>
                    <div className={`h-2 flex-1 rounded-full border-2 border-slate-800 ${step >= 2 ? 'bg-pink-400' : 'bg-slate-200'}`}></div>
                </div>

                {step === 1 && (
                    <div className="space-y-6 animate-slide-in">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-display font-black text-slate-900 mb-2">Welcome to LinkInPark! 👋</h2>
                            <p className="text-slate-500 font-medium">Let's get your profile set up so you can start finding amazing teammates.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">What's your department?</label>
                            <input
                                autoFocus
                                type="text"
                                className="w-full doodle-input"
                                placeholder="e.g. Computer Science"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">What year are you in?</label>
                            <select
                                className="w-full doodle-input py-3 appearance-none bg-white"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            >
                                <option value="">Select Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!formData.department || !formData.year}
                            className="w-full btn-doodle btn-doodle-primary mt-4"
                        >
                            Next <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-slide-in">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-display font-black text-slate-900 mb-2">Your Superpowers ⚡</h2>
                            <p className="text-slate-500 font-medium">What do you bring to the table?</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Role Preference</label>
                            <input
                                autoFocus
                                type="text"
                                className="w-full doodle-input"
                                placeholder="e.g. UX Designer, Backend Dev"
                                value={formData.rolePreference}
                                onChange={(e) => setFormData({ ...formData, rolePreference: e.target.value })}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Top Skills</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                                    className="doodle-input flex-1" placeholder="e.g. React, Python"
                                />
                                <button onClick={handleAddSkill} className="btn-doodle px-4">+</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map(skill => (
                                    <span key={skill} className="px-3 py-1 font-bold bg-blue-100 text-slate-800 text-sm rounded-full flex items-center gap-2 border-2 border-slate-800">
                                        {skill}
                                        <button onClick={() => setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) })} className="hover:text-red-500"><X size={14} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <button onClick={() => setStep(1)} className="btn-doodle w-1/3">Back</button>
                            <button
                                onClick={handleSave}
                                disabled={!formData.rolePreference || formData.skills.length === 0}
                                className="flex-1 btn-doodle btn-doodle-primary"
                            >
                                Finish Setup <CheckCircle2 size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
