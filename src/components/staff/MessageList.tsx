
import React, { useState, useEffect } from "react";
import { getMessages, Message, MessageStatus as StatusType } from "../../data/messages";
import MessageCard from "./MessageCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const MessageList = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | StatusType>("all");
  
  useEffect(() => {
    // Load messages and set up an interval to refresh them
    const loadMessages = () => {
      const fetchedMessages = getMessages();
      setMessages(fetchedMessages);
    };
    
    loadMessages();
    
    // Refresh messages every 10 seconds
    const intervalId = setInterval(loadMessages, 10000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleMessageClick = (messageId: string) => {
    navigate(`/staff/messages/${messageId}`);
  };
  
  const filteredMessages = activeTab === "all" 
    ? messages 
    : messages.filter(message => message.status === activeTab);
  
  // Sort messages by timestamp (newest first)
  const sortedMessages = [...filteredMessages].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return (
    <div>
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as "all" | StatusType)}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">
            {t("staff.dashboard.filter.all")}
          </TabsTrigger>
          <TabsTrigger value="unread" className="text-status-unread">
            {t("staff.dashboard.filter.unread")}
          </TabsTrigger>
          <TabsTrigger value="inprogress" className="text-status-inprogress">
            {t("staff.dashboard.filter.inprogress")}
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-status-completed">
            {t("staff.dashboard.filter.completed")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="space-y-4">
            {sortedMessages.length > 0 ? (
              sortedMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onClick={() => handleMessageClick(message.id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No messages found
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessageList;
