
import { useState } from "react";
import { Check, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Mock data for daily attendance
const mockAttendance = [
  {
    id: 1,
    name: "Emma Wilson",
    status: "present",
    arrivalTime: "08:15",
    pickupTime: "17:30",
    notes: "",
  },
  {
    id: 2,
    name: "Noah Smith",
    status: "present",
    arrivalTime: "08:45",
    pickupTime: "16:15",
    notes: "",
  },
  {
    id: 3,
    name: "Olivia Davis",
    status: "absent",
    arrivalTime: "",
    pickupTime: "",
    notes: "Parent called - sick with cold",
  },
  {
    id: 4,
    name: "Liam Johnson",
    status: "present",
    arrivalTime: "09:10",
    pickupTime: "",
    notes: "Late arrival - doctor appointment",
  },
  {
    id: 5,
    name: "Sophia Brown",
    status: "present",
    arrivalTime: "08:30",
    pickupTime: "",
    notes: "",
  },
  {
    id: 6,
    name: "Lucas Taylor",
    status: "absent",
    arrivalTime: "",
    pickupTime: "",
    notes: "No notification",
  },
];

type AttendanceStatus = "present" | "absent" | "not-set";

interface DailyAttendanceProps {
  date: Date;
}

export function DailyAttendance({ date }: DailyAttendanceProps) {
  const [attendance, setAttendance] = useState(mockAttendance);
  
  const formatDate = format(date, "EEEE, MMMM d, yyyy");
  
  const markAttendance = (id: number, status: AttendanceStatus) => {
    const updatedAttendance = attendance.map(child => {
      if (child.id === id) {
        return {
          ...child,
          status: status,
          arrivalTime: status === "present" ? format(new Date(), "HH:mm") : "",
        };
      }
      return child;
    });
    
    setAttendance(updatedAttendance);
    const child = attendance.find(child => child.id === id);
    
    if (child) {
      toast.success(`${child.name} marked as ${status}`);
    }
  };
  
  const updateNotes = (id: number, notes: string) => {
    const updatedAttendance = attendance.map(child => {
      if (child.id === id) {
        return { ...child, notes };
      }
      return child;
    });
    
    setAttendance(updatedAttendance);
  };
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="font-medium">{formatDate}</h3>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-3 bg-muted font-medium text-sm">
          <div className="col-span-2">Child</div>
          <div>Status</div>
          <div>Arrival</div>
          <div>Pickup</div>
          <div>Notes</div>
        </div>
        
        {attendance.map((child) => (
          <div key={child.id} className="grid grid-cols-6 gap-4 p-3 border-t items-center">
            <div className="col-span-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-kiddo-blue-light text-kiddo-blue flex items-center justify-center font-medium">
                {child.name.charAt(0)}
              </div>
              <span>{child.name}</span>
            </div>
            
            <div>
              <Select
                value={child.status}
                onValueChange={(value) => markAttendance(child.id, value as AttendanceStatus)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue>
                    {child.status === "present" ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Present</span>
                      </div>
                    ) : child.status === "absent" ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span>Absent</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <span>Not Set</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Present</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="absent">
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-500" />
                      <span>Absent</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="not-set">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gray-400"></div>
                      <span>Not Set</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              {child.arrivalTime ? (
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>{child.arrivalTime}</span>
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">--:--</span>
              )}
            </div>
            
            <div>
              {child.pickupTime ? (
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>{child.pickupTime}</span>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-xs"
                  disabled={child.status !== "present"}
                >
                  Set Pickup Time
                </Button>
              )}
            </div>
            
            <div>
              <Input 
                className="h-7 text-xs" 
                placeholder="Add notes..." 
                value={child.notes}
                onChange={(e) => updateNotes(child.id, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
