export interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type QueryObj = {
  limit?: string;
  page?: string;
  search?: string;
};

export interface RFPItem {
  name: string;
  quantity: number;
  specifications?: string;
}

export interface RFP {
  _id: string;
  title: string;
  description: string;
  items: RFPItem[];
  budget: number;
  deliveryDeadline: string;
  paymentTerms?: string;
  warrantyRequirement?: string;
  selectedVendors: string[];
  vendors?: Vendor[]
  status: "draft" | "sent" | "receiving_responses" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface ProposalItem {
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  specifications?: string;
}

export interface Proposal {
  _id: string;
  rfpId: string | RFP;
  vendorId: string | Vendor;
  rawEmail: {
    subject?: string;
    bodyText?: string;
    bodyHtml?: string;
  };

    items: ProposalItem[];
    totalPrice: number;
    deliveryTime?: string;
    paymentTerms?: string;
    warranty?: string;
    additionalTerms?: string;
   aiScore: number;
  aiSummary?: string;
  completeness: number;
  status: "received" | "parsed" | "evaluated";
  createdAt: string;
  updatedAt: string;
  vendor?:Vendor;
  rfp:RFP;
  isBest:boolean
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ParsedRFP {
  title: string;
  description: string;
  items: RFPItem[];
  budget: number;
  deliveryDeadline: string;
  paymentTerms: string;
  warrantyRequirement: string;
}
