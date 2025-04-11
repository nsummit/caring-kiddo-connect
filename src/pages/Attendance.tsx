
import { useState } from "react";
import { Calendar, Check, Download, Filter, Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from "sonner";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { DailyAttendance } from "@/components/attendance/DailyAttendance";
import { attendanceApi, childrenApi } from "@/services/api";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function Attendance() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"daily" | "monthly">("daily");
  const [searchTerm, setSearchTerm] = useState("");

  // Format date for API request (YYYY-MM-DD)
  const formattedDate = format(date, "yyyy-MM-dd");
  
  // Fetch attendance data for the selected date
  const { 
    data: attendanceData,
    isLoading: attendanceLoading,
    isError: attendanceError,
    refetch: refetchAttendance
  } = useQuery({
    queryKey: ['attendance', formattedDate],
    queryFn: () => attendanceApi.getAttendanceByDate(formattedDate),
  });

  // Fetch all children
  const {
    data: childrenData = [],
    isLoading: childrenLoading,
  } = useQuery({
    queryKey: ['children'],
    queryFn: childrenApi.getAllChildren,
  });

  // Mutation for marking attendance
  const markAttendanceMutation = useMutation({
    mutationFn: attendanceApi.markAttendance,
    onSuccess: () => {
      refetchAttendance();
    }
  });

  // Mutation for updating attendance
  const updateAttendanceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => attendanceApi.updateAttendance(id, data),
    onSuccess: () => {
      refetchAttendance();
    }
  });

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      toast(`Selected date: ${format(newDate, "MMMM d, yyyy")}`);
    }
  };

  // Handle marking attendance
  const handleMarkAttendance = (childId: string, status: 'present' | 'absent' | 'not-scheduled') => {
    const existingRecord = attendanceData?.find((record: any) => record.child === childId);
    
    if (existingRecord) {
      // Update existing record
      updateAttendanceMutation.mutate({
        id: existingRecord._id,
        data: { status }
      });
    } else {
      // Create new attendance record
      markAttendanceMutation.mutate({
        child: childId,
        date: formattedDate,
        status
      });
    }
  };

  // Calculate attendance statistics
  const getAttendanceStats = () => {
    if (!attendanceData) return { present: 0, absent: 0, notScheduled: 0, total: 0, percentage: 0 };
    
    const present = attendanceData.filter((record: any) => record.status === 'present').length;
    const absent = attendanceData.filter((record: any) => record.status === 'absent').length;
    const notScheduled = attendanceData.filter((record: any) => record.status === 'not-scheduled').length;
    const total = childrenData.length;
    const percentage = total > 0 ? Math.round((present / (total - notScheduled)) * 100) : 0;
    
    return { present, absent, notScheduled, total, percentage };
  };

  const stats = getAttendanceStats();

  // Filter children based on search term
  const filteredChildren = childrenData.filter((child: any) => {
    const fullName = `${child.firstName} ${child.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Attendance</h1>
          <p className="text-muted-foreground">
            Track and manage children's attendance records
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {format(date, "MMMM d, yyyy")}
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              className="rounded-md border"
            />
            
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Today's Attendance:</span>
                <span className="font-medium">
                  {stats.present}/{stats.total - stats.notScheduled} ({stats.percentage}%)
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Present</span>
                </div>
                <span className="text-sm font-medium">{stats.present}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Absent</span>
                </div>
                <span className="text-sm font-medium">{stats.absent}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-sm">Not Scheduled</span>
                </div>
                <span className="text-sm font-medium">{stats.notScheduled}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Attendance Record</CardTitle>
              <Tabs value={view} onValueChange={(v) => setView(v as "daily" | "monthly")} className="w-[360px]">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="daily">Daily View</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search children..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            
            {(attendanceLoading || childrenLoading) && (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading attendance data...</span>
              </div>
            )}
            
            {attendanceError && (
              <div className="text-center p-12">
                <p className="text-destructive">Failed to load attendance data</p>
                <Button variant="outline" onClick={() => refetchAttendance()} className="mt-4">
                  Retry
                </Button>
              </div>
            )}
            
            {!attendanceLoading && !attendanceError && view === "daily" && (
              <div className="space-y-2">
                {filteredChildren.map((child: any) => {
                  const attendanceRecord = attendanceData?.find((record: any) => record.child === child._id);
                  const status = attendanceRecord ? attendanceRecord.status : 'absent';
                  
                  return (
                    <div key={child._id} className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-kiddo-blue-light text-kiddo-blue flex items-center justify-center font-medium mr-3">
                          {child.firstName.charAt(0)}{child.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{`${child.firstName} ${child.lastName}`}</p>
                          <p className="text-sm text-muted-foreground">
                            Parent: {child.parentDetails.firstName} {child.parentDetails.lastName}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant={status === 'present' ? 'default' : 'outline'}
                          className={status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => handleMarkAttendance(child._id, 'present')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Present
                        </Button>
                        <Button 
                          size="sm" 
                          variant={status === 'absent' ? 'default' : 'outline'}
                          className={status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                          onClick={() => handleMarkAttendance(child._id, 'absent')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Absent
                        </Button>
                        <Button 
                          size="sm" 
                          variant={status === 'not-scheduled' ? 'default' : 'outline'}
                          className={status === 'not-scheduled' ? 'bg-gray-500 hover:bg-gray-600' : ''}
                          onClick={() => handleMarkAttendance(child._id, 'not-scheduled')}
                        >
                          Not Scheduled
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                {filteredChildren.length === 0 && (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">No children found matching your search criteria.</p>
                  </div>
                )}
              </div>
            )}
            
            {!attendanceLoading && !attendanceError && view === "monthly" && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b">Name</th>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <th key={day} className="p-2 border-b text-center w-10">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChildren.map((child: any) => (
                      <tr key={child._id}>
                        <td className="p-2 border-b font-medium">{`${child.firstName} ${child.lastName}`}</td>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                          // In a real app, we would fetch the month's data and display it here
                          const randomStatus = Math.random() > 0.8 ? 'absent' : Math.random() > 0.9 ? 'not-scheduled' : 'present';
                          return (
                            <td key={day} className="p-2 border-b text-center">
                              <div className={`w-3 h-3 rounded-full mx-auto ${
                                randomStatus === 'present' ? 'bg-green-500' :
                                randomStatus === 'absent' ? 'bg-red-500' :
                                'bg-gray-300'
                              }`}></div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Note: The monthly view is showing sample data. In a production environment, this would display actual attendance records.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
