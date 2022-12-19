import { UserId } from './user.model';

export type BookingId = string;
export type BookingModel = {
  id: BookingId;
  startDate: string;
  endDate: string;
  createdAt: string;
  createdBy: UserId;
  cancelledAt: string | null;
};
