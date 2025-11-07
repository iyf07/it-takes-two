export interface Task {
  _id: string;
  name: string;
  userIds: string[];
  price: number;
  category: string;
  description: string;
}