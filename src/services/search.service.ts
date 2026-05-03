import { db } from "../../Firebaseconfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

export interface RecentSearch {
  id: string;
  userId: string;
  term: string;
  timestamp: any;
}

export const searchService = {
  async addRecentSearch(userId: string, term: string): Promise<void> {
    if (!userId || !term.trim()) return;

    // Check if this term already exists for the user
    const q = query(
      collection(db, "recentSearches"),
      where("userId", "==", userId),
      where("term", "==", term.trim()),
    );
    const snapshot = await getDocs(q);

    // If exists, delete the old one (to update timestamp)
    if (!snapshot.empty) {
      await deleteDoc(doc(db, "recentSearches", snapshot.docs[0].id));
    }

    // Add new recent search
    await addDoc(collection(db, "recentSearches"), {
      userId,
      term: term.trim(),
      timestamp: serverTimestamp(),
    });
  },

  async getRecentSearches(userId: string): Promise<RecentSearch[]> {
    if (!userId) return [];

    const q = query(
      collection(db, "recentSearches"),
      where("userId", "==", userId),
    );
    const snapshot = await getDocs(q);
    const searches = snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as RecentSearch,
    );

    // Sort client-side by timestamp descending (newest first)
    return searches.sort((a, b) => {
      const timeA = a.timestamp?.toDate?.() || new Date(0);
      const timeB = b.timestamp?.toDate?.() || new Date(0);
      return timeB.getTime() - timeA.getTime();
    });
  },

  async removeRecentSearch(searchId: string): Promise<void> {
    await deleteDoc(doc(db, "recentSearches", searchId));
  },

  async clearRecentSearches(userId: string): Promise<void> {
    if (!userId) return;

    const q = query(
      collection(db, "recentSearches"),
      where("userId", "==", userId),
    );
    const snapshot = await getDocs(q);

    const deletePromises = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "recentSearches", docSnap.id)),
    );
    await Promise.all(deletePromises);
  },
};
