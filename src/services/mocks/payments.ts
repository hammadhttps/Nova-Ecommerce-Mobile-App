import { PaymentMethod } from "@/types";

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "visa",
    number: "****1234",
    expiry: "12/25",
    name: "Alex Johnson",
    last4: "1234",
    isDefault: true,
  },
  {
    id: "2",
    type: "mastercard",
    number: "****5678",
    expiry: "08/26",
    name: "Alex Johnson",
    last4: "5678",
    isDefault: false,
  },
  {
    id: "3",
    type: "amex",
    number: "****9012",
    expiry: "03/27",
    name: "Alex Johnson",
    last4: "9012",
    isDefault: false,
  },
];
