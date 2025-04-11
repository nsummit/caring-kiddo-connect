
import {
  ArrowRight,
  Calendar,
  MessageCircle,
  Users,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { childrenApi, attendanceApi, communicationApi } from "@/services/api";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");
  
  // Fetch all children
  const { 
    data: children = [], 
    isLoading: childrenLoading 
  } = useQuery({
    queryKey: ['dashboard-children'],
    queryFn: childrenApi.getAllChildren,
  });
  
  // Fetch today's attendance
  const { 
    data: attendance = [], 
    isLoading: attendanceLoading 
  } = useQuery({
    queryKey: ['dashboard-attendance', today],
    queryFn: () => attendanceApi.getAttendanceByDate(today),
  });
  
  // Fetch unread messages
  const { 
    data: messages = [], 
    isLoading: messagesLoading 
  } = useQuery({
    queryKey: ['dashboard-messages'],
    queryFn: communicationApi.getAllMessages,
  });
  
  // Calculate dashboard statistics
  const calculateStats = () => {
    const totalChildren = children.length || 0;
    
    const presentCount = attendance.filter((record: any) => record.status === 'present').length;
    const attendancePercentage = attendance.length > 0 
      ? Math.round((presentCount / attendance.length) * 100) 
      : 0;
    
    const pendingReports = 7; // Mock data, would be fetched from API
    
    const unreadMessages = messages.filter((message: any) => !message.read).length;
    const uniqueParents = new Set(messages.filter((message: any) => !message.read)
      .map((message: any) => `${message.sender.firstName} ${message.sender.lastName}`));
    
    return [
      {
        title: "Total Children",
        value: totalChildren.toString(),
        change: "+2 this month",
        icon: Users,
        color: "bg-kiddo-blue/10 text-kiddo-blue",
      },
      {
        title: "Present Today",
        value: presentCount.toString(),
        change: `${attendancePercentage}% attendance`,
        icon: Calendar,
        color: "bg-kiddo-green/10 text-kiddo-green",
      },
      {
        title: "Pending Reports",
        value: pendingReports.toString(),
        change: "Due this week",
        icon: FileSpreadsheet,
        color: "bg-kiddo-orange/10 text-kiddo-orange",
      },
      {
        title: "New Messages",
        value: unreadMessages.toString(),
        change: `From ${uniqueParents.size} parents`,
        icon: MessageCircle,
        color: "bg-primary/10 text-primary",
      },
    ];
  };
  
  // Demo data for activities and reminders
  const recentActivities = [
    {
      child: "Emma Wilson",
      activity: "Marked present by Sarah",
      time: "10 minutes ago",
    },
    {
      child: "Noah Smith",
      activity: "New milestone recorded",
      time: "25 minutes ago",
    },
    {
      child: "Olivia Davis",
      activity: "Parent left a new comment",
      time: "1 hour ago",
    },
    {
      child: "Liam Johnson",
      activity: "Medical information updated",
      time: "2 hours ago",
    },
  ];

  const upcomingReminders = [
    {
      title: "Complete Weekly Progress Reports",
      date: "Today",
      priority: "high",
    },
    {
      title: "Parent-Teacher Meeting",
      date: "Tomorrow",
      priority: "medium",
    },
    {
      title: "Renew First Aid Certification",
      date: "Next Week",
      priority: "medium",
    },
    {
      title: "Quarterly Assessment",
      date: "In 2 Weeks",
      priority: "low",
    },
  ];
  
  // Calculate stats
  const stats = calculateStats();
  
  // Loading state
  const isLoading = childrenLoading || attendanceLoading || messagesLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Good morning, {user?.name || 'Sarah'}! Here's what's happening today.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          <span className="ml-2 text-lg text-muted-foreground">Loading dashboard data...</span>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`${stat.color} p-2 rounded-full h-8 w-8 flex items-center justify-center`}
                  >
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activities</CardTitle>
                <Link to="/activities">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recentActivities.map((activity, i) => (
                    <li
                      key={i}
                      className="flex items-start pb-4 last:pb-0 last:mb-0 last:border-0 border-b"
                    >
                      <div className="w-8 h-8 rounded-full bg-kiddo-blue-light flex items-center justify-center text-kiddo-blue font-semibold mr-3">
                        {activity.child.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.child}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.activity}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming Reminders</CardTitle>
                <Link to="/reminders">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {upcomingReminders.map((reminder, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center pb-4 last:pb-0 last:mb-0 last:border-0 border-b"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {reminder.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {reminder.date}
                        </p>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          reminder.priority === "high"
                            ? "bg-destructive/10 text-destructive"
                            : reminder.priority === "medium"
                            ? "bg-kiddo-orange/10 text-kiddo-orange"
                            : "bg-kiddo-green/10 text-kiddo-green"
                        }`}
                      >
                        {reminder.priority.charAt(0).toUpperCase() +
                          reminder.priority.slice(1)}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
