
import React from "react";
import { MessageStatus as StatusType } from "../../data/messages";
import { Check, Clock, AlertCircle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface StatusProps {
  status: StatusType;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const MessageStatus = ({ 
  status, 
  className = "", 
  showLabel = true,
  size = "md" 
}: StatusProps) => {
  const { t } = useLanguage();
  
  const getStatusColor = () => {
    switch (status) {
      case "unread":
        return "text-status-unread bg-status-unread/10";
      case "inprogress":
        return "text-status-inprogress bg-status-inprogress/10";
      case "completed":
        return "text-status-completed bg-status-completed/10";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };
  
  const getStatusIcon = () => {
    const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;
    
    switch (status) {
      case "unread":
        return <AlertCircle size={iconSize} />;
      case "inprogress":
        return <Clock size={iconSize} />;
      case "completed":
        return <Check size={iconSize} />;
      default:
        return null;
    }
  };
  
  const getStatusLabel = () => {
    switch (status) {
      case "unread":
        return t("staff.status.unread");
      case "inprogress":
        return t("staff.status.inprogress");
      case "completed":
        return t("staff.status.completed");
      default:
        return "";
    }
  };
  
  const containerSizeClass = 
    size === "sm" 
      ? "text-xs px-2 py-1" 
      : size === "lg" 
        ? "text-sm px-3 py-1.5" 
        : "text-xs px-2.5 py-1";
  
  return (
    <div className={`inline-flex items-center rounded-full ${getStatusColor()} ${containerSizeClass} ${className}`}>
      {getStatusIcon()}
      {showLabel && <span className="ml-1">{getStatusLabel()}</span>}
    </div>
  );
};

export default MessageStatus;
