import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { 
  BarChart3, 
  List, 
  Plus, 
  Users, 
  FileText, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown 
} from "lucide-react";
import { AuthUser } from "../types/auth";

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
  currentUser: AuthUser;
  onLogout: () => void;
}

export function Navigation({ activeView, onViewChange, currentUser, onLogout }: NavigationProps) {
  // Define which views are available for each role
  const getAvailableViews = (role: string) => {
    const baseViews = [
      { id: "dashboard", label: "Dashboard", icon: BarChart3 },
      { id: "assets", label: "My Assets", icon: List }
    ];

    // Admin and Manager get full access
    if (role === 'admin' || role === 'manager') {
      return [
        { id: "dashboard", label: "Dashboard", icon: BarChart3 },
        { id: "assets", label: "Asset List", icon: List },
        { id: "users", label: "User Management", icon: Users },
        { id: "reports", label: "Reports", icon: FileText },
        { id: "add", label: "Add Asset", icon: Plus }
      ];
    }

    // Viewers get read-only access to assets and dashboard
    if (role === 'viewer') {
      return [
        { id: "dashboard", label: "Dashboard", icon: BarChart3 },
        { id: "assets", label: "Assets", icon: List }
      ];
    }

    // Regular users get limited access
    return baseViews;
  };

  const views = getAvailableViews(currentUser.role);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'manager': return 'secondary';
      case 'user': return 'outline';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'manager': return 'Manager';
      case 'user': return 'User';
      case 'viewer': return 'Viewer';
      default: return role;
    }
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onLogout();
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewChange('profile');
  };

  return (
    <Card className="p-4">
      <nav className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Main Navigation */}
        <div className="flex flex-col md:flex-row gap-2">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <Button
                key={view.id}
                variant={activeView === view.id ? "default" : "ghost"}
                onClick={() => onViewChange(view.id)}
                className="justify-start"
              >
                <Icon className="size-4 mr-2" />
                {view.label}
              </Button>
            );
          })}
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-3 p-2 h-auto hover:bg-accent"
            >
              <Avatar className="size-8">
                <AvatarImage 
                  src={currentUser.avatar} 
                  alt={`${currentUser.firstName} ${currentUser.lastName}`} 
                />
                <AvatarFallback className="text-sm">
                  {getInitials(currentUser.firstName, currentUser.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(currentUser.role)} className="text-xs">
                    {getRoleDisplayName(currentUser.role)}
                  </Badge>
                </div>
              </div>
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentUser.email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getRoleBadgeVariant(currentUser.role)} className="text-xs">
                    {getRoleDisplayName(currentUser.role)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {currentUser.department}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleProfileClick} 
              className="cursor-pointer"
            >
              <User className="size-4 mr-2" />
              My Profile
            </DropdownMenuItem>
            {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="size-4 mr-2" />
                Settings
              </DropdownMenuItem>
            )}

          </DropdownMenuContent>
        </DropdownMenu>
        <Button   onClick={handleLogoutClick}   className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
           <LogOut className="size-4 mr-2" />
              Logout</Button>
      </nav>
    </Card>
  );
}