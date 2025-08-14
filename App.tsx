import { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { AssetList } from "./components/AssetList";
import { AssetForm } from "./components/AssetForm";
import { UserList } from "./components/UserList";
import { UserForm } from "./components/UserForm";
import { Reports } from "./components/Reports";
import { Navigation } from "./components/Navigation";
import { Login } from "./components/Login";
import { UserProfile } from "./components/UserProfile";
import { Asset, AssetFormData } from "./types/asset";
import { User, UserFormData } from "./types/user";
import { AuthUser, LoginCredentials, AuthState } from "./types/auth";
import { mockAssets } from "./data/mockAssets";
import { mockUsers } from "./data/mockAssets.ts";
import { mockLogin, mockLogout, mockUpdateProfile, saveUserSession, getUserSession, clearUserSession } from "./data/mockAuth";

export default function App() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [activeView, setActiveView] = useState("dashboard");
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Authentication state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  // Check for existing session on app load
  useEffect(() => {
    const storedUser = getUserSession();
    if (storedUser) {
      setAuthState({
        user: storedUser,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Filter assets based on user role and permissions
  const getFilteredAssets = (assets: Asset[], user: AuthUser): Asset[] => {
    if (user.role === 'admin' || user.role === 'manager') {
      return assets; // Admins and managers see all assets
    }
    
    if (user.role === 'viewer') {
      return assets; // Viewers can see all assets but in read-only mode
    }
    
    // Regular users only see assets assigned to them
    return assets.filter(asset => asset.assignedTo === user.employeeId);
  };

  // Check if user has permission to access a specific view
  const hasPermission = (view: string, user: AuthUser): boolean => {
    const adminOnlyViews = ['users', 'add-user', 'edit-user', 'reports'];
    const adminManagerViews = ['add', 'edit-asset'];
    
    if (adminOnlyViews.includes(view)) {
      return user.role === 'admin' || user.role === 'manager';
    }
    
    if (adminManagerViews.includes(view)) {
      return user.role === 'admin' || user.role === 'manager';
    }
    
    // All users can access dashboard, assets, and profile
    return true;
  };

  // Authentication handlers
  const handleLogin = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    setLoginError(null);
    
    try {
      const user = await mockLogin(credentials);
      saveUserSession(user);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login failed");
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleLogout = async () => {
    try {
      await mockLogout();
      clearUserSession();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      setActiveView("dashboard");
      setEditingAsset(null);
      setEditingUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleUpdateProfile = async (updates: Partial<AuthUser>) => {
    if (!authState.user) return;
    
    try {
      const updatedUser = await mockUpdateProfile(authState.user.id, updates);
      saveUserSession(updatedUser);
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const handleAddAsset = (assetData: AssetFormData) => {
    const newAsset: Asset = {
      ...assetData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAssets(prev => [...prev, newAsset]);
    setActiveView("assets");
  };

  const handleEditAsset = (assetData: AssetFormData) => {
    if (editingAsset) {
      setAssets(prev => prev.map(asset => 
        asset.id === editingAsset.id 
          ? { ...asset, ...assetData, updatedAt: new Date().toISOString() }
          : asset
      ));
      setEditingAsset(null);
      setActiveView("assets");
    }
  };

  const handleDeleteAsset = (assetId: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      setAssets(prev => prev.filter(asset => asset.id !== assetId));
    }
  };

  const handleAddUser = (userData: UserFormData) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      lastLogin: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    setActiveView("users");
  };

  const handleEditUser = (userData: UserFormData) => {
    if (editingUser) {
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData, updatedAt: new Date().toISOString() }
          : user
      ));
      setEditingUser(null);
      setActiveView("users");
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleViewChange = (view: string) => {
    if (!authState.user || !hasPermission(view, authState.user)) {
      console.warn(`Access denied to view: ${view}`);
      return;
    }
    
    setActiveView(view);
    if (view !== "edit-asset" && view !== "edit-user") {
      setEditingAsset(null);
      setEditingUser(null);
    }
  };

  const handleEditAssetClick = (asset: Asset) => {
    if (!authState.user || !hasPermission('edit-asset', authState.user)) {
      console.warn('Access denied to edit assets');
      return;
    }
    setEditingAsset(asset);
    setActiveView("edit-asset");
  };

  const handleEditUserClick = (user: User) => {
    if (!authState.user || !hasPermission('edit-user', authState.user)) {
      console.warn('Access denied to edit users');
      return;
    }
    setEditingUser(user);
    setActiveView("edit-user");
  };

  const handleCancel = () => {
    const wasEditingAsset = editingAsset !== null;
    setEditingAsset(null);
    setEditingUser(null);
    setActiveView(wasEditingAsset ? "assets" : "users");
  };

  const renderContent = () => {
    if (!authState.user) return null;

    const filteredAssets = getFilteredAssets(assets, authState.user);
    const canEdit = authState.user.role === 'admin' || authState.user.role === 'manager';
    const canView = authState.user.role !== 'viewer';

    switch (activeView) {
      case "dashboard":
        return <Dashboard assets={filteredAssets} currentUser={authState.user} />;
      
      case "assets":
        return (
          <AssetList
            assets={filteredAssets}
            onAddAsset={canEdit ? () => setActiveView("add") : undefined}
            onEditAsset={canEdit ? handleEditAssetClick : undefined}
            onDeleteAsset={canEdit ? handleDeleteAsset : undefined}
            currentUser={authState.user}
          />
        );
      
      case "users":
        if (!hasPermission("users", authState.user)) {
          return <div className="p-4">Access Denied</div>;
        }
        return (
          <UserList
            users={users}
            onAddUser={() => setActiveView("add-user")}
            onEditUser={handleEditUserClick}
            onDeleteUser={handleDeleteUser}
          />
        );
      
      case "add":
        if (!hasPermission("add", authState.user)) {
          return <div className="p-4">Access Denied</div>;
        }
        return (
          <AssetForm
            users={users}
            onSave={handleAddAsset}
            onCancel={handleCancel}
          />
        );
      
      case "add-user":
        if (!hasPermission("add-user", authState.user)) {
          return <div className="p-4">Access Denied</div>;
        }
        return (
          <UserForm
            onSave={handleAddUser}
            onCancel={handleCancel}
          />
        );
      
      case "edit-asset":
        if (!hasPermission("edit-asset", authState.user)) {
          return <div className="p-4">Access Denied</div>;
        }
        return (
          <AssetForm
            asset={editingAsset!}
            users={users}
            onSave={handleEditAsset}
            onCancel={handleCancel}
          />
        );
      
      case "edit-user":
        if (!hasPermission("edit-user", authState.user)) {
          return <div className="p-4">Access Denied</div>;
        }
        return (
          <UserForm
            user={editingUser!}
            onSave={handleEditUser}
            onCancel={handleCancel}
          />
        );
      
      case "reports":
        if (!hasPermission("reports", authState.user)) {
          return <div className="p-4">Access Denied</div>;
        }
        return (
          <Reports
            assets={assets}
            users={users}
          />
        );
      
      case "profile":
        return (
          <UserProfile
            user={authState.user}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      
      default:
        return <Dashboard assets={filteredAssets} currentUser={authState.user} />;
    }
  };

  // Show loading screen
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!authState.isAuthenticated || !authState.user) {
    return (
      <Login
        onLogin={handleLogin}
        isLoading={authState.isLoading}
        error={loginError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Navigation 
          activeView={activeView} 
          onViewChange={handleViewChange}
          currentUser={authState.user}
          onLogout={handleLogout}
        />
        {renderContent()}
      </div>
    </div>
  );
}