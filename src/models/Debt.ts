export type IconKey =
  | "home"
  | "shirt"
  | "phone"
  | "cart"
  | "heart"
  | "car";

export interface Debt {
  id: string;
  icon: IconKey;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  quantity: number;
  price: number;
  paid: number;
}
