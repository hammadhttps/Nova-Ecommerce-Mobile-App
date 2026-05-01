import { Address } from '@/types';
import { mockAddresses } from '@/services/mocks/addresses';

let addressesState: Address[] = [...mockAddresses];

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return addressesState;
  },

  async addAddress(address: Omit<Address, 'id'>): Promise<Address[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newAddress: Address = {
      ...address,
      id: Date.now(),
    };

    if (address.isDefault) {
      addressesState = addressesState.map((a) => ({ ...a, isDefault: false }));
    }

    addressesState = [...addressesState, newAddress];
    return addressesState;
  },

  async updateAddress(id: number, updates: Partial<Address>): Promise<Address[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    addressesState = addressesState.map((a) => {
      if (a.id === id) {
        if (updates.isDefault) {
          return { ...a, ...updates };
        }
        return { ...a, ...updates };
      }
      if (updates.isDefault) {
        return { ...a, isDefault: false };
      }
      return a;
    });

    return addressesState;
  },

  async deleteAddress(id: number): Promise<Address[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    addressesState = addressesState.filter((a) => a.id !== id);
    return addressesState;
  },

  async setDefaultAddress(id: number): Promise<Address[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    addressesState = addressesState.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    return addressesState;
  },

  getDefaultAddress(): Address | undefined {
    return addressesState.find((a) => a.isDefault);
  },
};
