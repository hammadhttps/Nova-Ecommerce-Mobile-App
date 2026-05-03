import { Address } from "@/types";

export const mockAddresses: Address[] = [
  {
    id: 1,
    name: "Home",
    street: "123 Main Street, Apt 4B",
    city: "New York, NY 10001",
    zip: "10001",
    phone: "+1 234 567 8900",
    isDefault: true,
  },
  {
    id: 2,
    name: "Office",
    street: "456 Business Ave, Floor 12",
    city: "New York, NY 10002",
    phone: "+1 234 567 8901",
    isDefault: false,
  },
  {
    id: 3,
    name: "Parents House",
    street: "789 Family Road",
    city: "Brooklyn, NY 11201",
    phone: "+1 234 567 8902",
    isDefault: false,
  },
];
