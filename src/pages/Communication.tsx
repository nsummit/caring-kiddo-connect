
import { useState } from "react";
import {
  Bell,
  FileText,
  MessageSquare,
  Plus,
  Search,
  Send,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    child: "Emma Wilson",
    parent: "Michelle Wilson",
    subject: "Pickup arrangements for Friday",
    preview: "Hi, my husband will be picking Emma up on Friday as I have a doctor's appointment...",
    date: "10 mins ago",
    unread: true,
  },
  {
    id: 2,
    child: "Noah Smith",
    parent: "Jessica Smith",
    subject: "Allergies update",
    preview: "I wanted to let you know that Noah's allergy test results came back and he's no longer allergic to...",
    date: "2 hours ago",
    unread: true,
  },
  {
    id: 3,
    child: "Olivia Davis",
    parent: "Sarah Davis",
    subject: "Thank you!",
    preview: "I just wanted to say thank you for the wonderful art project Olivia brought home yesterday...",
    date: "Yesterday",
    unread: false,
  },
  {
    id: 4,
    child: "Liam Johnson",
    parent: "Emily Johnson",
    subject: "Absence next week",
    preview: "Liam will be absent next Monday and Tuesday as we'll be visiting family out of town...",
    date: "2 days ago",
    unread: false,
  },
  {
    id: 5,
    child: "Sophia Brown",
    parent: "Rebecca Brown",
    subject: "Question about progress",
    preview: "I was wondering if we could set up a quick meeting to discuss Sophia's progress in reading...",
    date: "3 days ago",
    unread: false,
  },
];

// Mock conversation thread
const mockConversation = [
  {
    id: 101,
    sender: "Michelle Wilson",
    role: "parent",
    message: "Hi, my husband will be picking Emma up on Friday as I have a doctor's appointment. His name is John Wilson and he's on the emergency contacts list.",
    date: "Today, 9:45 AM",
  },
  {
    id: 102,
    sender: "Sarah Johnson",
    role: "staff",
    message: "Thank you for letting me know! Yes, I can see John is on Emma's approved pickup list, so that won't be a problem at all.",
    date: "Today, 10:15 AM",
  },
  {
    id: 103,
    sender: "Michelle Wilson",
    role: "parent",
    message: "Great, thank you! Also, Emma has been talking about a special art project she's working on. Is there anything she needs to bring from home for that?",
    date: "Today, 10:30 AM",
  },
  {
    id: 104,
    sender: "Sarah Johnson",
    role: "staff",
    message: "Emma is doing wonderfully with her art project! We're creating family portraits this week. Everything is provided here, but if she wants to bring in a family photo for reference, that would be lovely!",
    date: "Today, 11:20 AM",
  },
];

