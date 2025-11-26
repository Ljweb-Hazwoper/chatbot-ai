import { useState } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import CourseRecommendationPanel from "@/components/CourseRecommendationPanel";
import WhySection from "@/components/WhySection";

interface Course {
  courseId: string;
  courseName: string;
  description: string;
  duration: string;
  price: string;
  url: string;
  level?: string;
  tag?: string;
}

const Home: React.FC = () => {
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  return (
    <main className="flex flex-col overflow-y-auto bg-slate-900 p-6">
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 pt-14 pb-28 flex overflow-hidden">
          {/* Left side - Main content focused on search */}
          <div className="flex-1 flex items-start justify-center overflow-hidden mt-6">
            <ChatInterface onCoursesUpdate={setRecommendedCourses} />
          </div>

          {/* Right side - Fixed course panel */}
          <div className="w-96 flex-shrink-0 border-l border-primary/10">
            <CourseRecommendationPanel courses={recommendedCourses} />
          </div>
        </main>

        {/* Fixed bottom panel */}
        <WhySection />
      </div>
    </main>
  );
};

export default Home;
