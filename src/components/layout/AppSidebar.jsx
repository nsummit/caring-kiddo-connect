
import {
  BarChart3,
  Calendar,
  FileSpreadsheet,
  MessageCircle,
  User,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    path: "/",
  },
  {
    title: "Children",
    icon: Users,
    path: "/children",
  },
  {
    title: "Attendance",
    icon: Calendar,
    path: "/attendance",
  },
  {
    title: "Progress",
    icon: FileSpreadsheet,
    path: "/progress",
  },
  {
    title: "Communication",
    icon: MessageCircle,
    path: "/communication",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4">
        <div className="font-nunito text-3xl font-bold text-sidebar-primary">
          <span>Kiddo</span>
          <span className="text-secondary">Connect</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 p-4 border-t">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-sm">Sarah Johnson</p>
            <p className="text-xs text-muted-foreground">Owner</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
