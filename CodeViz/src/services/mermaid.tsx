"use client";
import React, { useEffect } from "react";
import mermaid from "mermaid";

interface MermaidRendererProps {
  chart: any;
}

export default function MermaidRenderer({ chart }: MermaidRendererProps) {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: "default" });
    mermaid.contentLoaded();
  }, [chart]);

  return (
    <div className="p-3 bg-white rounded-md shadow overflow-x-auto">
      <div className="mermaid">{chart.diagram}</div>
    </div>
  );
}
