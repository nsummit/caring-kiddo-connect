
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function ChildRegistrationForm({ onSubmit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState<Date>();
  const [gender, setGender] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState("");
  const [emergencyContacts, setEmergencyContacts] = useState<{ name: string; contactNumber: string }[]>([]);
  const [newContactName, setNewContactName] = useState("");
  const [newContactNumber, setNewContactNumber] = useState("");
  const [parentFirstName, setParentFirstName] = useState("");
  const [parentLastName, setParentLastName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setMedicalConditions([...medicalConditions, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const handleAddEmergencyContact = () => {
    if (newContactName.trim() && newContactNumber.trim()) {
      setEmergencyContacts([
        ...emergencyContacts,
        { name: newContactName.trim(), contactNumber: newContactNumber.trim() }
      ]);
      setNewContactName("");
      setNewContactNumber("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const childData = {
        firstName,
        lastName,
        dob,
        gender,
        status: "new",
        parentDetails: {
          firstName: parentFirstName,
          lastName: parentLastName,
          email: parentEmail,
          contactNumber: parentPhone,
          address
        },
        medicalDetails: {
          allergies,
          conditions: medicalConditions,
          notes: ""
        },
        emergencyContacts
      };
      
      await onSubmit(childData);
      
      // Reset form
      setFirstName("");
      setLastName("");
      setDob(undefined);
      setGender("");
      setAllergies([]);
      setMedicalConditions([]);
      setEmergencyContacts([]);
      setParentFirstName("");
      setParentLastName("");
      setParentEmail("");
      setParentPhone("");
      setAddress("");
    } catch (error) {
      // Error is handled in the parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Child's Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              placeholder="Enter first name" 
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              placeholder="Enter last name" 
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dob && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dob ? format(dob, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dob}
                  onSelect={setDob}
                  initialFocus
                  disabled={date => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Parent/Guardian Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="parentFirstName">First Name</Label>
            <Input 
              id="parentFirstName" 
              placeholder="Enter parent's first name" 
              value={parentFirstName}
              onChange={e => setParentFirstName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="parentLastName">Last Name</Label>
            <Input 
              id="parentLastName" 
              placeholder="Enter parent's last name" 
              value={parentLastName}
              onChange={e => setParentLastName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="parentEmail">Email</Label>
            <Input 
              id="parentEmail" 
              type="email" 
              placeholder="Enter parent's email" 
              value={parentEmail}
              onChange={e => setParentEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="parentPhone">Phone Number</Label>
            <Input 
              id="parentPhone" 
              placeholder="Enter parent's phone number" 
              value={parentPhone}
              onChange={e => setParentPhone(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea 
              id="address" 
              placeholder="Enter home address" 
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Medical Information</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Allergies</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {allergies.map((allergy, i) => (
                <div 
                  key={i} 
                  className="bg-muted text-foreground px-2 py-1 rounded-md flex items-center text-sm"
                >
                  {allergy}
                  <button 
                    type="button" 
                    onClick={() => setAllergies(allergies.filter((_, idx) => idx !== i))}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Add allergy" 
                value={newAllergy}
                onChange={e => setNewAllergy(e.target.value)}
                className="flex-1"
              />
              <Button type="button" size="sm" onClick={handleAddAllergy}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Medical Conditions</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {medicalConditions.map((condition, i) => (
                <div 
                  key={i} 
                  className="bg-muted text-foreground px-2 py-1 rounded-md flex items-center text-sm"
                >
                  {condition}
                  <button 
                    type="button" 
                    onClick={() => setMedicalConditions(medicalConditions.filter((_, idx) => idx !== i))}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Add medical condition" 
                value={newCondition}
                onChange={e => setNewCondition(e.target.value)}
                className="flex-1"
              />
              <Button type="button" size="sm" onClick={handleAddCondition}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Emergency Contacts</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="space-y-4">
              {emergencyContacts.map((contact, i) => (
                <div 
                  key={i} 
                  className="bg-muted p-3 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.contactNumber}</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setEmergencyContacts(emergencyContacts.filter((_, idx) => idx !== i))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Contact name" 
                value={newContactName}
                onChange={e => setNewContactName(e.target.value)}
              />
              <Input 
                placeholder="Contact number" 
                value={newContactNumber}
                onChange={e => setNewContactNumber(e.target.value)}
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mt-2"
              onClick={handleAddEmergencyContact}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Emergency Contact
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">Cancel</Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-kiddo-blue hover:bg-kiddo-blue-dark"
        >
          {isLoading ? "Registering..." : "Register Child"}
        </Button>
      </div>
    </form>
  );
}
