import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { 
  Code, 
  Brain, 
  Sparkles, 
  Menu,
  X,
  Settings,
  User,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Brain className="h-8 w-8 text-secondary animate-pulse-glow" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-accent animate-float" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gradient">CodeViz AI</h1>
              <span className="text-xs text-muted-foreground">Smart Code Explanation</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 ">
  <Button variant="ghost" size="sm" className="gap-2 text-lg px-6 py-3">
    <Code className="h-5 w-5" />
    Editor
  </Button>
  <Button variant="ghost" size="sm" className="gap-2 text-lg px-6 py-3">
    <Sparkles className="h-5 w-5" />
    Visualize
  </Button>
  <Button variant="ghost" size="sm" className="gap-2 text-lg px-6 py-3">
    <Brain className="h-5 w-5" />
    Explain
  </Button>
</nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-accent rounded-full animate-pulse" />
          </Button>
          
          <ModeToggle />
          
          <Button variant="secondary" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
    <div className={cn(
  "md:hidden border-t border-border/20 bg-background/95 backdrop-blur-xl",
  isMenuOpen ? "block animate-slide-up" : "hidden"
)}>
  <nav className="container p-4 space-y-4">
    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-lg px-6 py-3">
      <Code className="h-5 w-5" />
      Editor
    </Button>
    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-lg px-6 py-3">
      <Sparkles className="h-5 w-5" />
      Visualize
    </Button>
    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-lg px-6 py-3">
      <Brain className="h-5 w-5" />
      Explain
    </Button>
    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-lg px-6 py-3">
      <Settings className="h-5 w-5" />
      Settings
    </Button>
  </nav>
</div>
    </header>
  );
};