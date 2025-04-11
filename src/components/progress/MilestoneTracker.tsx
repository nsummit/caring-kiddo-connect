
import { Check, Calendar } from "lucide-react";

// Mock data for milestones
const milestoneCategories = [
  {
    name: "Social and Emotional",
    milestones: [
      { id: 1, description: "Takes turns and shares with other children", achieved: true, date: "March 15, 2025" },
      { id: 2, description: "Expresses a wide range of emotions", achieved: true, date: "February 10, 2025" },
      { id: 3, description: "Follows simple rules in games", achieved: true, date: "January 5, 2025" },
      { id: 4, description: "Resolves conflicts with peers independently", achieved: false },
      { id: 5, description: "Shows empathy towards others who are upset", achieved: false },
    ],
  },
  {
    name: "Language and Communication",
    milestones: [
      { id: 6, description: "Uses complete sentences of 4-5 words", achieved: true, date: "March 20, 2025" },
      { id: 7, description: "Follows 2-3 step instructions", achieved: true, date: "February 28, 2025" },
      { id: 8, description: "Tells simple stories about experiences", achieved: true, date: "January 15, 2025" },
      { id: 9, description: "Asks meaningful questions", achieved: false },
      { id: 10, description: "Recognizes some written words", achieved: false },
    ],
  },
  {
    name: "Cognitive Development",
    milestones: [
      { id: 11, description: "Counts to 10 and beyond", achieved: true, date: "March 10, 2025" },
      { id: 12, description: "Recognizes and names basic shapes", achieved: true, date: "February 15, 2025" },
      { id: 13, description: "Sorts objects by color, shape, or size", achieved: false },
      { id: 14, description: "Shows understanding of time concepts", achieved: false },
      { id: 15, description: "Completes simple puzzles (5-10 pieces)", achieved: true, date: "January 20, 2025" },
    ],
  },
  {
    name: "Physical Development",
    milestones: [
      { id: 16, description: "Catches a ball with both hands", achieved: true, date: "March 5, 2025" },
      { id: 17, description: "Hops on one foot", achieved: true, date: "February 1, 2025" },
      { id: 18, description: "Uses scissors to cut along a line", achieved: false },
      { id: 19, description: "Draws a person with body parts", achieved: true, date: "January 25, 2025" },
      { id: 20, description: "Buttons and unbuttons clothing", achieved: false },
    ],
  },
];

export function MilestoneTracker() {
  // Calculate overall progress
  const totalMilestones = milestoneCategories.reduce(
    (total, category) => total + category.milestones.length, 
    0
  );
  
  const achievedMilestones = milestoneCategories.reduce(
    (total, category) => 
      total + category.milestones.filter(m => m.achieved).length,
    0
  );
  
  const progressPercentage = Math.round((achievedMilestones / totalMilestones) * 100);
  
  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h3 className="font-medium">Overall Progress</h3>
          <span className="text-lg font-bold">
            {achievedMilestones}/{totalMilestones} Milestones ({progressPercentage}%)
          </span>
        </div>
        <div className="w-full h-3 bg-muted-foreground/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-kiddo-blue rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-8">
        {milestoneCategories.map((category) => {
          const categoryProgress = Math.round(
            (category.milestones.filter(m => m.achieved).length / category.milestones.length) * 100
          );
          
          return (
            <div key={category.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{category.name}</h3>
                <span className="text-sm font-medium">{categoryProgress}% Complete</span>
              </div>
              <div className="w-full h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-kiddo-blue rounded-full"
                  style={{ width: `${categoryProgress}%` }}
                ></div>
              </div>
              
              <div className="space-y-2 pl-2">
                {category.milestones.map(milestone => (
                  <div 
                    key={milestone.id} 
                    className={`flex items-center p-2 rounded-md ${
                      milestone.achieved ? 'bg-green-50' : 'bg-muted/50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      milestone.achieved 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-muted-foreground/20 text-muted-foreground'
                    }`}>
                      {milestone.achieved && <Check className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${milestone.achieved ? 'font-medium' : ''}`}>
                        {milestone.description}
                      </p>
                      {milestone.achieved && milestone.date && (
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          Achieved on {milestone.date}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
