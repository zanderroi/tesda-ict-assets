export interface ReportFilter {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  category?: string;
  status?: string;
  department?: string;
  assignedTo?: string;
  location?: string;
}

export interface ReportData {
  id: string;
  title: string;
  description: string;
  generatedAt: string;
  filters: ReportFilter;
  data: any[];
  summary: ReportSummary;
}

export interface ReportSummary {
  totalItems: number;
  categories: Record<string, number>;
  statuses: Record<string, number>;
  totalValue: number;
  avgAge: number;
  expiringSoon: number;
}

export type ReportType = 
  | 'asset-inventory'
  | 'asset-lifecycle'
  | 'asset-financial' 
  | 'user-summary'
  | 'department-assets'
  | 'expiring-assets'
  | 'asset-utilization';

export interface ReportConfig {
  type: ReportType;
  title: string;
  description: string;
  icon: string;
  fields: string[];
}