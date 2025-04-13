import { useState, useEffect } from "react";
import {
  Bell,
  FileText,
  MessageSquare,
  Plus,
  Search,
  Send,
  User,
  Loader2,
  FileIcon
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
import { format } from "date-fns";
import { communicationApi, childrenApi } from "@/services/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export default function Communication() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [selectedParent, setSelectedParent] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementPriority, setAnnouncementPriority] = useState("normal");
  
  const { user } = useAuth();
  
  const { 
    data: messages = [], 
    isLoading: messagesLoading, 
    isError: messagesError,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['messages'],
    queryFn: communicationApi.getAllMessages,
  });
  
  const { 
    data: announcements = [], 
    isLoading: announcementsLoading, 
    isError: announcementsError,
    refetch: refetchAnnouncements
  } = useQuery({
    queryKey: ['announcements'],
    queryFn: communicationApi.getAnnouncements,
  });
  
  const { 
    data: children = [], 
    isLoading: childrenLoading 
  } = useQuery({
    queryKey: ['children'],
    queryFn: childrenApi.getAllChildren,
  });
  
  const sendMessageMutation = useMutation({
    mutationFn: communicationApi.sendMessage,
    onSuccess: () => {
      refetchMessages();
      setIsNewMessageOpen(false);
      resetMessageForm();
    }
  });
  
  const sendReplyMutation = useMutation({
    mutationFn: communicationApi.sendMessage,
    onSuccess: () => {
      refetchMessages();
      setReplyText("");
    }
  });
  
  const sendAnnouncementMutation = useMutation({
    mutationFn: communicationApi.sendAnnouncement,
    onSuccess: () => {
      refetchAnnouncements();
      setIsAnnouncementOpen(false);
      resetAnnouncementForm();
    }
  });
  
  const resetMessageForm = () => {
    setSelectedParent("");
    setMessageSubject("");
    setMessageContent("");
  };
  
  const resetAnnouncementForm = () => {
    setAnnouncementTitle("");
    setAnnouncementContent("");
    setAnnouncementPriority("normal");
  };
  
  const parents = children.reduce((acc: any[], child: any) => {
    const parent = child.parentDetails;
    if (parent) {
      const existingParent = acc.find(p => p.id === parent._id);
      if (!existingParent) {
        acc.push({
          id: parent._id,
          name: `${parent.firstName} ${parent.lastName}`,
          email: parent.email,
          childName: `${child.firstName} ${child.lastName}`
        });
      }
    }
    return acc;
  }, []);
  
  const filteredMessages = messages.filter((message: any) => {
    const content = message.content.toLowerCase();
    const subject = message.subject.toLowerCase();
    const senderName = `${message.sender.firstName} ${message.sender.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return content.includes(search) || subject.includes(search) || senderName.includes(search);
  });
  
  const handleSendMessage = () => {
    if (!selectedParent || !messageSubject || !messageContent) {
      toast.error("Please fill in all fields");
      return;
    }
    
    sendMessageMutation.mutate({
      recipient: selectedParent,
      subject: messageSubject,
      content: messageContent,
      sender: user?._id
    });
  };
  
  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    sendReplyMutation.mutate({
      recipient: selectedMessage.sender._id,
      subject: `Re: ${selectedMessage.subject}`,
      content: replyText,
      sender: user?._id,
      parentMessage: selectedMessage._id
    });
  };
  
  const handleSendAnnouncement = () => {
    if (!announcementTitle || !announcementContent) {
      toast.error("Please fill in all fields");
      return;
    }
    
    sendAnnouncementMutation.mutate({
      title: announcementTitle,
      content: announcementContent,
      priority: announcementPriority,
      sender: user?._id
    });
  };

  const getChildNameFromParent = (parentId: string) => {
    const childInfo = children.find((child: any) => 
      child.parentDetails && child.parentDetails._id === parentId
    );
    return childInfo ? `${childInfo.firstName} ${childInfo.lastName}` : "Unknown Child";
  };
  
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    return format(date, "MMM d, yyyy");
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
          <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
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
                  <Select value={selectedParent} onValueChange={setSelectedParent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent" />
                    </SelectTrigger>
                    <SelectContent>
                      {parents.map((parent: any) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.name} ({parent.childName}'s parent)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input 
                    id="subject" 
                    placeholder="Enter message subject" 
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea 
                    id="message" 
                    placeholder="Type your message here..." 
                    rows={6}
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
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
                <Button variant="outline" onClick={() => setIsNewMessageOpen(false)}>Cancel</Button>
                <Button 
                  className="bg-kiddo-blue hover:bg-kiddo-blue-dark"
                  onClick={handleSendMessage}
                  disabled={sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
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
                  <Input 
                    id="announcement-title" 
                    placeholder="Enter announcement title" 
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="announcement" className="text-sm font-medium">Announcement</label>
                  <Textarea 
                    id="announcement" 
                    placeholder="Type your announcement here..." 
                    rows={6}
                    value={announcementContent}
                    onChange={(e) => setAnnouncementContent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority Level</label>
                  <Select value={announcementPriority} onValueChange={setAnnouncementPriority}>
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
                <Button variant="outline" onClick={() => setIsAnnouncementOpen(false)}>Cancel</Button>
                <Button 
                  className="bg-kiddo-blue hover:bg-kiddo-blue-dark"
                  onClick={handleSendAnnouncement}
                  disabled={sendAnnouncementMutation.isPending}
                >
                  {sendAnnouncementMutation.isPending ? "Sending..." : "Send Announcement"}
                </Button>
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
                
                {messagesLoading ? (
                  <div className="flex justify-center items-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading messages...</span>
                  </div>
                ) : messagesError ? (
                  <div className="text-center p-12">
                    <p className="text-destructive">Failed to load messages</p>
                    <Button variant="outline" onClick={() => refetchMessages()} className="mt-4">
                      Retry
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredMessages.map((message: any) => (
                      <button
                        key={message._id}
                        className={`w-full text-left p-3 rounded-md hover:bg-muted/80 transition-colors ${
                          selectedMessage?._id === message._id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-kiddo-blue-light text-kiddo-blue flex items-center justify-center font-medium">
                              {message.sender.firstName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {message.sender.firstName} {message.sender.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Re: {getChildNameFromParent(message.sender._id)}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(message.createdAt)}
                            </span>
                            {!message.read && (
                              <div className="w-2 h-2 mt-1 rounded-full bg-kiddo-blue"></div>
                            )}
                          </div>
                        </div>
                        <p className="mt-1 text-sm font-medium">{message.subject}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {message.content}
                        </p>
                      </button>
                    ))}

                    {filteredMessages.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No messages found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="md:w-2/3 p-4 flex flex-col h-full overflow-hidden">
                {selectedMessage ? (
                  <>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">{selectedMessage.subject}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>
                          Conversation with {selectedMessage.sender.firstName} {selectedMessage.sender.lastName} about {getChildNameFromParent(selectedMessage.sender._id)}
                        </span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {/* Original message */}
                      <div className="flex">
                        <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-kiddo-orange-light text-kiddo-orange-dark flex items-center justify-center text-xs font-medium">
                              {selectedMessage.sender.firstName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {selectedMessage.sender.firstName} {selectedMessage.sender.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatRelativeTime(selectedMessage.createdAt)}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm">{selectedMessage.content}</p>
                        </div>
                      </div>
                      
                      {/* Replies would be loaded here */}
                      {selectedMessage.replies && selectedMessage.replies.map((reply: any) => (
                        <div key={reply._id} className="flex justify-end">
                          <div className="max-w-[80%] rounded-lg p-4 bg-kiddo-blue/10">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-full bg-kiddo-blue text-white flex items-center justify-center text-xs font-medium">
                                {reply.sender.firstName.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {reply.sender.firstName} {reply.sender.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatRelativeTime(reply.createdAt)}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm">{reply.content}</p>
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
                        disabled={!replyText.trim() || sendReplyMutation.isPending}
                      >
                        {sendReplyMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
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
              {announcementsLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading announcements...</span>
                </div>
              ) : announcementsError ? (
                <div className="text-center p-12">
                  <p className="text-destructive">Failed to load announcements</p>
                  <Button variant="outline" onClick={() => refetchAnnouncements()} className="mt-4">
                    Retry
                  </Button>
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center p-12">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-40 mb-4" />
                  <h3 className="text-lg font-medium">No announcements yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Create a new announcement to get started
                  </p>
                </div>
              ) : (
                announcements.map((announcement: any) => (
                  <div key={announcement._id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{announcement.title}</h3>
                      <Badge className={`
                        ${announcement.priority === 'high' ? 'bg-red-100 text-red-800 border-red-300' : 
                          announcement.priority === 'low' ? 'bg-blue-100 text-blue-800 border-blue-300' : 
                          'bg-green-100 text-green-800 border-green-300'} border
                      `}>
                        {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm">{announcement.content}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Sent to: {announcement.recipients === 'all' ? 'All Parents' : 'Selected Parents'}</span>
                      <span>{formatRelativeTime(announcement.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
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
                    {children.map((child) => (
                      <SelectItem key={child._id} value={child._id}>
                        {child.firstName} {child.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="text-center p-12 col-span-3">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-40 mb-4" />
                <h3 className="text-lg font-medium">No reports shared yet</h3>
                <p className="text-muted-foreground mt-1">
                  You'll see shared progress reports here once they're generated
                </p>
                <Button variant="outline" className="mt-4">
                  <FileIcon className="h-4 w-4 mr-2" />
                  Generate New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
