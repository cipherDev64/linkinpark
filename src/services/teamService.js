import { db } from "../firebase";
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { getCurrentUser } from "./authService";
import { v4 as uuidv4 } from "uuid";
import { logActivity } from "./activityService";
import { getUserById } from "./userService";

export const createTeam = async (name, description, tags, members) => {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error("Connection lost: Authentication required.");

    const teamId = uuidv4();
    const teamRef = doc(db, "teams", teamId);

    // Sanitize members: ensure they are UIDs
    const validMembers = Array.isArray(members)
        ? members.map(m => (typeof m === 'string' ? m : m.uid)).filter(Boolean)
        : [];

    // Always include creator
    if (!validMembers.includes(currentUser.uid)) {
        validMembers.push(currentUser.uid);
    }

    try {
        await setDoc(teamRef, {
            id: teamId,
            name: name || "New Project Laboratory",
            description: description || "",
            tags: tags || [],
            members: validMembers,
            creatorId: currentUser.uid,
            createdAt: serverTimestamp(),
            status: "active",
            membersInfo: [] // For cached display names later
        });

        // Initialize chat/room subcollection if needed
        const welcomeRef = doc(collection(teamRef, "messages"));
        await setDoc(welcomeRef, {
            text: `Project Room initialized. Vision: ${description.substring(0, 100)}...`,
            senderId: "system",
            senderName: "Network Core",
            timestamp: serverTimestamp()
        });

        // Log globally
        const userDetails = await getUserById(currentUser.uid);
        if (userDetails) {
            await logActivity("PROJECT_CREATED", userDetails, {
                teamName: name || "New Project Team",
                teamId: teamId
            });
        }

        return teamId;
    } catch (error) {
        console.error("Critical Failure in Team Creation:", error);
        throw error; // Rethrow to show "Execution failed" toast
    }
};

export const getTeams = async () => {
    const teamsRef = collection(db, "teams");
    const snapshot = await getDocs(teamsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getMyTeams = async (userId) => {
    const teamsRef = collection(db, "teams");
    const snapshot = await getDocs(teamsRef);
    const allTeams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return allTeams.filter(t => t.members && t.members.includes(userId));
};

export const getTeamById = async (teamId) => {
    const teamRef = doc(db, "teams", teamId);
    const snapshot = await getDoc(teamRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
};

export const addTeamMessage = async (teamId, message) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const teamRef = doc(db, "teams", teamId);
    const messageRef = doc(collection(teamRef, "messages"));

    await setDoc(messageRef, {
        ...message,
        senderId: currentUser.uid,
        timestamp: serverTimestamp()
    });
};
export const getTeamTasks = async (teamId) => {
    const tasksRef = collection(db, "teams", teamId, "tasks");
    const snapshot = await getDocs(tasksRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addTaskToTeam = async (teamId, task) => {
    const tasksRef = collection(db, "teams", teamId, "tasks");
    const docRef = doc(tasksRef);
    await setDoc(docRef, { ...task, createdAt: serverTimestamp() });
    return docRef.id;
};

export const updateTaskStatus = async (teamId, taskId, status) => {
    const taskRef = doc(db, "teams", teamId, "tasks", taskId);
    await updateDoc(taskRef, { status });
};
