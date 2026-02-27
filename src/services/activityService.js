import { db } from "../firebase";
import { collection, addDoc, query, orderBy, limit, onSnapshot, Timestamp, serverTimestamp } from "firebase/firestore";

export const logActivity = async (type, user, details = {}) => {
    try {
        const activitiesCol = collection(db, "activities");
        await addDoc(activitiesCol, {
            type, // 'USER_JOINED', 'PROJECT_CREATED', 'PROFILE_UPDATED'
            userId: user.uid,
            userName: user.displayName || user.username || "Node User",
            userUsername: user.username || "",
            timestamp: serverTimestamp(),
            details
        });
    } catch (error) {
        console.error("Error logging activity:", error);
    }
};

export const subscribeToActivities = (callback, limitCount = 10) => {
    const activitiesCol = collection(db, "activities");
    const q = query(activitiesCol, orderBy("timestamp", "desc"), limit(limitCount));

    return onSnapshot(q, (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Ensure timestamp is a Date object for ease of use
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        callback(activities);
    });
};
