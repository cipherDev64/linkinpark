import { db } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

// Get messages for a specific team/room
export const subscribeToRoomMessages = (roomId, callback) => {
    if (!roomId) return () => { };

    const messagesRef = collection(db, "teams", roomId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Ensure we don't crash if createdAt is null (pending local write)
            createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        callback(messages);
    });
};

// Send a new message to a specific room
export const sendMessageToRoom = async (roomId, user, text) => {
    if (!roomId || !user || !text.trim()) return null;

    const messagesRef = collection(db, "teams", roomId, "messages");

    try {
        const docRef = await addDoc(messagesRef, {
            text: text.trim(),
            senderId: user.uid,
            senderName: user.displayName || "Unknown user",
            senderAvatarConfig: user.avatarConfig || { colorId: "blue", emoji: "" },
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (e) {
        console.error("Error sending message: ", e);
        throw e;
    }
};
