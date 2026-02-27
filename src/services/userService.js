import { db } from "../firebase";
import { collection, doc, setDoc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { logActivity } from "./activityService";

export const createUserIfNotExists = async (user) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    const baseData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || "Node User",
        username: user.email?.split('@')[0] || "node_user",
        photoURL: user.photoURL || "",
    };

    if (!docSnap.exists()) {
        await setDoc(userRef, {
            ...baseData,
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
            badges: ["Pioneer"],
            avatarConfig: { colorId: "blue", emoji: "" }
        });
        await logActivity("USER_JOINED", baseData);
    } else {
        const data = docSnap.data();
        // If critical fields are missing, sync them
        if (!data.displayName || !data.uid || !data.username) {
            await setDoc(userRef, {
                uid: data.uid || user.uid,
                email: data.email || user.email,
                displayName: data.displayName || user.displayName || user.email?.split('@')[0] || "Node User",
                username: data.username || user.email?.split('@')[0] || "node_user",
            }, { merge: true });
        }
    }
};

const sanitizeName = (name, email) => {
    if (!name || name.includes('@')) {
        return email?.split('@')[0] || "Node User";
    }
    return name;
};

export const getUserById = async (uid) => {
    if (!uid) return null;
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            uid: docSnap.id,
            ...data,
            displayName: sanitizeName(data.displayName, data.email),
            username: data.username || data.email?.split('@')[0] || "node_user"
        };
    }
    return null;
};

export const getAllUsers = async () => {
    try {
        const usersCol = collection(db, "users");
        const userSnapshot = await getDocs(usersCol);
        return userSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id,
                ...data,
                displayName: sanitizeName(data.displayName, data.email)
            };
        });
    } catch (error) {
        console.error("Error fetching all users:", error);
        return [];
    }
};

export const updateUserProfile = async (uid, data) => {
    if (!uid) return;
    const userRef = doc(db, "users", uid);
    try {
        if (data.bio && data.bio.length > 20 && data.badges && !data.badges.includes("Storyteller")) {
            data.badges.push("Storyteller");
        }
        if (data.skills && data.skills.length >= 5 && data.badges && !data.badges.includes("Skill Master")) {
            data.badges.push("Skill Master");
        }
        await setDoc(userRef, data, { merge: true });
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};
