// Version Comparison Service
// Tracks and compares code versions over time

export interface CodeVersion {
  id: string;
  timestamp: Date;
  code: string;
  language: string;
  description?: string;
  changes?: string[];
}

export interface VersionDiff {
  added: Array<{ line: number; code: string }>;
  removed: Array<{ line: number; code: string }>;
  modified: Array<{ line: number; oldCode: string; newCode: string }>;
  unchanged: Array<{ line: number; code: string }>;
}

class VersionComparisonService {
  private storageKey = "codeVersions";

  public saveVersion(
    code: string,
    language: string,
    description?: string
  ): CodeVersion {
    const version: CodeVersion = {
      id: `v${Date.now()}`,
      timestamp: new Date(),
      code,
      language,
      description,
      changes: this.detectChanges(code, language),
    };

    const versions = this.getVersions();
    versions.push(version);
    
    // Keep only last 50 versions
    const recentVersions = versions.slice(-50);
    localStorage.setItem(this.storageKey, JSON.stringify(recentVersions));

    return version;
  }

  public getVersions(): CodeVersion[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const versions = JSON.parse(stored);
      return versions.map((v: any) => ({
        ...v,
        timestamp: new Date(v.timestamp),
      }));
    } catch {
      return [];
    }
  }

  public compareVersions(
    version1: CodeVersion,
    version2: CodeVersion
  ): VersionDiff {
    const lines1 = version1.code.split("\n");
    const lines2 = version2.code.split("\n");

    const diff: VersionDiff = {
      added: [],
      removed: [],
      modified: [],
      unchanged: [],
    };

    // Simple line-by-line comparison
    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i];
      const line2 = lines2[i];

      if (line1 === undefined) {
        // Added in version2
        diff.added.push({ line: i + 1, code: line2 });
      } else if (line2 === undefined) {
        // Removed in version2
        diff.removed.push({ line: i + 1, code: line1 });
      } else if (line1.trim() === line2.trim()) {
        // Unchanged
        diff.unchanged.push({ line: i + 1, code: line1 });
      } else {
        // Modified
        diff.modified.push({
          line: i + 1,
          oldCode: line1,
          newCode: line2,
        });
      }
    }

    return diff;
  }

  public getVersionHistory(code: string, language: string): CodeVersion[] {
    const allVersions = this.getVersions();
    return allVersions.filter(
      (v) => v.language === language && v.code.trim() === code.trim()
    );
  }

  private detectChanges(code: string, language: string): string[] {
    const changes: string[] = [];

    // Detect common patterns
    if (code.includes("memo") || code.includes("cache")) {
      changes.push("Added memoization");
    }

    if (code.match(/function\s+\w+|def\s+\w+/g)?.length) {
      const funcCount = code.match(/function\s+\w+|def\s+\w+/g)?.length || 0;
      if (funcCount > 1) {
        changes.push(`Added ${funcCount} functions`);
      }
    }

    if (code.includes("error") || code.includes("try") || code.includes("catch")) {
      changes.push("Added error handling");
    }

    if (code.includes("optimize") || code.includes("performance")) {
      changes.push("Performance optimization");
    }

    return changes.length > 0 ? changes : ["Code updated"];
  }
}

export const versionComparisonService = new VersionComparisonService();

