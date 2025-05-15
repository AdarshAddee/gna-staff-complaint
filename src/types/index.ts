export interface Complaint {
  'sr-no': number;
  date: string; // YYYY-MM-DD
  name: string;
  dept: string;
  block: string;
  'room-no'?: string; // Optional room number
  complaints: string;
  status: string; // e.g., "Pending", "Resolved"
  'date-solved': string; // YYYY-MM-DD or empty
}
