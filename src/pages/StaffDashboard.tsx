
import React from "react";
import Layout from "../components/Layout";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import MessageList from "../components/staff/MessageList";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, BarChart } from "lucide-react";

const StaffDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/staff/login");
  };
  
  const isAdmin = user?.role === "admin";
  
  return (
    <Layout title={t("staff.dashboard.title")}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">
            {user?.role === "admin" ? "Admin" : "Staff"}: {user?.name}
          </h2>
        </div>
        <div className="flex space-x-2">
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={() => navigate("/staff/statistics")}>
              <BarChart className="h-4 w-4 mr-1" />
              {t("staff.statistics.link")}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            {t("staff.logout")}
          </Button>
        </div>
      </div>
      
      <MessageList />
    </Layout>
  );
};

export default StaffDashboard;
