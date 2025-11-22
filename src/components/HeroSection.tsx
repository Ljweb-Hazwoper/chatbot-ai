const HeroSection = () => {
  return (
    <section className="relative py-4 text-center overflow-hidden flex-shrink-0">
      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-6 left-32 w-3 h-3 bg-primary rounded-full animate-pulse-glow shadow-lg shadow-primary/50" />
        <div className="absolute top-8 right-40 w-2.5 h-2.5 bg-primary/70 rounded-full animate-pulse-glow shadow-lg shadow-primary/40" style={{ animationDelay: "1s" }} />
        <div className="absolute top-10 left-48 w-3 h-3 bg-primary/50 rounded-full animate-pulse-glow shadow-lg shadow-primary/30" style={{ animationDelay: "2s" }} />
        <div className="absolute top-7 right-56 w-2 h-2 bg-primary/90 rounded-full animate-pulse-glow shadow-lg shadow-primary/60" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-9 right-44 w-2.5 h-2.5 bg-primary/60 rounded-full animate-pulse-glow shadow-lg shadow-primary/40" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-5 left-60 w-2 h-2 bg-primary/80 rounded-full animate-pulse-glow shadow-lg shadow-primary/50" style={{ animationDelay: "2.5s" }} />
      </div>

      <div className="relative z-10 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 leading-tight">
          Your Personal Guide to <span className="text-primary drop-shadow-lg">Industrial Safety</span>
          <br />
          <span className="text-primary drop-shadow-lg">Training & Compliance</span>
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          helps you to stay compliant, trained and informed
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
