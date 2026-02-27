import { doc, getDoc, setDoc, updateDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const createUserIfNotExists = async (user) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
        try {
            await setDoc(userRef, {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                department: "",
                year: "",
                skills: [],
                interests: [],
                projects: [],
                careerGoal: "",
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error creating user document:", error);
            throw error;
        }
    }
};

export const updateUserProfile = async (uid, data) => {
    if (!uid) return;
    const userRef = doc(db, "users", uid);
    try {
        await updateDoc(userRef, data);
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

export const getUserById = async (uid) => {
    if (!uid) return null;
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        return snap.data();
    }
    return null;
};

export const getAllUsers = async () => {
    try {
        const usersCol = collection(db, "users");
        const snapshot = await getDocs(usersCol);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("Error fetching all users:", error);
        return [];
    }
};
