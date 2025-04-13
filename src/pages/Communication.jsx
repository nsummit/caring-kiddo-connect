
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const Communication = () => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleAttachmentChange = (event) => {
    setAttachments([...attachments, ...event.target.files]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the submission logic here
    console.log('Message:', message);
    console.log('Attachments:', attachments);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Communication</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="message">Message:</Label>
          <Textarea
            id="message"
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter your message"
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="attachments">Attachments:</Label>
          <input 
            type="file"
            id="attachments"
            name="attachments"
            accept="image/*,application/pdf"
            multiple
            onChange={handleAttachmentChange}
            className="w-full"
          />
        </div>
        <Button type="submit">Send Message</Button>
      </form>
    </div>
  );
};

export default Communication;
