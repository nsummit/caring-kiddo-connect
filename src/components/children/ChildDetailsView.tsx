
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle, Edit2, FileText, Phone, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type ChildDetailsViewProps = {
  child: {
    id: number;
    name: string;
    age: number;
    dob: string;
    parent: string;
    contactNumber: string;
    medicalConditions: string[];
    allergies: string[];
    emergencyContacts: string[];
    status: string;
  };
};

export function ChildDetailsView({ child }: ChildDetailsViewProps) {
  return (
    <div className="pt-4">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-kiddo-blue-light text-kiddo-blue flex items-center justify-center text-2xl font-bold">
            {child.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{child.name}</h2>
            <p className="text-muted-foreground flex items-center gap-1">
              <UserCircle className="h-4 w-4" />
              {child.age} years old (DOB: {child.dob})
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit2 className="h-4 w-4 mr-1" /> Edit Profile
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" /> Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="p-4 border rounded-md mt-2">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Parent/Guardian</h4>
                <p>{child.parent}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Contact Number</h4>
                <p className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {child.contactNumber}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <Badge className={child.status === "active" ? "bg-green-100 text-green-800" : 
                              child.status === "new" ? "bg-blue-100 text-blue-800" : 
                              "bg-orange-100 text-orange-800"}>
                {child.status.charAt(0).toUpperCase() + child.status.slice(1)}
              </Badge>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Registration Date</h4>
              <p>September 1, 2023</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Schedule</h4>
              <p>Monday, Wednesday, Friday (Full Day)</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="medical" className="p-4 border rounded-md mt-2">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Allergies</h4>
              {child.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {child.allergies.map((allergy, i) => (
                    <Badge key={i} variant="outline" className="bg-red-50 text-red-800 border-red-200">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p>No allergies recorded</p>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Medical Conditions</h4>
              {child.medicalConditions.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {child.medicalConditions.map((condition, i) => (
                    <Badge key={i} variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
                      {condition}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p>No medical conditions recorded</p>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Medications</h4>
              <p>None</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Important Notes</h4>
              <div className="rounded-md p-3 bg-yellow-50 border border-yellow-200 flex gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Doctor's note required for any medication administration.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="emergency" className="p-4 border rounded-md mt-2">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Emergency Contacts</h4>
              <ul className="space-y-2 mt-2">
                {child.emergencyContacts.map((contact, i) => (
                  <li key={i} className="flex gap-2 p-2 border rounded-md">
                    <Phone className="h-4 w-4 text-kiddo-blue mt-0.5" />
                    <span>{contact}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Doctor Information</h4>
              <p>Dr. Sarah Matthews</p>
              <p className="text-sm text-muted-foreground">Sunshine Health Practice</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> 07700 900789
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Collection Authorization</h4>
              <p>Only parents and emergency contacts are authorized to collect.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
