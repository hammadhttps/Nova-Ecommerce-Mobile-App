import { User } from "@/types";
import { auth } from "../../Firebaseconfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login(
    credentials: LoginCredentials,
  ): Promise<{ user: User; token: string }> {
    if (!credentials.email.trim() || !credentials.password.trim()) {
      throw new Error("Email and password are required");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      );

      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();

      const user: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || credentials.email.split("@")[0],
        email: firebaseUser.email || credentials.email,
        avatar: firebaseUser.photoURL || undefined,
      };

      return { user, token };
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  },

  async signup(
    credentials: SignupCredentials,
  ): Promise<{ user: User; token: string }> {
    if (
      !credentials.name.trim() ||
      !credentials.email.trim() ||
      !credentials.password.trim()
    ) {
      throw new Error("All fields are required");
    }

    if (credentials.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      );

      const firebaseUser = userCredential.user;

      // Update profile with name immediately after signup
      await updateProfile(firebaseUser, {
        displayName: credentials.name,
      });

      const token = await firebaseUser.getIdToken();

      const user: User = {
        id: firebaseUser.uid,
        name: credentials.name,
        email: firebaseUser.email || credentials.email,
        avatar: firebaseUser.photoURL || undefined,
      };

      return { user, token };
    } catch (error: any) {
      // Handle duplicate email error with friendly message
      if (error.code === "auth/email-already-in-use") {
        throw new Error("An account with this email already exists");
      }
      throw new Error(error.message || "Signup failed");
    }
  },

  async resetPassword(email: string): Promise<void> {
    if (!email.trim()) {
      throw new Error("Email is required");
    }

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        throw new Error("No account found with this email");
      }
      throw new Error(error.message || "Failed to send reset email");
    }
  },

  async updateProfilePhoto(imageUri: string): Promise<string> {
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile.jpg",
    } as any);
    data.append("upload_preset", "nova_uploads");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dkyjvyz1m/image/upload",
      { method: "POST", body: data },
    );
    const json = await res.json();
    const photoURL = json.secure_url;

    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      await updateProfile(firebaseUser, { photoURL });
    }

    return photoURL;
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || "Logout failed");
    }
  },
};
