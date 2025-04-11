
import { useState } from "react";
import {
  ChevronDown,
  Download,
  Filter,
  Plus,
  Search,
  User,
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

// Mock data for children profiles
const mockChildren = [
  {
    id: 1,
    name: "Emma Wilson",
    age: 4,
    dob: "Jan 15, 2020",
    parent: "Michelle Wilson",
    contactNumber: "07700 900123",
    medicalConditions: ["Mild Asthma"],
    allergies: ["Peanuts"],
    emergencyContacts: ["Michelle Wilson - 07700 900123", "John Wilson - 07700 900456"],
    status: "active",
  },
  {
    id: 2,
    name: "Noah Smith",
    age: 3,
    dob: "Mar 23, 2021",
    parent: "Jessica Smith",
    contactNumber: "07700 900124",
    medicalConditions: [],
    allergies: ["Dairy"],
    emergencyContacts: ["Jessica Smith - 07700 900124", "David Smith - 07700 900457"],
    status: "active",
  },
  {
    id: 3,
    name: "Olivia Davis",
    age: 4,
    dob: "Nov 5, 2020",
    parent: "Sarah Davis",
    contactNumber: "07700 900125",
    medicalConditions: [],
    allergies: [],
    emergencyContacts: ["Sarah Davis - 07700 900125", "Michael Davis - 07700 900458"],
    status: "active",
  },
  {
    id: 4,
    name: "Liam Johnson",
    age: 2,
    dob: "Sep 10, 2022",
    parent: "Emily Johnson",
    contactNumber: "07700 900126",
    medicalConditions: ["Eczema"],
    allergies: [],
    emergencyContacts: ["Emily Johnson - 07700 900126", "Robert Johnson - 07700 900459"],
    status: "active",
  },
  {
    id: 5,
    name: "Sophia Brown",
    age: 3,
    dob: "Jul 20, 2021",
    parent: "Rebecca Brown",
    contactNumber: "07700 900127",
    medicalConditions: [],
    allergies: ["Eggs"],
    emergencyContacts: ["Rebecca Brown - 07700 900127", "Thomas Brown - 07700 900460"],
    status: "leaving",
  },
  {
    id: 6,
    name: "Lucas Taylor",
    age: 4,
    dob: "Feb 28, 2020",
    parent: "Katherine Taylor",
    contactNumber: "07700 900128",
    medicalConditions: [],
    allergies: [],
    emergencyContacts: ["Katherine Taylor - 07700 900128", "James Taylor - 07700 900461"],
    status: "new",
  },
];

export default function Children() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [selectedChild, setSelectedChild] = useState<any | null>(null);
  
  // Filter children based on search term and filters
  const filteredChildren = mockChildren.filter((child) => {
    const matchesSearch = child.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || child.status === statusFilter;
    
    const matchesAge = 
      ageFilter === "all" || 
      (ageFilter === "2-3" && (child.age === 2 || child.age === 3)) ||
      (ageFilter === "4-5" && (child.age === 4 || child.age === 5));
    
    return matchesSearch && matchesStatus && matchesAge;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Children</h1>
          <p className="text-muted-foreground">
            Manage children's profiles and registration details
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-kiddo-blue hover:bg-kiddo-blue-dark">
              <Plus className="mr-2 h-4 w-4" />
              Register New Child
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Register New Child</DialogTitle>
              <DialogDescription>
                Fill in the details below to register a new child.
              </DialogDescription>
            </DialogHeader>
            <ChildRegistrationForm />
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
          
          {/* Children Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChildren.map((child) => (
              <ChildProfileCard 
                key={child.id} 
                child={child} 
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
        </CardContent>
      </Card>
    </div>
  );
}
