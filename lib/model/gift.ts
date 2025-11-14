export interface Gift {
  _id: string;
  senderId: string;
  receiverId: string;
  currency: string;
  price: number;
  name: string;
  note: string;
  date: string;
}