export default function Communication() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  
  const handleSendReply = () => {
    if (replyText.trim()) {
      // In a real app, this would send the message to the backend
      toast.success("Message sent successfully!");
      setReplyText("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Communication</h1>
          <p className="text-muted-foreground">
            Securely communicate with parents and share updates
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-kiddo-blue hover:bg-kiddo-blue-dark">
                <Plus className="mr-2 h-4 w-4" />
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="recipient" className="text-sm font-medium">To (Parent)</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="michelle">Michelle Wilson (Emma's parent)</SelectItem>
                      <SelectItem value="jessica">Jessica Smith (Noah's parent)</SelectItem>
                      <SelectItem value="sarah">Sarah Davis (Olivia's parent)</SelectItem>
                      <SelectItem value="emily">Emily Johnson (Liam's parent)</SelectItem>
                      <SelectItem value="rebecca">Rebecca Brown (Sophia's parent)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" placeholder="Enter message subject" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea 
                    id="message" 
                    placeholder="Type your message here..." 
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Attachments (Optional)</label>
                  <div className="border-2 border-dashed rounded-md p-4 text-center">
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Max file size: 5MB
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-kiddo-blue hover:bg-kiddo-blue-dark">Send Message</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Bell className="mr-2 h-4 w-4" />
                Send Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Send Announcement</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipients</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Parents</SelectItem>
                      <SelectItem value="specific">Select Specific Parents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="announcement-title" className="text-sm font-medium">Title</label>
                  <Input id="announcement-title" placeholder="Enter announcement title" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="announcement" className="text-sm font-medium">Announcement</label>
                  <Textarea 
                    id="announcement" 
                    placeholder="Type your announcement here..." 
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority Level</label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High - Urgent</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low - Informational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-kiddo-blue hover:bg-kiddo-blue-dark">Send Announcement</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="messages">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="reports">Shared Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="mt-6">
          <Card className="min-h-[600px]">
            <CardContent className="p-0 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x h-[600px]">
              <div className="md:w-1/3 p-4 h-full overflow-y-auto">
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search messages..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  {mockMessages.map((message) => (
                    <button
                      key={message.id}
                      className={`w-full text-left p-3 rounded-md hover:bg-muted/80 transition-colors ${
                        selectedMessage?.id === message.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-kiddo-blue-light text-kiddo-blue flex items-center justify-center font-medium">
                            {message.parent.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{message.parent}</p>
                            <p className="text-xs text-muted-foreground">
                              Re: {message.child}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-muted-foreground">
                            {message.date}
                          </span>
                          {message.unread && (
                            <div className="w-2 h-2 mt-1 rounded-full bg-kiddo-blue"></div>
                          )}
                        </div>
                      </div>
                      <p className="mt-1 text-sm font-medium">{message.subject}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        {message.preview}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="md:w-2/3 p-4 flex flex-col h-full overflow-hidden">
                {selectedMessage ? (
                  <>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">{selectedMessage.subject}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>
                          Conversation with {selectedMessage.parent} about {selectedMessage.child}
                        </span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {mockConversation.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'staff' ? 'justify-end' : ''}`}>
                          <div className={`max-w-[80%] rounded-lg p-4 ${
                            msg.role === 'staff' 
                              ? 'bg-kiddo-blue/10 text-foreground' 
                              : 'bg-muted'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                msg.role === 'staff'
                                  ? 'bg-kiddo-blue text-white'
                                  : 'bg-kiddo-orange-light text-kiddo-orange-dark'
                              }`}>
                                {msg.sender.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{msg.sender}</p>
                                <p className="text-xs text-muted-foreground">{msg.date}</p>
                              </div>
                            </div>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="relative">
                      <Textarea 
                        placeholder="Type your reply..." 
                        className="min-h-[100px] pr-12"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <Button 
                        className="absolute bottom-2 right-2 h-8 w-8 p-0"
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground opacity-40 mb-4" />
                    <h3 className="text-lg font-medium">No message selected</h3>
                    <p className="text-muted-foreground mt-1">
                      Select a message from the list to view the conversation
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="announcements" className="mt-6">
          <Card className="min-h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Announcements</CardTitle>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="normal">Normal Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Spring Festival Next Friday</h3>
                  <Badge className="bg-green-100 text-green-800 border-green-300 border">
                    Normal
                  </Badge>
                </div>
                <p className="text-sm">
                  We're excited to announce our Spring Festival next Friday from 2pm-4pm. 
                  Children will be performing songs and displaying their artwork. Parents are 
                  encouraged to attend and bring a small snack to share.
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Sent to: All Parents</span>
                  <span>April 5, 2025</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Updated Health and Safety Procedures</h3>
                  <Badge className="bg-red-100 text-red-800 border-red-300 border">
                    High
                  </Badge>
                </div>
                <p className="text-sm">
                  Following updated guidance from health authorities, we've revised our health 
                  and safety procedures. Please review the attached document carefully and familiarize 
                  yourself with the new drop-off and pick-up protocols starting next Monday.
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Sent to: All Parents</span>
                  <span>April 3, 2025</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Parent Volunteers Needed</h3>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300 border">
                    Low
                  </Badge>
                </div>
                <p className="text-sm">
                  We're looking for parent volunteers to help with our upcoming garden project. 
                  If you have experience with gardening or simply want to help out, please let us know. 
                  We plan to plant vegetables and flowers with the children as part of our nature curriculum.
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Sent to: All Parents</span>
                  <span>March 28, 2025</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">New Staff Introduction</h3>
                  <Badge className="bg-green-100 text-green-800 border-green-300 border">
                    Normal
                  </Badge>
                </div>
                <p className="text-sm">
                  We're pleased to welcome Ms. Jane Thompson to our team. Jane has over 10 years of 
                  experience in early childhood education and will be joining the Butterflies room. 
                  She's excited to meet all the children and their families in the coming days.
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Sent to: All Parents</span>
                  <span>March 25, 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <Card className="min-h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Shared Reports</CardTitle>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by child" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Children</SelectItem>
                    <SelectItem value="emma">Emma Wilson</SelectItem>
                    <SelectItem value="noah">Noah Smith</SelectItem>
                    <SelectItem value="olivia">Olivia Davis</SelectItem>
                    <SelectItem value="liam">Liam Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Progress Report</p>
                    <p className="text-xs text-muted-foreground">Emma Wilson</p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    Shared with: Michelle Wilson
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">April 7, 2025</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Report
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Quarterly Assessment</p>
                    <p className="text-xs text-muted-foreground">Noah Smith</p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    Shared with: Jessica Smith
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">April 5, 2025</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Report
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Development Summary</p>
                    <p className="text-xs text-muted-foreground">Olivia Davis</p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    Shared with: Sarah Davis
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">April 2, 2025</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Report
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Monthly Progress Report</p>
                    <p className="text-xs text-muted-foreground">Liam Johnson</p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    Shared with: Emily Johnson
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">March 25, 2025</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Report
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Reading Assessment</p>
                    <p className="text-xs text-muted-foreground">Sophia Brown</p>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    Shared with: Rebecca Brown
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">March 20, 2025</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Report
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
