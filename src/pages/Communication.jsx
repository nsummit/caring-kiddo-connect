
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileIcon } from "lucide-react"; // Changed from File to FileIcon
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Communication = () => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const { toast } = useToast();

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleAttachmentChange = (event) => {
    setAttachments([...attachments, ...event.target.files]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }
    
    // Handle the submission logic here
    console.log('Message:', message);
    console.log('Attachments:', attachments);
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    });
    
    // Reset form
    setMessage('');
    setAttachments([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Communication</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Send Message</CardTitle>
          <CardDescription>
            Send a message to parents or colleagues
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message:</Label>
              <Textarea
                id="message"
                value={message}
                onChange={handleMessageChange}
                placeholder="Enter your message"
                className="min-h-[120px]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments:</Label>
              <div className="flex items-center gap-2">
                <Input 
                  type="file"
                  id="attachments"
                  name="attachments"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={handleAttachmentChange}
                  className="flex-1"
                />
                <Button type="button" variant="outline">
                  <FileIcon className="h-4 w-4 mr-2" />
                  Browse
                </Button>
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Selected files:</p>
                  <ul className="text-sm space-y-1">
                    {Array.from(attachments).map((file, index) => (
                      <li key={index} className="text-muted-foreground">
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit">Send Message</Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Recent Messages Section */}
      <h2 className="text-xl font-semibold mb-3">Recent Messages</h2>
      <div className="space-y-4">
        <MessageItem 
          sender="You"
          recipient="All Parents"
          date="Today at 10:30 AM"
          content="Reminder: We will be closed this Friday for staff training. Please make alternative arrangements for your children."
        />
        
        <MessageItem 
          sender="Jane Thompson (Emma's Mom)"
          recipient="You"
          date="Yesterday at 3:15 PM"
          content="Emma will be absent tomorrow as she has a doctor's appointment. She should be back on Thursday."
        />
        
        <MessageItem 
          sender="You"
          recipient="Staff Members"
          date="Aug 10, 2023"
          content="Please remember to complete your training modules by the end of this week."
        />
      </div>
    </div>
  );
};

// Message Item Component
const MessageItem = ({ sender, recipient, date, content }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-base">{sender} → {recipient}</CardTitle>
            <CardDescription className="text-xs">{date}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{content}</p>
      </CardContent>
      <CardFooter className="pt-0 justify-end gap-2">
        <Button variant="outline" size="sm">Reply</Button>
      </CardFooter>
    </Card>
  );
};

export default Communication;
