import { CheckCircle2, User as UserIcon } from "lucide-react";

export default function MatchCard({ match, rank }) {
    const { user, score } = match;

    return (
        <div className="glass-card p-6 flex flex-col md:flex-row gap-6 items-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-neonBlue/20 text-neonBlue px-4 py-1 rounded-bl-2xl font-black text-xl border-b border-l border-neonBlue/30">
                #{rank}
            </div>

            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 relative">
                <UserIcon size={32} className="text-gray-400" />
                {score > 80 && (
                    <div className="absolute -bottom-2 -right-2 bg-neonPink text-white rounded-full p-1 shadow-[0_0_10px_#ff00aa]">
                        <CheckCircle2 size={16} />
                    </div>
                )}
            </div>

            <div className="flex-1 w-full text-center md:text-left">
                <h3 className="text-2xl font-bold mb-1 group-hover:neon-text-blue transition-all">{user.name}</h3>
                <p className="text-gray-400 mb-3">{user.department} {user.year ? `• Year ${user.year}` : ''}</p>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {(user.skills || []).slice(0, 4).map(skill => (
                        <span key={skill} className="px-3 py-1 bg-neonBlue/10 text-neonBlue text-sm rounded-full border border-neonBlue/30 shadow-sm">
                            {skill}
                        </span>
                    ))}
                    {(user.skills || []).length > 4 && (
                        <span className="px-3 py-1 bg-white/5 text-gray-400 text-sm rounded-full border border-white/10">
                            +{(user.skills || []).length - 4} more
                        </span>
                    )}
                </div>
            </div>

            <div className="w-full md:w-48 flex flex-col items-center justify-center">
                <div className="text-sm text-gray-400 mb-2">Compatibility</div>
                <div className="text-4xl font-black neon-text-pink mb-3">{score}%</div>

                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-neonPink shadow-[0_0_10px_#ff00aa] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
