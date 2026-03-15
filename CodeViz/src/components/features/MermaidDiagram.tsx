import { useEffect, useMemo, useState } from "react";
import mermaid from "mermaid/dist/mermaid.core.mjs";

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

let mermaidInitialized = false;

export const MermaidDiagram = ({ chart, className }: MermaidDiagramProps) => {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  const chartId = useMemo(() => `mermaid-${Math.random().toString(36).slice(2)}`, [chart]);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      try {
        setIsRendering(true);
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "loose",
            theme: "default",
            flowchart: {
              useMaxWidth: true,
              htmlLabels: true,
            },
          });
          mermaidInitialized = true;
        }

        const result = await mermaid.render(chartId, chart);
        if (!cancelled) {
          setSvg(result.svg);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Failed to render Mermaid diagram.");
          setSvg("");
        }
      } finally {
        if (!cancelled) {
          setIsRendering(false);
        }
      }
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [chart, chartId]);

  if (error) {
    return (
      <div className={className}>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          Mermaid render error: {error}
        </div>
        <pre className="mt-2 overflow-auto rounded-lg border border-border/40 bg-muted/30 p-3 text-xs">
          {chart}
        </pre>
      </div>
    );
  }

  if (isRendering && !svg) {
    return (
      <div className={className}>
        <div className="rounded-lg border border-border/40 bg-muted/20 p-3 text-sm text-muted-foreground">
          Rendering Mermaid diagram...
        </div>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className={className}>
        <div className="rounded-lg border border-border/40 bg-muted/20 p-3 text-sm text-muted-foreground">
          Diagram is unavailable right now. Showing Mermaid source instead.
        </div>
        <pre className="mt-2 overflow-auto rounded-lg border border-border/40 bg-muted/30 p-3 text-xs">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
