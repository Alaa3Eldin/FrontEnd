export interface ITestimonial {
  _id?: string;
  user?: {
    _id: string;
    name: string;
    email?: string;
  };
  name: string;
  message: string;
  rating: number;
  isApproved?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
