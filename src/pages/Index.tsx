
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { MessageSquare, Users } from "lucide-react";

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center space-y-8 animate-fade-in">
        <h1 className="text-4xl font-bold">{t("app.title")}</h1>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => navigate("/guest")}
            className="flex items-center w-full md:w-auto ios-button bg-ios-blue px-8 py-6"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Guest Portal
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/staff/login")}
            className="flex items-center w-full md:w-auto px-8 py-6"
          >
            <Users className="h-5 w-5 mr-2" />
            Staff Portal
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Welcome to the Guest Communication Hub. Choose your portal above to continue.
        </p>
      </div>
    </div>
  );
};

export default Index;
