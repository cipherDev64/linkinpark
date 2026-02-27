export const generateGraphData = (users, currentUser) => {
    const nodes = users.map(user => {
        const isCurrent = currentUser && user.uid === currentUser.uid;
        return {
            id: user.uid,
            label: user.name,
            isCurrentUser: isCurrent,
            // Current user is distinct (e.g., Pink). Others are base neon blue.
            color: isCurrent ? "#ff00aa" : "#00f0ff",
            val: isCurrent ? 15 : 10,
            user
        };
    });

    const links = [];
    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            const u1 = users[i];
            const u2 = users[j];
            const s1 = u1.skills || [];
            const s2 = u2.skills || [];

            const shared = s1.filter(s => s2.includes(s));
            if (shared.length >= 1) {
                links.push({
                    source: u1.uid,
                    target: u2.uid,
                    sharedSkills: shared.length
                });
            }
        }
    }

    return { nodes, links };
};
