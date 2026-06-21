export interface Service {
  id: string;
  name: string;
  bengaliName: string;
  price: number;
  description: string;
  features: string[];
}

export interface Review {
  id: string;
  studentName: string;
  courseName: string;
  rating: number;
  comment: string;
  avatarUrl: string;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  joinedAt: string;
}

export interface PaymentDetails {
  id: string;
  userEmail: string;
  serviceId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: "pending" | "success";
  timestamp: string;
}
