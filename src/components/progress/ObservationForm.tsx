
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Image, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ObservationForm() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Observation recorded successfully!");
    // Reset form or close dialog
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="child">Select Child</Label>
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Select child" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emma">Emma Wilson</SelectItem>
              <SelectItem value="noah">Noah Smith</SelectItem>
              <SelectItem value="olivia">Olivia Davis</SelectItem>
              <SelectItem value="liam">Liam Johnson</SelectItem>
              <SelectItem value="sophia">Sophia Brown</SelectItem>
              <SelectItem value="lucas">Lucas Taylor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date of Observation</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Observation Title</Label>
          <Input id="title" placeholder="Enter a title for this observation" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="social">Social Skills</SelectItem>
              <SelectItem value="literacy">Literacy</SelectItem>
              <SelectItem value="numeracy">Numeracy</SelectItem>
              <SelectItem value="physical">Physical Development</SelectItem>
              <SelectItem value="creative">Creative Expression</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Development Area</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fine-motor">Fine Motor</SelectItem>
              <SelectItem value="gross-motor">Gross Motor</SelectItem>
              <SelectItem value="language">Language</SelectItem>
              <SelectItem value="cognitive">Cognitive</SelectItem>
              <SelectItem value="social-emotional">Social-Emotional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Observation Details</Label>
          <Textarea
            id="description"
            placeholder="Describe what you observed..."
            className="min-h-[120px]"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Attach Media (Optional)</Label>
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
            <Image className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-center text-muted-foreground mb-2">
              Drag and drop images or click to upload
            </p>
            <Button type="button" variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: JPEG, PNG, GIF (Max: 5 MB)
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="next-steps">Next Steps / Planning</Label>
        <Textarea
          id="next-steps"
          placeholder="Based on this observation, what are the next steps for this child's development?"
          className="min-h-[80px]"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-kiddo-blue hover:bg-kiddo-blue-dark">
          Save Observation
        </Button>
      </div>
    </form>
  );
}
