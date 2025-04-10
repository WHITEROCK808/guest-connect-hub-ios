
import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderBarProps {
  onBackClick?: () => void;
  showBackButton?: boolean;
  title?: string;
}

const HeaderBar = ({ onBackClick, showBackButton = false, title }: HeaderBarProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="flex items-center justify-between p-4 bg-background dark:bg-gray-900 shadow-sm">
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={onBackClick}
            className="mr-4 text-primary hover:text-primary/80 transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="text-xl font-semibold">{title || t("app.title")}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          aria-label={language === "en" ? "Switch to Chinese" : "切換至英文"}
          onClick={toggleLanguage}
          className="rounded-full w-9 h-9"
        >
          <Globe className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          aria-label={theme === "light" ? t("app.dark") : t("app.light")}
          onClick={toggleTheme}
          className="rounded-full w-9 h-9"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default HeaderBar;
