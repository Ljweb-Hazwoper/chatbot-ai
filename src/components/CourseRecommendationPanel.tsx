import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, ShoppingCart, Flame, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Course {
  courseId: string;
  courseName: string;
  duration: string;
  price: string;
  description: string;
  url: string;
  level?: string;
  tag?: string;
}

interface CourseRecommendationPanelProps {
  courses?: Course[];
}

const defaultCourses: Course[] = [
  {
    courseId: "default-1",
    courseName: "OSHA 40-Hour Hazwoper",
    duration: "40 Hours",
    price: "$299",
    tag: "Popular",
    description: "Comprehensive hazardous waste operations training",
    url: "#",
  },
  {
    courseId: "default-2",
    courseName: "OSHA 24-Hour Hazwoper",
    duration: "24 Hours",
    price: "$199",
    tag: "Refresher",
    description: "Essential hazmat training for workers",
    url: "#",
  },
  {
    courseId: "default-3",
    courseName: "8-Hour Annual Refresher",
    duration: "8 Hours",
    price: "$99",
    tag: "Required",
    description: "Annual refresher for certified pros",
    url: "#",
  },
  {
    courseId: "default-4",
    courseName: "Confined Space Entry",
    duration: "16 Hours",
    price: "$179",
    description: "Safety training for confined spaces",
    url: "#",
  },
  {
    courseId: "default-5",
    courseName: "DOT Hazmat Training",
    duration: "12 Hours",
    price: "$149",
    description: "Department of Transportation compliance",
    url: "#",
  },
];

const CourseRecommendationPanel = ({ courses }: CourseRecommendationPanelProps) => {
  const displayCourses = courses && courses.length > 0 ? courses : defaultCourses;
  const isAiRecommended = courses && courses.length > 0;
  return (
    <div className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-l border-border">
      <div className="p-4 border-b border-border flex-shrink-0 bg-card">
        <div className="flex items-center gap-2">
          {isAiRecommended ? (
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          ) : (
            <Flame className="h-5 w-5 text-primary" />
          )}
          <h3 className="font-bold text-foreground text-base">Recommended Courses</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {isAiRecommended ? "AI-powered recommendations for you" : "Based on Your Questions"}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {displayCourses.map((course, index) => (
            <Card key={index} className="bg-card hover:bg-muted/50 transition-all border-border hover:border-primary/30 focus-within:ring-0 shadow-sm">
              <CardContent className="p-4 space-y-3" tabIndex={-1}>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-foreground leading-tight">{course.courseName}</h4>
                    {(course.tag || course.level) && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary text-xs whitespace-nowrap border border-primary/30 px-2 py-0.5">
                        {course.tag || course.level}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{course.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xs font-bold text-primary">{course.price}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full border-primary/30 text-foreground hover:bg-primary/10 hover:text-primary font-medium gap-2 rounded-lg h-9 text-xs focus:ring-0 focus:outline-none"
                  onClick={() => {
                    if (course.url && course.url !== '#') {
                      window.open(course.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CourseRecommendationPanel;
