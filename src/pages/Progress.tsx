
import { useState } from "react";
import { Calendar, File, Filter, Image, Plus, Search, ArrowRight, Loader2 } from "lucide-react";
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
import { progressApi, childrenApi } from "@/services/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";

export default function Progress() {
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch all observations
  const { 
    data: observations = [], 
    isLoading: observationsLoading, 
    isError: observationsError,
    refetch: refetchObservations
  } = useQuery({
    queryKey: ['observations'],
    queryFn: progressApi.getAllObservations,
  });

  // Fetch all children for dropdown
  const { 
    data: children = [], 
    isLoading: childrenLoading 
  } = useQuery({
    queryKey: ['children'],
    queryFn: childrenApi.getAllChildren,
  });

  // Create observation mutation
  const createObservationMutation = useMutation({
    mutationFn: progressApi.createObservation,
    onSuccess: () => {
      refetchObservations();
      setIsDialogOpen(false);
    }
  });

  // Filter observations based on selected child and category
  const filteredObservations = observations.filter((observation: any) => {
    const matchesChild = selectedChild === "all" || observation.child._id === selectedChild;
    const matchesCategory = selectedCategory === "all" || observation.category === selectedCategory;
    return matchesChild && matchesCategory;
  });

  // Handle observation submission
  const handleObservationSubmit = (data: any) => {
    createObservationMutation.mutate(data);
  };

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <ObservationForm onSubmit={handleObservationSubmit} />
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
                    {children.map((child: any) => (
                      <SelectItem key={child._id} value={child._id}>
                        {child.firstName} {child.lastName}
                      </SelectItem>
                    ))}
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
              
              {/* Loading State */}
              {(observationsLoading || childrenLoading) && (
                <div className="flex flex-col items-center justify-center p-12">
                  <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                  <span className="mt-4 text-muted-foreground">Loading observations...</span>
                </div>
              )}
              
              {/* Error State */}
              {observationsError && (
                <div className="text-center p-12">
                  <p className="text-destructive">Failed to load observations</p>
                  <Button variant="outline" onClick={() => refetchObservations()} className="mt-4">
                    Retry
                  </Button>
                </div>
              )}
              
              {/* Observations Grid */}
              {!observationsLoading && !observationsError && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredObservations.map((observation: any) => (
                    <ObservationCard 
                      key={observation._id}
                      child={`${observation.child.firstName} ${observation.child.lastName}`}
                      title={observation.title}
                      date={format(new Date(observation.date), "MMMM d, yyyy")}
                      category={observation.category}
                      description={observation.details}
                      hasMedia={observation.mediaUrls && observation.mediaUrls.length > 0}
                    />
                  ))}
                  
                  {filteredObservations.length === 0 && !observationsLoading && (
                    <div className="col-span-3 text-center p-12">
                      <File className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No observations found</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Try adjusting your filters or create a new observation.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {filteredObservations.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" className="gap-1">
                    Load More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="milestones" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Milestone Tracker</CardTitle>
                <Select defaultValue={children[0]?._id || ''}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select child" />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map((child: any) => (
                      <SelectItem key={child._id} value={child._id}>
                        {child.firstName} {child.lastName}
                      </SelectItem>
                    ))}
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
