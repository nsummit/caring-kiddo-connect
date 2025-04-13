
import * as React from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SidebarContext = React.createContext({
  isOpen: false,
  setIsOpen: () => {},
});

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarTrigger() {
  const { isOpen, setIsOpen } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsOpen(!isOpen)}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}

export function Sidebar({ className, children, ...props }) {
  const { isOpen, setIsOpen } = useSidebar();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle click outside to close on mobile
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (window.innerWidth < 768 && isOpen) {
        const sidebarElement = document.getElementById("sidebar");
        if (sidebarElement && !sidebarElement.contains(event.target)) {
          setIsOpen(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      id="sidebar"
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-sidebar transition-transform duration-300 md:relative md:top-auto md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarHeader({ className, ...props }) {
  return <div className={cn("px-4 py-4", className)} {...props} />;
}

export function SidebarContent({ className, ...props }) {
  return <div className={cn("flex-1 overflow-auto", className)} {...props} />;
}

export function SidebarGroup({ className, ...props }) {
  return <div className={cn("pb-4", className)} {...props} />;
}

export function SidebarGroupLabel({ className, ...props }) {
  return (
    <h3
      className={cn("mb-2 px-4 text-xs font-medium text-sidebar-muted", className)}
      {...props}
    />
  );
}

export function SidebarGroupContent({ className, ...props }) {
  return <div className={cn("space-y-1 px-2", className)} {...props} />;
}

export function SidebarMenu({ className, ...props }) {
  return <nav className={cn("", className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }) {
  return <div className={cn("", className)} {...props} />;
}

export function SidebarMenuButton({ className, asChild, ...props }) {
  const Comp = asChild ? React.Fragment : "button";
  return (
    <Comp
      className={cn(
        "group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-hover hover:text-sidebar-foreground-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  );
}

export function SidebarFooter({ className, ...props }) {
  return (
    <div className={cn("mt-auto", className)} {...props} />
  );
}

export function SidebarOverlay({ isOpen, setIsOpen }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-10 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      onClick={() => setIsOpen(false)}
      aria-hidden="true"
    />
  );
}
