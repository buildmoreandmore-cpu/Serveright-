
export enum ServeStatus {
  RECEIVED = 'RECEIVED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  ATTEMPTED = 'ATTEMPTED',
  COMPLETE = 'COMPLETE',
  ATTENTION = 'ATTENTION_NEEDED',
  OVERDUE = 'OVERDUE'
}

export interface Attempt {
  id: string;
  timestamp: string;
  type: 'NO_ANSWER' | 'WRONG_ADDRESS' | 'REFUSED' | 'GATED' | 'OTHER';
  notes: string;
  locationVerified: boolean;
}

export interface Job {
  id: string;
  defendant: string;
  aliases?: string;
  description?: string;
  address: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  documentType: 'SUMMONS_COMPLAINT' | 'SUBPOENA' | 'EVICTION' | 'OTHER';
  documents: string[];
  status: ServeStatus;
  receivedDate: string;
  dueDate: string;
  completedDate?: string;
  serverName?: string;
  attempts: Attempt[];
  price: number;
  contactEmail: string;
  contactPhone?: string;
  affidavitUrl?: string;
}

export enum PortalView {
  LANDING = 'LANDING',
  CUSTOMER_INTAKE = 'CUSTOMER_INTAKE',
  CUSTOMER_TRACKING = 'CUSTOMER_TRACKING',
  CUSTOMER_DASHBOARD = 'CUSTOMER_DASHBOARD',
  SERVER_MOBILE = 'SERVER_MOBILE',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}
