
import React from "react";
import Layout from "../components/Layout";
import ChatInterface from "../components/guest/ChatInterface";
import { useLanguage } from "../contexts/LanguageContext";
import { QrCode } from "lucide-react";

const GuestPage = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-ios-blue/10 dark:bg-ios-blue/20 rounded-full mb-3">
            <QrCode className="h-8 w-8 text-ios-blue" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">{t("guest.welcome")}</h1>
          <p className="text-muted-foreground">
            {t("guest.description")}
          </p>
        </div>
        
        <div className="animate-fade-in">
          <ChatInterface />
        </div>
      </div>
    </Layout>
  );
};

export default GuestPage;
