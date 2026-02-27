import { db } from "../firebase";
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";

export const sendConnectionRequest = async (authId, toUserId) => {
    if (!authId || !toUserId) return;

    // Fetch full sender details for accuracy
    const senderRef = doc(db, "users", authId);
    const senderSnap = await getDoc(senderRef);
    const senderData = senderSnap.exists() ? senderSnap.data() : { displayName: "Node User", username: "node_user" };

    const reqId = `${authId}_${toUserId}`;
    const reqRef = doc(db, "connections", reqId);

    await setDoc(reqRef, {
        fromId: authId,
        fromName: senderData.displayName || "Node User",
        fromUsername: senderData.username || "node_user",
        toId: toUserId,
        status: "pending",
        timestamp: serverTimestamp()
    });
};

export const subscribeToConnections = (userId, callback) => {
    const q = query(
        collection(db, "connections"),
        where("toId", "==", userId)
    );

    return onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(requests);
    });
};

export const acceptConnection = async (requestId) => {
    const reqRef = doc(db, "connections", requestId);
    const snap = await getDoc(reqRef);
    if (!snap.exists()) return;

    const data = snap.data();

    // Update status
    await updateDoc(reqRef, { status: "accepted" });

    // Update both users connection lists
    const userARef = doc(db, "users", data.fromId);
    const userBRef = doc(db, "users", data.toId);

    await updateDoc(userARef, {
        connections: arrayUnion(data.toId)
    });

    await updateDoc(userBRef, {
        connections: arrayUnion(data.fromId)
    });
};
