// src/features/AIAnalysis.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const AIAnalysis = ({
  analysisResult,
  runResult,
}: {
  analysisResult: any;
  runResult: any;
}) => {
  return (
    <Card className="glass">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-bold">AI Analysis</h3>
        <p className="text-muted-foreground">Beta</p>

        {analysisResult || runResult ? (
          <div className="space-y-3">
            {/* ---- Analysis Output ---- */}
            {analysisResult && (
              <div>
                <h4 className="font-semibold">Analysis Result</h4>
                <pre className="p-2 bg-muted rounded-md overflow-auto text-sm">
                  {typeof analysisResult === "string"
                    ? analysisResult
                    : JSON.stringify(analysisResult, null, 2)}
                </pre>
              </div>
            )}

            {/* ---- Run Results ---- */}
            {runResult && (
              <div>
                <h4 className="font-semibold">Run Result</h4>

                <div className="text-sm text-muted-foreground mb-2">
                  Exit Code:{" "}
                  <span
                    className={
                      runResult.exitCode === 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {runResult.exitCode}
                  </span>{" "}
                  {runResult.durationMs &&
                    `(took ${runResult.durationMs} ms)`}
                </div>

                {/* stdout */}
                <div>
                  <h5 className="font-medium">Stdout:</h5>
                  <pre className="bg-muted p-2 rounded-md text-sm">
                    {runResult.stdout && runResult.stdout.trim() !== ""
                      ? runResult.stdout
                      : "No output"}
                  </pre>
                </div>

                {/* stderr */}
                <div>
                  <h5 className="font-medium">Stderr:</h5>
                  <pre className="bg-red-500/10 text-red-500 p-2 rounded-md text-sm">
                    {runResult.stderr && runResult.stderr.trim() !== ""
                      ? runResult.stderr
                      : "No errors"}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground">
            No run executed yet.
            <br />
            <Button className="mt-3">Run an analysis to see results here</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
