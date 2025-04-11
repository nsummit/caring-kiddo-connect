
import { useState } from "react";
import { Calendar, File, Filter, Image, Plus, Search, ArrowRight } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ObservationForm } from "@/components/progress/ObservationForm";
import { ObservationCard } from "@/components/progress/ObservationCard";
import { MilestoneTracker } from "@/components/progress/MilestoneTracker";

export default function Progress() {
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Progress Tracking</h1>
          <p className="text-muted-foreground">
            Record observations, milestones, and generate reports
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-kiddo-blue hover:bg-kiddo-blue-dark">
                <Plus className="mr-2 h-4 w-4" />
                New Observation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Record New Observation</DialogTitle>
              </DialogHeader>
              <ObservationForm />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <File className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Generate Progress Report</DialogTitle>
              </DialogHeader>
              {/* Report generation form would go here */}
              <div className="py-4">
                <p className="text-center text-muted-foreground">
                  Report generation feature coming soon
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="observations">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="observations">Observations</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="observations" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search observations..." className="pl-8" />
                </div>
                
                <Select value={selectedChild} onValueChange={setSelectedChild}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select child" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Children</SelectItem>
                    <SelectItem value="emma">Emma Wilson</SelectItem>
                    <SelectItem value="noah">Noah Smith</SelectItem>
                    <SelectItem value="olivia">Olivia Davis</SelectItem>
                    <SelectItem value="liam">Liam Johnson</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="social">Social Skills</SelectItem>
                    <SelectItem value="literacy">Literacy</SelectItem>
                    <SelectItem value="numeracy">Numeracy</SelectItem>
                    <SelectItem value="physical">Physical Development</SelectItem>
                    <SelectItem value="creative">Creative Expression</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ObservationCard 
                  child="Emma Wilson"
                  title="Block Tower Building"
                  date="April 10, 2025"
                  category="Physical Development"
                  description="Emma was able to stack 10 blocks without them falling. She showed great concentration and fine motor skills."
                  hasMedia={true}
                />
                
                <ObservationCard 
                  child="Noah Smith"
                  title="Group Sharing"
                  date="April 9, 2025"
                  category="Social Skills"
                  description="Noah took turns and shared toys with his friends during playtime without prompting."
                  hasMedia={false}
                />
                
                <ObservationCard 
                  child="Olivia Davis"
                  title="Number Recognition"
                  date="April 8, 2025"
                  category="Numeracy"
                  description="Olivia correctly identified numbers 1-20 on the number chart and could count them in sequence."
                  hasMedia={true}
                />
                
                <ObservationCard 
                  child="Liam Johnson"
                  title="Alphabet Recognition"
                  date="April 7, 2025"
                  category="Literacy"
                  description="Liam recognized all uppercase letters and was able to match them with their lowercase pairs."
                  hasMedia={false}
                />
                
                <ObservationCard 
                  child="Sophia Brown"
                  title="Art Project"
                  date="April 6, 2025"
                  category="Creative Expression"
                  description="Sophia created a detailed painting of her family, showing good color awareness and creativity."
                  hasMedia={true}
                />
                
                <ObservationCard 
                  child="Lucas Taylor"
                  title="Story Comprehension"
                  date="April 5, 2025"
                  category="Literacy"
                  description="Lucas was able to recall key details from the story and answer questions about the characters."
                  hasMedia={false}
                />
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button variant="outline" className="gap-1">
                  Load More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="milestones" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Milestone Tracker</CardTitle>
                <Select defaultValue="emma">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select child" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emma">Emma Wilson</SelectItem>
                    <SelectItem value="noah">Noah Smith</SelectItem>
                    <SelectItem value="olivia">Olivia Davis</SelectItem>
                    <SelectItem value="liam">Liam Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <MilestoneTracker />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
