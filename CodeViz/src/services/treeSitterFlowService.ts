type TreeSitterModule = typeof import("web-tree-sitter");

export interface FlowNode {
  id: string;
  label: string;
  type: "function" | "condition" | "loop" | "return" | "variable" | "statement";
  metadata?: {
    description?: string;
    sourceType?: string;
  };
}

export interface FlowConnection {
  from: string;
  to: string;
  label?: string;
}

export interface FlowchartResult {
  type: "flowchart";
  data: {
    nodes: FlowNode[];
    connections: FlowConnection[];
    parser: "tree-sitter" | "fallback";
  };
}

const LANGUAGE_WASM_URLS: Record<string, string> = {
  javascript: "https://unpkg.com/tree-sitter-javascript@latest/tree-sitter-javascript.wasm",
  python: "https://unpkg.com/tree-sitter-python@latest/tree-sitter-python.wasm",
  java: "https://unpkg.com/tree-sitter-java@latest/tree-sitter-java.wasm",
  cpp: "https://unpkg.com/tree-sitter-cpp@latest/tree-sitter-cpp.wasm",
  c: "https://unpkg.com/tree-sitter-c@latest/tree-sitter-c.wasm",
};

const SUPPORTED_NODE_TYPES = new Set([
  "function_declaration",
  "function_definition",
  "method_declaration",
  "if_statement",
  "for_statement",
  "for_in_statement",
  "enhanced_for_statement",
  "while_statement",
  "do_statement",
  "return_statement",
  "lexical_declaration",
  "variable_declaration",
  "local_variable_declaration",
  "assignment_expression",
  "expression_statement",
  "call_expression",
]);

class TreeSitterFlowService {
  private initialized = false;
  private parser: any = null;
  private languageCache = new Map<string, any>();
  private treeSitterModule: TreeSitterModule | null = null;

  public async buildFlowchart(code: string, language: string): Promise<FlowchartResult> {
    if (!code.trim()) {
      return this.buildFallbackFlow(code);
    }

    try {
      await this.withTimeout(this.ensureLanguage(language), 5000);
      if (!this.parser) {
        return this.buildFallbackFlow(code);
      }

      const tree = this.parser.parse(code);
      if (!tree) {
        return this.buildFallbackFlow(code);
      }

      const nodes = this.extractFlowNodes(tree.rootNode, code);
      if (nodes.length === 0) {
        return this.buildFallbackFlow(code);
      }

      const withStartEnd = this.addStartEnd(nodes);
      const connections = this.buildLinearConnections(withStartEnd);

      return {
        type: "flowchart",
        data: {
          nodes: withStartEnd,
          connections,
          parser: "tree-sitter",
        },
      };
    } catch (error) {
      console.warn("Tree-sitter parsing failed, using fallback flowchart:", error);
      return this.buildFallbackFlow(code);
    }
  }

  public buildMermaidMarkup(result: FlowchartResult, activeStep: number): string {
    const { nodes, connections } = result.data;
    const stepIndex = Math.max(0, Math.min(nodes.length - 1, activeStep - 1));

    const idMap = new Map<string, string>();
    nodes.forEach((node, index) => {
      idMap.set(node.id, `N${index}`);
    });

    const lines: string[] = ["flowchart TD"];

    nodes.forEach((node) => {
      const nodeId = idMap.get(node.id) || node.id;
      const safeLabel = this.escapeMermaidLabel(node.label);
      const shape = this.nodeShape(node.type, safeLabel);
      lines.push(`  ${nodeId}${shape}`);
      lines.push(`  class ${nodeId} ${this.nodeClass(node.type)}`);
    });

    connections.forEach((connection) => {
      const from = idMap.get(connection.from);
      const to = idMap.get(connection.to);
      if (!from || !to) return;

      const linkLabel = connection.label ? `|${this.escapeMermaidLabel(connection.label)}|` : "";
      lines.push(`  ${from} -->${linkLabel} ${to}`);
    });

    const activeNode = nodes[stepIndex];
    if (activeNode) {
      const activeNodeId = idMap.get(activeNode.id);
      if (activeNodeId) {
        lines.push(`  class ${activeNodeId} activeStep`);
      }
    }

    lines.push("  classDef fn fill:#eef2ff,stroke:#4f46e5,stroke-width:1.5px,color:#111827");
    lines.push("  classDef cond fill:#fff7ed,stroke:#f59e0b,stroke-width:1.5px,color:#111827");
    lines.push("  classDef loop fill:#ecfeff,stroke:#06b6d4,stroke-width:1.5px,color:#111827");
    lines.push("  classDef ret fill:#ecfdf5,stroke:#16a34a,stroke-width:1.5px,color:#111827");
    lines.push("  classDef var fill:#f5f3ff,stroke:#7c3aed,stroke-width:1.5px,color:#111827");
    lines.push("  classDef stmt fill:#f3f4f6,stroke:#6b7280,stroke-width:1.5px,color:#111827");
    lines.push("  classDef activeStep fill:#dbeafe,stroke:#1d4ed8,stroke-width:3px,color:#111827");

    return lines.join("\n");
  }

  private async ensureLanguage(language: string): Promise<void> {
    if (!this.treeSitterModule) {
      this.treeSitterModule = await import("web-tree-sitter");
    }

    const { Parser, Language } = this.treeSitterModule;

    if (!this.parser) {
      this.parser = new Parser();
    }

    if (!this.initialized) {
      await Parser.init({
        locateFile(scriptName: string) {
          return `https://unpkg.com/web-tree-sitter@latest/${scriptName}`;
        },
      });
      this.initialized = true;
    }

    const normalized = language.toLowerCase();
    const wasmUrl = LANGUAGE_WASM_URLS[normalized];
    if (!wasmUrl) {
      throw new Error(`Unsupported language for tree-sitter: ${language}`);
    }

    let loaded = this.languageCache.get(normalized);
    if (!loaded) {
      loaded = await Language.load(wasmUrl);
      this.languageCache.set(normalized, loaded);
    }

    this.parser.setLanguage(loaded);
  }

