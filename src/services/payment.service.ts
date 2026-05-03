import { PaymentMethod } from "@/types";
import { mockPaymentMethods } from "@/services/mocks/payments";

let paymentMethodsState: PaymentMethod[] = [...mockPaymentMethods];

export const paymentService = {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return paymentMethodsState;
  },

  async addPaymentMethod(
    method: Omit<PaymentMethod, "id">,
  ): Promise<PaymentMethod[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString(),
    };

    if (method.isDefault) {
      paymentMethodsState = paymentMethodsState.map((m) => ({
        ...m,
        isDefault: false,
      }));
    }

    paymentMethodsState = [...paymentMethodsState, newMethod];
    return paymentMethodsState;
  },

  async removePaymentMethod(id: string): Promise<PaymentMethod[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    paymentMethodsState = paymentMethodsState.filter((m) => m.id !== id);
    return paymentMethodsState;
  },

  async setDefaultPaymentMethod(id: string): Promise<PaymentMethod[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    paymentMethodsState = paymentMethodsState.map((m) => ({
      ...m,
      isDefault: m.id === id,
    }));
    return paymentMethodsState;
  },

  getDefaultPaymentMethod(): PaymentMethod | undefined {
    return paymentMethodsState.find((m) => m.isDefault);
  },
};
