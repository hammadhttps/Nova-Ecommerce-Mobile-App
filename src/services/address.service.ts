import { Address } from "@/types";
import { db } from "../../Firebaseconfig";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

export const addressService = {
  async getAddresses(userId: string): Promise<Address[]> {
    const q = query(collection(db, "users", userId, "addresses"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Address,
    );
  },

  async addAddress(
    userId: string,
    address: Omit<Address, "id">,
  ): Promise<Address[]> {
    // If new address is default, unset others
    if (address.isDefault) {
      const snapshot = await getDocs(
        query(collection(db, "users", userId, "addresses")),
      );
      const updates = snapshot.docs.map((doc) =>
        setDoc(doc.ref, { isDefault: false }, { merge: true }),
      );
      await Promise.all(updates);
    }

    const newId = Date.now().toString();
    await setDoc(doc(db, "users", userId, "addresses", newId), {
      ...address,
      id: newId,
    });

    return this.getAddresses(userId);
  },

  async updateAddress(
    userId: string,
    id: string,
    updates: Partial<Address>,
  ): Promise<Address[]> {
    // If updating to default, unset others
    if (updates.isDefault) {
      const snapshot = await getDocs(
        query(collection(db, "users", userId, "addresses")),
      );
      const undefaultOthers = snapshot.docs
        .filter((doc) => doc.id !== id)
        .map((doc) => setDoc(doc.ref, { isDefault: false }, { merge: true }));
      await Promise.all(undefaultOthers);
    }

    await setDoc(doc(db, "users", userId, "addresses", id), updates, {
      merge: true,
    });

    return this.getAddresses(userId);
  },

  async deleteAddress(userId: string, id: string): Promise<Address[]> {
    await deleteDoc(doc(db, "users", userId, "addresses", id));
    return this.getAddresses(userId);
  },

  async setDefaultAddress(userId: string, id: string): Promise<Address[]> {
    const snapshot = await getDocs(
      query(collection(db, "users", userId, "addresses")),
    );
    const updates = snapshot.docs.map((doc) =>
      setDoc(doc.ref, { isDefault: doc.id === id }, { merge: true }),
    );
    await Promise.all(updates);
    return this.getAddresses(userId);
  },

  getDefaultAddress(addresses: Address[]): Address | undefined {
    return addresses.find((a) => a.isDefault);
  },
};
