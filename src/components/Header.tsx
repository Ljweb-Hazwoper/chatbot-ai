import ThemeToggle from "./ThemeToggle";
// import hazwoperLogo from "@/assets/hazwoper-logo.png";
const hazwoperLogo = 'https://media.hazwoper-osha.com/wp-content/uploads/2023/02/1676446749/logo-final.webp';
const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b-2 border-border shadow-sm">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-xl font-bold text-foreground">SafetyPartner</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>powered by</span>
            <img src={hazwoperLogo} alt="Hazwoper OSHA" className="h-6 object-contain" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
