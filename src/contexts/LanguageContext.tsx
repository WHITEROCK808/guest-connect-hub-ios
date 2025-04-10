
import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    "app.title": "Guest Communication Hub",
    "app.dark": "Dark Mode",
    "app.light": "Light Mode",
    
    // Guest side
    "guest.welcome": "Welcome to White Rock Hotel",
    "guest.description": "Need assistance? Send us a message and we'll respond as soon as possible.",
    "guest.input.placeholder": "Type your message...",
    "guest.button.send": "Send",
    "guest.button.upload": "Upload Image",
    "guest.message.sent": "Message sent successfully!",
    
    // Staff side
    "staff.login.title": "Staff Login",
    "staff.login.username": "Username",
    "staff.login.password": "Password",
    "staff.login.button": "Login",
    "staff.login.error": "Invalid username or password",
    "staff.dashboard.title": "Message Dashboard",
    "staff.dashboard.filter.all": "All Messages",
    "staff.dashboard.filter.unread": "Unread",
    "staff.dashboard.filter.inprogress": "In Progress",
    "staff.dashboard.filter.completed": "Completed",
    "staff.status.unread": "Unread",
    "staff.status.inprogress": "In Progress",
    "staff.status.completed": "Completed",
    "staff.assign": "Assign",
    "staff.reply": "Reply",
    "staff.send": "Send",
    "staff.markComplete": "Mark as Completed",
    "staff.logout": "Logout",
    
    // Statistics
    "staff.statistics.link": "Statistics",
    "staff.statistics.pageTitle": "Employee Ticket Performance",
    "staff.statistics.title": "Employee Ticket Performance",
    "staff.statistics.description": "View message handling statistics by staff member",
    "staff.statistics.barChart": "Bar Chart",
    "staff.statistics.pieChart": "Pie Chart",
    "staff.statistics.today": "Today",
    "staff.statistics.week": "This Week",
    "staff.statistics.month": "This Month",
    "staff.statistics.all": "All Time",
  },
  zh: {
    // Common
    "app.title": "旅客溝通中心",
    "app.dark": "夜間模式",
    "app.light": "日間模式",
    
    // Guest side
    "guest.welcome": "歡迎來到白石飯店",
    "guest.description": "需要協助嗎？發送訊息給我們，我們將盡快回覆。",
    "guest.input.placeholder": "輸入訊息...",
    "guest.button.send": "發送",
    "guest.button.upload": "上傳圖片",
    "guest.message.sent": "訊息發送成功！",
    
    // Staff side
    "staff.login.title": "員工登入",
    "staff.login.username": "帳號",
    "staff.login.password": "密碼",
    "staff.login.button": "登入",
    "staff.login.error": "帳號或密碼無效",
    "staff.dashboard.title": "訊息儀表板",
    "staff.dashboard.filter.all": "所有訊息",
    "staff.dashboard.filter.unread": "未讀",
    "staff.dashboard.filter.inprogress": "處理中",
    "staff.dashboard.filter.completed": "已完成",
    "staff.status.unread": "未讀",
    "staff.status.inprogress": "處理中",
    "staff.status.completed": "已完成",
    "staff.assign": "分配",
    "staff.reply": "回覆",
    "staff.send": "發送",
    "staff.markComplete": "標記為已完成",
    "staff.logout": "登出",
    
    // Statistics
    "staff.statistics.link": "統計圖表",
    "staff.statistics.pageTitle": "員工處理績效圖表",
    "staff.statistics.title": "員工處理績效圖表",
    "staff.statistics.description": "查看員工訊息處理統計",
    "staff.statistics.barChart": "柱狀圖",
    "staff.statistics.pieChart": "圓餅圖",
    "staff.statistics.today": "今天",
    "staff.statistics.week": "本週",
    "staff.statistics.month": "本月",
    "staff.statistics.all": "所有時間",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language | null;
    if (storedLanguage && (storedLanguage === "en" || storedLanguage === "zh")) {
      setLanguage(storedLanguage);
    } else {
      const browserLanguage = navigator.language.startsWith("zh") ? "zh" : "en";
      setLanguage(browserLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "en" ? "zh" : "en"));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
