import React from "react";

export const AVATAR_COLORS = [
    { id: "blue", bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-700" },
    { id: "pink", bg: "bg-pink-100", border: "border-pink-300", text: "text-pink-700" },
    { id: "emerald", bg: "bg-emerald-100", border: "border-emerald-300", text: "text-emerald-700" },
    { id: "amber", bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-700" },
    { id: "purple", bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-700" },
    { id: "rose", bg: "bg-rose-100", border: "border-rose-300", text: "text-rose-700" },
    { id: "cyan", bg: "bg-cyan-100", border: "border-cyan-300", text: "text-cyan-700" },
    { id: "indigo", bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-700" },
];

export const POPULAR_EMOJIS = ["🚀", "🎸", "🎮", "👾", "🎨", "💻", "☕", "🍕", "🌟", "🔥", "🎧", "🌈"];

export default function Avatar({ user, config, className = "w-12 h-12 text-lg" }) {
    if (!user) return null;

    // Default fallback styles if no config is present
    const defaultColor = AVATAR_COLORS[0];

    // Use user's saved config or derive deterministic defaults based on email
    let colorTheme = defaultColor;
    let displayContent = user.displayName ? user.displayName.charAt(0).toUpperCase() : "?";

    if (config) {
        if (config.colorId) {
            const foundTheme = AVATAR_COLORS.find(c => c.id === config.colorId);
            if (foundTheme) colorTheme = foundTheme;
        }
        if (config.emoji) {
            displayContent = config.emoji;
        }
    } else {
        // Deterministic fallback color based on email length
        const charCode = user.email ? user.email.charCodeAt(0) : 0;
        const colorIndex = charCode % AVATAR_COLORS.length;
        colorTheme = AVATAR_COLORS[colorIndex];
    }

    return (
        <div
            className={`flex items-center justify-center rounded-2xl font-black shadow-sm ${colorTheme.bg} ${colorTheme.text} ${colorTheme.border} border-2 ${className}`}
            title={user.displayName}
        >
            {displayContent}
        </div>
    );
}
