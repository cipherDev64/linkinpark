export const intersection = (arr1, arr2) => {
    return arr1.filter(value => arr2.includes(value));
};

export const calculateCompatibility = (userA, userB) => {
    if (!userA || !userB || userA.uid === userB.uid) return 0;
    let score = 0;

    const aSkills = userA.skills || [];
    const bSkills = userB.skills || [];
    const aInterests = userA.interests || [];
    const bInterests = userB.interests || [];

    // Department match -> 10%
    if (userA.department && userB.department && userA.department.toLowerCase() === userB.department.toLowerCase()) {
        score += 10;
    }

    // Skill overlap -> 40%
    const sharedSkills = intersection(aSkills, bSkills);
    const maxSkills = Math.max(aSkills.length, bSkills.length);
    if (maxSkills > 0) {
        score += (sharedSkills.length / maxSkills) * 40;
    }

    // Interest overlap -> 30%
    const sharedInterests = intersection(aInterests, bInterests);
    const maxInterests = Math.max(aInterests.length, bInterests.length);
    if (maxInterests > 0) {
        score += (sharedInterests.length / maxInterests) * 30;
    }

    // Complementary skills -> 20%
    // More unique skills combined means better complementary fit.
    const distinctSkillsCount = new Set([...aSkills, ...bSkills]).size - sharedSkills.length;
    // Let's cap at 5 distinctive skills giving full 20 points
    score += Math.min((distinctSkillsCount / 5) * 20, 20);

    return Math.round(score);
};
