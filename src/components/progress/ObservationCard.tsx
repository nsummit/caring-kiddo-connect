
import { Calendar, Eye, Image } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ObservationCardProps {
  child: string;
  title: string;
  date: string;
  category: string;
  description: string;
  hasMedia: boolean;
}

export function ObservationCard({
  child,
  title,
  date,
  category,
  description,
  hasMedia,
}: ObservationCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase().split(" ")[0]) {
      case "social":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "literacy":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "numeracy":
        return "bg-green-100 text-green-800 border-green-300";
      case "physical":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "creative":
        return "bg-pink-100 text-pink-800 border-pink-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-base leading-tight">{title}</h3>
            <p className="text-sm text-muted-foreground">{child}</p>
          </div>
          <Badge className={`${getCategoryColor(category)} border`}>
            {category}
          </Badge>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          {date}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Child:</span> {child}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Date:</span> {date}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Category:</p>
                <Badge className={`${getCategoryColor(category)} border`}>
                  {category}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Observation:</p>
                <p className="text-sm">{description}</p>
              </div>
              
              {hasMedia && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Media:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Next Steps:</p>
                <p className="text-sm text-muted-foreground">
                  Continue to encourage and provide opportunities for development in this area.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {hasMedia && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Image className="h-3 w-3 mr-1" />
            Media Attached
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
