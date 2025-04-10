
import React from "react";
import { Message } from "../../data/messages";
import MessageStatus from "./MessageStatus";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { useLanguage } from "../../contexts/LanguageContext";
import { MessageSquare, Image, UserCircle } from "lucide-react";

interface MessageCardProps {
  message: Message;
  onClick: () => void;
}

const MessageCard = ({ message, onClick }: MessageCardProps) => {
  const { t } = useLanguage();
  
  const formattedDate = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
  });
  
  // Truncate message if it's too long
  const truncatedContent = 
    message.content.length > 120 
      ? message.content.substring(0, 120) + "..." 
      : message.content;
  
  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4 animate-fade-in"
      style={{ 
        borderLeftColor: 
          message.status === "unread" 
            ? "#FF3B30" 
            : message.status === "inprogress" 
              ? "#FFCC00" 
              : "#34C759" 
      }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{formattedDate}</span>
        </div>
        <MessageStatus status={message.status} />
      </div>
      
      <p className="text-sm mb-3">{truncatedContent}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {message.imageUrl && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Image className="h-3 w-3 mr-1" />
              <span>Image</span>
            </div>
          )}
          
          {message.replies.length > 0 && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{message.replies.length}</span>
            </div>
          )}
        </div>
        
        {message.assignedTo && (
          <div className="flex items-center text-xs">
            <UserCircle className="h-3 w-3 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{message.assignedTo}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MessageCard;
