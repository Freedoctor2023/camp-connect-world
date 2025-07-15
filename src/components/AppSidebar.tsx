
import { NavLink, useLocation } from "react-router-dom";
import { Home, Plus, Heart, Building, FileText, Shield, Scale, Phone } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

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

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50";

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
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
    </Sidebar>
  );
}
