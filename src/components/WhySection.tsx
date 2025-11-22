import { GraduationCap, FileCheck, TrendingUp } from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Training Assistance",
    description: "Prepare for your training courses with mock exams and personalised guidance.",
  },
  {
    icon: FileCheck,
    title: "Licensing Help",
    description: "Step-by-step support for license applications.",
  },
  {
    icon: TrendingUp,
    title: "Career Development",
    description: "Ace your job interviews with tailored preparation tips.",
  },
];

const WhySection = () => {
  return (
    <section className="fixed bottom-0 left-0 right-0 py-3 px-6 border-t-2 border-border bg-card/95 backdrop-blur-md z-40 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-8 max-w-6xl mx-auto">
          <h2 className="text-lg font-bold text-foreground flex-shrink-0">
            Why HazwoperAI?
          </h2>
          
          <div className="flex items-center gap-6 flex-1">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 flex-1 border-2 border-border bg-muted/30 rounded-lg p-3 hover:bg-muted/60 transition-all shadow-sm"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border-2 border-primary/30 flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
