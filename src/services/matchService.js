export const intersection = (arr1, arr2) => {
    return arr1.filter(value => arr2.includes(value));
};

export const calculateCompatibility = (userA, userB) => {
    if (!userA || !userB || userA.uid === userB.uid) return { score: 0, explanation: "" };
    let score = 0;
    let explanationParts = [];

    const aSkills = userA.skills || [];
    const bSkills = userB.skills || [];
    const aInterests = userA.interests || [];
    const bInterests = userB.interests || [];

    // Department match -> 10%
    if (userA.department && userB.department && userA.department.toLowerCase() === userB.department.toLowerCase()) {
        score += 10;
        explanationParts.push(`Same Department`);
    }

    // Skill overlap -> 40%
    const sharedSkills = intersection(aSkills, bSkills);
    const maxSkills = Math.max(aSkills.length, bSkills.length);
    if (maxSkills > 0) {
        score += (sharedSkills.length / maxSkills) * 40;
    }
    if (sharedSkills.length > 0) {
        explanationParts.push(`Shared Skills (${sharedSkills.slice(0, 2).join(', ')})`);
    }

    // Interest overlap -> 30%
    const sharedInterests = intersection(aInterests, bInterests);
    const maxInterests = Math.max(aInterests.length, bInterests.length);
    if (maxInterests > 0) {
        score += (sharedInterests.length / maxInterests) * 30;
    }
    if (sharedInterests.length > 0) {
        explanationParts.push(`Shared Interests`);
    }

    // Complementary skills -> 20%
    const distinctSkillsCount = new Set([...aSkills, ...bSkills]).size - sharedSkills.length;
    score += Math.min((distinctSkillsCount / 5) * 20, 20);

    if (distinctSkillsCount > 2) {
        explanationParts.push(`Complementary Skills`);
    }

    // Normalize score to be between 60 and 95 to prevent discouraging users
    if (score > 0) {
        score = 60 + (score * 0.35); // Max 60 + 35 = 95
    }

    const explanation = explanationParts.length > 0
        ? `Matched because: ${explanationParts.join(' & ')}`
        : "Matched based on general profile data.";

    return {
        score: Math.round(score),
        explanation
    };
};
