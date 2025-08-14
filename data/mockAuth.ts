import { AuthUser, LoginCredentials } from "../types/auth";

// Mock users for authentication - using actual system users with passwords
export const mockAuthUsers: Record<string, { user: AuthUser; password: string }> = {
  // Admin user - Robert Brown (CTO)
  "robert.brown@company.com": {
    password: "admin123",
    user: {
      id: "3",
      email: "robert.brown@company.com",
      firstName: "Robert",
      lastName: "Brown",
      role: "admin",
      department: "Administration",
      employeeId: "EMP003",
      lastLogin: new Date().toISOString()
    }
  },
  // Manager users
  "jane.smith@company.com": {
    password: "manager123",
    user: {
      id: "2",
      email: "jane.smith@company.com",
      firstName: "Jane",
      lastName: "Smith",
      role: "manager",
      department: "Information Technology",
      employeeId: "EMP002",
      lastLogin: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    }
  },
  "mike.thompson@company.com": {
    password: "manager123",
    user: {
      id: "7",
      email: "mike.thompson@company.com",
      firstName: "Mike",
      lastName: "Thompson",
      role: "manager",
      department: "Information Technology",
      employeeId: "EMP007",
      lastLogin: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    }
  },
  // Regular users
  "john.doe@company.com": {
    password: "user123",
    user: {
      id: "1",
      email: "john.doe@company.com",
      firstName: "John",
      lastName: "Doe",
      role: "user",
      department: "Information Technology",
      employeeId: "EMP001",
      lastLogin: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
    }
  },
  "carol.davis@company.com": {
    password: "user123",
    user: {
      id: "6",
      email: "carol.davis@company.com",
      firstName: "Carol",
      lastName: "Davis",
      role: "user",
      department: "Finance",
      employeeId: "EMP006",
      lastLogin: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    }
  },
  "bob.wilson@company.com": {
    password: "user123",
    user: {
      id: "5",
      email: "bob.wilson@company.com",
      firstName: "Bob",
      lastName: "Wilson",
      role: "user",
      department: "Information Technology",
      employeeId: "EMP005",
      lastLogin: new Date(Date.now() - 1209600000).toISOString() // 2 weeks ago
    }
  },
  // Viewer user
  "alice.johnson@company.com": {
    password: "viewer123",
    user: {
      id: "4",
      email: "alice.johnson@company.com",
      firstName: "Alice",
      lastName: "Johnson",
      role: "viewer",
      department: "Human Resources",
      employeeId: "EMP004",
      lastLogin: new Date(Date.now() - 21600000).toISOString() // 6 hours ago
    }
  }
};

// Mock authentication functions
export const mockLogin = async (credentials: LoginCredentials): Promise<AuthUser> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const userRecord = mockAuthUsers[credentials.email];
  
  if (!userRecord || userRecord.password !== credentials.password) {
    throw new Error("Invalid email or password");
  }
  
  // Update last login
  const updatedUser = {
    ...userRecord.user,
    lastLogin: new Date().toISOString()
  };
  
  mockAuthUsers[credentials.email].user = updatedUser;
  
  return updatedUser;
};

export const mockLogout = async (): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Clear any stored session data
  localStorage.removeItem("auth-user");
};

export const mockUpdateProfile = async (userId: string, updates: Partial<AuthUser>): Promise<AuthUser> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find user by ID
  const userEntry = Object.entries(mockAuthUsers).find(([_, record]) => record.user.id === userId);
  
  if (!userEntry) {
    throw new Error("User not found");
  }
  
  const [email, record] = userEntry;
  
  // Update user data
  const updatedUser = {
    ...record.user,
    ...updates,
    id: userId // Ensure ID doesn't change
  };
  
  mockAuthUsers[email].user = updatedUser;
  
  return updatedUser;
};

// Session management
export const saveUserSession = (user: AuthUser): void => {
  localStorage.setItem("auth-user", JSON.stringify(user));
};

export const getUserSession = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem("auth-user");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error parsing stored user session:", error);
  }
  return null;
};

export const clearUserSession = (): void => {
  localStorage.removeItem("auth-user");
};

// Demo account information for easy reference
export const getDemoAccounts = () => {
  return {
    admin: {
      email: "robert.brown@company.com",
      password: "admin123",
      role: "Admin (Full Access)"
    },
    manager: {
      email: "jane.smith@company.com", 
      password: "manager123",
      role: "Manager (Manage Assets & Users)"
    },
    user: {
      email: "john.doe@company.com",
      password: "user123", 
      role: "User (Add/Edit Assets)"
    },
    viewer: {
      email: "alice.johnson@company.com",
      password: "viewer123",
      role: "Viewer (Read Only)"
    }
  };
};