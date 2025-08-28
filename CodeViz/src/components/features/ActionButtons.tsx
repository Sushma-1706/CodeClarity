import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Upload, Save, Settings, Sun, Moon } from "lucide-react";

interface ActionButtonsProps {
  darkMode: boolean;
  executing: boolean;
  onAnalyze: () => void;
  onDarkModeToggle: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  darkMode,
  executing,
  onAnalyze,
  onDarkModeToggle
}) => {
  return (
    <div className="flex items-center gap-3">
      <Button 
        variant="default" 
        size="sm" 
        className="gap-2" 
        onClick={onAnalyze}
        disabled={executing}
      >
        <Play className="h-4 w-4" />
        {executing ? "Analyzing..." : "Analyze"}
      </Button>

      <Button variant="outline" size="sm" className="gap-2">
        <Upload className="h-4 w-4" />
        Upload File
      </Button>

      <Button variant="outline" size="sm" className="gap-2">
        <Save className="h-4 w-4" />
        Save
      </Button>

      <Button variant="secondary" size="sm" className="gap-2">
        <Settings className="h-4 w-4" />
        Settings
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-2"
        onClick={onDarkModeToggle}
      >
        {darkMode ? (
          <>
            <Sun className="h-4 w-4 text-yellow-400" />
            Light Mode
          </>
        ) : (
          <>
            <Moon className="h-4 w-4 text-blue-400" />
            Dark Mode
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;
