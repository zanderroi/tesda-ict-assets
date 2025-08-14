export interface Asset {
  id: string;
  assetId: string;
  name: string;
  category: 'computer' | 'server' | 'mobile' | 'network' | 'software' | 'other';
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  endOfLifeDate: string;
  warrantyExpiry: string;
  status: 'active' | 'inactive' | 'maintenance' | 'retired';
  location: string;
  assignedTo: string;
  purchasePrice: number;
  currentValue: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type AssetFormData = Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>;