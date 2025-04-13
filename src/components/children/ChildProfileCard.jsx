
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChildDetailsView } from "./ChildDetailsView";

export function ChildProfileCard({ child, onClick }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "leaving":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getInitials = (name) => {
    return name.split(" ").map((n) => n[0]).join("");
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-kiddo-blue-light text-kiddo-blue flex items-center justify-center font-semibold">
              {getInitials(child.name)}
            </div>
            <div>
              <CardTitle className="text-lg">{child.name}</CardTitle>
              <CardDescription>Age: {child.age} years</CardDescription>
            </div>
          </div>
          <Badge className={`${getStatusColor(child.status)} border`}>
            {child.status.charAt(0).toUpperCase() + child.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Parent:</span> {child.parent}
          </p>
          <p className="text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {child.contactNumber}
          </p>
          
          {child.allergies.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-muted-foreground">Allergies:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {child.allergies.map((allergy, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-red-50 text-red-800 text-xs rounded-full"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Child Profile</DialogTitle>
            </DialogHeader>
            <ChildDetailsView child={child} />
          </DialogContent>
        </Dialog>
        <Button variant="outline" size="sm" className="text-xs">
          <Edit2 className="h-3 w-3 mr-1" /> Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
