
import { Check, Download, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface AttendanceTableProps {
  month: number;
  year: number;
}

// Mock data for monthly attendance
const mockChildren = [
  { id: 1, name: "Emma Wilson" },
  { id: 2, name: "Noah Smith" },
  { id: 3, name: "Olivia Davis" },
  { id: 4, name: "Liam Johnson" },
  { id: 5, name: "Sophia Brown" },
];

// Generate random attendance data
const generateMockData = () => {
  const attendance: { [key: string]: { [key: string]: string } } = {};
  
  mockChildren.forEach(child => {
    attendance[child.id] = {};
    
    // Generate attendance for 30 days
    for (let day = 1; day <= 30; day++) {
      const random = Math.random();
      if (random < 0.8) {
        attendance[child.id][day.toString()] = "present";
      } else if (random < 0.95) {
        attendance[child.id][day.toString()] = "absent";
      } else {
        attendance[child.id][day.toString()] = "not-scheduled";
      }
      
      // Weekend days are usually not scheduled
      if (day % 7 === 0 || day % 7 === 6) {
        attendance[child.id][day.toString()] = "not-scheduled";
      }
    }
  });
  
  return attendance;
};

const monthlyAttendance = generateMockData();

export function AttendanceTable({ month, year }: AttendanceTableProps) {
  // Get total number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create an array of day numbers from 1 to daysInMonth
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Function to determine if a day is a weekend
  const isWeekend = (day: number) => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
    return dayOfWeek === 0 || dayOfWeek === 6;
  };
  
  return (
    <div className="overflow-auto">
      <table className="w-full min-w-[800px] text-sm">
        <thead>
          <tr>
            <th className="text-left p-2 border-b">Child</th>
            {days.map(day => (
              <th 
                key={day} 
                className={`p-2 text-center border-b ${isWeekend(day) ? 'bg-muted' : ''}`}
                title={format(new Date(year, month, day), "EEEE, MMM d")}
              >
                {day}
              </th>
            ))}
            <th className="p-2 text-center border-b">%</th>
          </tr>
        </thead>
        <tbody>
          {mockChildren.map(child => {
            // Calculate attendance percentage
            const scheduled = days.filter(day => 
              monthlyAttendance[child.id][day.toString()] !== "not-scheduled"
            ).length;
            
            const present = days.filter(day => 
              monthlyAttendance[child.id][day.toString()] === "present"
            ).length;
            
            const percentage = scheduled > 0 ? Math.round((present / scheduled) * 100) : 0;
            
            return (
              <tr key={child.id} className="hover:bg-muted/50">
                <td className="p-2 border-b">{child.name}</td>
                {days.map(day => {
                  const status = monthlyAttendance[child.id][day.toString()];
                  return (
                    <td 
                      key={day} 
                      className={`p-2 text-center border-b ${isWeekend(day) ? 'bg-muted/50' : ''}`}
                    >
                      {status === "present" && (
                        <Check className="h-4 w-4 mx-auto text-green-500" />
                      )}
                      {status === "absent" && (
                        <X className="h-4 w-4 mx-auto text-red-500" />
                      )}
                      {status === "not-scheduled" && (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  );
                })}
                <td className={`p-2 text-center border-b font-medium ${
                  percentage >= 90 ? 'text-green-600' : 
                  percentage >= 70 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {percentage}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Present</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
            <span>Not Scheduled</span>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