  private extractFlowNodes(root: any, code: string): FlowNode[] {
    const queue: any[] = [root];
    const nodes: FlowNode[] = [];
    const maxNodes = 14;

    while (queue.length > 0 && nodes.length < maxNodes) {
      const current = queue.shift();
      if (!current) continue;

      if (current.isNamed && SUPPORTED_NODE_TYPES.has(current.type)) {
        const text = code.slice(current.startIndex, current.endIndex).trim();
        const normalized = text.replace(/\s+/g, " ").slice(0, 80);
        if (normalized) {
          nodes.push({
            id: `node_${nodes.length + 1}`,
            label: this.getNodeLabel(current.type, normalized),
            type: this.getNodeKind(current.type),
            metadata: {
              description: this.getNodeDescription(current.type, normalized),
              sourceType: current.type,
            },
          });
        }
      }

      current.namedChildren.forEach((child) => queue.push(child));
    }

    return nodes;
  }

  private addStartEnd(nodes: FlowNode[]): FlowNode[] {
    const startNode: FlowNode = {
      id: "start",
      label: "Start",
      type: "function",
      metadata: { description: "Program begins" },
    };

    const endNode: FlowNode = {
      id: "end",
      label: "End",
      type: "return",
      metadata: { description: "Program finishes" },
    };

    return [startNode, ...nodes, endNode];
  }

  private buildLinearConnections(nodes: FlowNode[]): FlowConnection[] {
    const connections: FlowConnection[] = [];
    for (let index = 0; index < nodes.length - 1; index += 1) {
      connections.push({
        from: nodes[index].id,
        to: nodes[index + 1].id,
      });
    }
    return connections;
  }

  private buildFallbackFlow(code: string): FlowchartResult {
    const lines = code
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 8);

    const bodyNodes: FlowNode[] = lines.map((line, index) => ({
      id: `line_${index + 1}`,
      label: line.slice(0, 70),
      type: this.getFallbackType(line),
      metadata: { description: "Extracted from source line" },
    }));

    const nodes = this.addStartEnd(bodyNodes);
    return {
      type: "flowchart",
      data: {
        nodes,
        connections: this.buildLinearConnections(nodes),
        parser: "fallback",
      },
    };
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("Tree-sitter timeout")), timeoutMs);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  private getNodeKind(nodeType: string): FlowNode["type"] {
    if (nodeType.includes("if") || nodeType.includes("condition")) return "condition";
    if (nodeType.includes("for") || nodeType.includes("while") || nodeType.includes("loop")) return "loop";
    if (nodeType.includes("return")) return "return";
    if (nodeType.includes("declaration") || nodeType.includes("assignment")) return "variable";
    if (nodeType.includes("function") || nodeType.includes("method")) return "function";
    return "statement";
  }

  private getNodeLabel(nodeType: string, snippet: string): string {
    if (nodeType.includes("function") || nodeType.includes("method")) {
      return `Function: ${snippet}`;
    }
    if (nodeType.includes("if")) return `Condition: ${snippet}`;
    if (nodeType.includes("for") || nodeType.includes("while")) return `Loop: ${snippet}`;
    if (nodeType.includes("return")) return `Return: ${snippet}`;
    if (nodeType.includes("declaration") || nodeType.includes("assignment")) return `Assignment: ${snippet}`;
    return snippet;
  }

  private getNodeDescription(nodeType: string, snippet: string): string {
    if (nodeType.includes("if")) return "Decision branch in control flow";
    if (nodeType.includes("for") || nodeType.includes("while")) return "Repeated execution block";
    if (nodeType.includes("return")) return "Returns a value or exits current block";
    if (nodeType.includes("function") || nodeType.includes("method")) return "Defines executable logic block";
    if (nodeType.includes("declaration") || nodeType.includes("assignment")) return "Creates or updates program state";
    return `Parsed node: ${snippet}`;
  }

  private getFallbackType(line: string): FlowNode["type"] {
    if (/^if\b|\belse\b|\bswitch\b/i.test(line)) return "condition";
    if (/^for\b|^while\b|\bfor\s*\(/i.test(line)) return "loop";
    if (/^return\b/i.test(line)) return "return";
    if (/=/.test(line)) return "variable";
    if (/function\b|def\b|class\b|public\s+static/i.test(line)) return "function";
    return "statement";
  }

  private nodeShape(type: FlowNode["type"], label: string): string {
    switch (type) {
      case "condition":
        return `{\"${label}\"}`;
      case "loop":
        return `([\"${label}\"])`;
      case "return":
        return `([\"${label}\"])`;
      default:
        return `[\"${label}\"]`;
    }
  }

  private nodeClass(type: FlowNode["type"]): string {
    switch (type) {
      case "function":
        return "fn";
      case "condition":
        return "cond";
      case "loop":
        return "loop";
      case "return":
        return "ret";
      case "variable":
        return "var";
      default:
        return "stmt";
    }
  }

  private escapeMermaidLabel(value: string): string {
    return value.replace(/"/g, "'").replace(/</g, "(").replace(/>/g, ")");
  }
}

export const treeSitterFlowService = new TreeSitterFlowService();
