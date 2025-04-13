import { useState, useEffect } from "react";
import {
  ChevronDown,
  Download,
  Filter,
  Plus,
  Search,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChildRegistrationForm } from "@/components/children/ChildRegistrationForm";
import { ChildProfileCard } from "@/components/children/ChildProfileCard";
import { childrenApi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export default function Children() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [selectedChild, setSelectedChild] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: children = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['children'],
    queryFn: childrenApi.getAllChildren,
  });
  
  // Calculate age from DOB
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  
  // Filter children based on search term and filters
  const filteredChildren = children.filter((child: any) => {
    const childAge = calculateAge(child.dob);
    
    const matchesSearch = child.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          child.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || child.status === statusFilter;
    
    const matchesAge = 
      ageFilter === "all" || 
      (ageFilter === "2-3" && (childAge === 2 || childAge === 3)) ||
      (ageFilter === "4-5" && (childAge === 4 || childAge === 5));
    
    return matchesSearch && matchesStatus && matchesAge;
  });

  const handleChildRegistration = async (childData: any) => {
    try {
      await childrenApi.createChild(childData);
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      // Error handling is done in the API service
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Children</h1>
          <p className="text-muted-foreground">
            Manage children's profiles and registration details
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-kiddo-blue hover:bg-kiddo-blue-dark">
              <Plus className="mr-2 h-4 w-4" />
              Register New Child
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[calc(100vh-10rem)] w-5/6 overflow-y-scroll">
            <DialogHeader>
              <DialogTitle>Register New Child</DialogTitle>
              <DialogDescription>
                Fill in the details below to register a new child.
              </DialogDescription>
            </DialogHeader>
            <ChildRegistrationForm onSubmit={handleChildRegistration} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search children..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="leaving">Leaving</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="2-3">2-3 years</SelectItem>
                <SelectItem value="4-5">4-5 years</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              <span className="ml-2 text-lg text-muted-foreground">Loading children...</span>
            </div>
          )}
          
          {/* Error state */}
          {isError && (
            <div className="text-center p-12">
              <p className="text-destructive text-lg">Failed to load children's data</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-4">
                Retry
              </Button>
            </div>
          )}
          
          {/* Children Grid */}
          {!isLoading && !isError && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredChildren.map((child: any) => (
                <ChildProfileCard 
                  key={child._id} 
                  child={{
                    id: child._id,
                    name: `${child.firstName} ${child.lastName}`,
                    age: calculateAge(child.dob),
                    dob: new Date(child.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                    parent: `${child.parentDetails.firstName} ${child.parentDetails.lastName}`,
                    contactNumber: child.parentDetails.contactNumber,
                    medicalConditions: child.medicalDetails.conditions || [],
                    allergies: child.medicalDetails.allergies || [],
                    emergencyContacts: child.emergencyContacts.map((c: any) => 
                      `${c.name} - ${c.contactNumber}`
                    ),
                    status: child.status,
                  }}
                  onClick={() => setSelectedChild(child)}
                />
              ))}
              
              {filteredChildren.length === 0 && (
                <div className="col-span-3 text-center p-12">
                  <User className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No children found</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}