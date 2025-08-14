export interface User {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  location: string;
  manager: string;
  startDate: string;
  lastLogin: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type UserFormData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>;