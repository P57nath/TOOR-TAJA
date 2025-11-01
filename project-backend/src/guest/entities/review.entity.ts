export class Review {
  id: string;
  productId: string;
  guestName: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}