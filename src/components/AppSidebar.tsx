
import { NavLink, useLocation } from "react-router-dom";
import { Home, Plus, Heart, Building, FileText, Shield, Scale, Phone, User, LogOut, LogIn } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Post Camp", url: "/post-camp", icon: Plus },
  { title: "Sponsor Camp", url: "/sponsor", icon: Heart },
  { title: "Business Request", url: "/business-request", icon: Building },
  { title: "Proposals", url: "/proposals", icon: FileText },
  { title: "Policies", url: "/policies", icon: Scale },
  { title: "Contact", url: "/contact", icon: Phone },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50";

  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Logged out successfully"
      });
    }
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      {/* Header with user profile */}
      <SidebarHeader>
        {user && !isCollapsed && (
          <div className="flex items-center gap-3 p-4 border-b">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.user_metadata?.full_name || user.email}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
        {user && isCollapsed && (
          <div className="flex justify-center p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Medical Camps</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClassName}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with auth actions */}
      <SidebarFooter>
        <div className="p-2">
          {user ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Logout</span>}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="w-full"
            >
              <NavLink to="/auth">
                <LogIn className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Login</span>}
              </NavLink>
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
