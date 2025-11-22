import { useLazyGetUserQuery } from "@/services/user";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ChatInterface from "@/components/ChatInterface";
import CourseRecommendationPanel from "@/components/CourseRecommendationPanel";
import WhySection from "@/components/WhySection";

interface Course {
  title: string;
  description: string;
  duration: string;
  price: string;
  level: string;
}
const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [getUsers, { isLoading, data: users }] = useLazyGetUserQuery();

  useEffect(() => {
    void getUsers();
  }, []);

  const changeLanguage: (lng: string) => Promise<void> = async (
    lng: string
  ) => {
    await i18n.changeLanguage(lng);
  };
const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  return (
    <main className="flex flex-col overflow-y-auto bg-slate-900 p-6">
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header />
      
      <main className="flex-1 pt-14 pb-28 flex overflow-hidden">
        {/* Left side - Main content focused on search */}
        <div className="flex-1 flex flex-col px-8 py-6 overflow-hidden">
          <HeroSection />
          <div className="flex-1 flex items-start justify-center overflow-hidden mt-6">
            <ChatInterface onCoursesUpdate={setRecommendedCourses} />
          </div>
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
