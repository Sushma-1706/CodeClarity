import heroBackground from "@/assets/hero-bg.jpg";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="relative isolate overflow-hidden min-h-[calc(100vh-4rem)]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/90" />

        <section className="relative z-10 container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
          <div className="w-full max-w-5xl text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gradient mx-auto max-w-4xl leading-tight">
              AI-Powered Code Visualization
            </h1>

            <div className="flex justify-center">
              <Button asChild size="xl" variant="glow" className="gap-3">
                <Link to="/editor?tab=editor">
                  <Code2 className="h-5 w-5" />
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            <p className="text-muted-foreground text-lg md:text-xl max-w-5xl mx-auto font-medium leading-relaxed">
              Transform complex code into interactive visualizations and intelligent explanations.<br />
              CodeViz AI accelerates your understanding, refactoring, analysis, and debugging - all powered by modern machine learning.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
