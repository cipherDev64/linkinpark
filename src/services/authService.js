import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";
import { createUserIfNotExists } from "./userService";

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check domain (restriction removed)

        // Call userService to create doc if doesn't exist
        await createUserIfNotExists(user);

        return user;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error);
        throw error;
    }
};

export const getCurrentUser = () => {
    return auth.currentUser;
};
