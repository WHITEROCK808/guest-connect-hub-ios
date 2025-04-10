
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getMessages, 
  Message, 
  addReply, 
  updateMessageStatus, 
  MessageStatus 
} from "../../data/messages";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Check, 
  ChevronLeft, 
  SendHorizontal, 
  UserCircle, 
  CheckCircle 
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import MessageStatusBadge from "./MessageStatus";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const MessageDetail = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { messageId } = useParams<{ messageId: string }>();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch the message details
  useEffect(() => {
    if (!messageId) {
      navigate("/staff");
      return;
    }
    
    const loadMessage = () => {
      const messages = getMessages();
      const foundMessage = messages.find((m) => m.id === messageId);
      
      if (foundMessage) {
        setMessage(foundMessage);
      } else {
        toast.error("Message not found");
        navigate("/staff");
      }
    };
    
    loadMessage();
    
    // Refresh every 5 seconds to get updates
    const intervalId = setInterval(loadMessage, 5000);
    
    return () => clearInterval(intervalId);
  }, [messageId, navigate]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);
  
  const handleBackClick = () => {
    navigate("/staff");
  };
  
  const handleStatusChange = (status: MessageStatus) => {
    if (!message || !user) return;
    
    const updatedMessage = updateMessageStatus(
      message.id, 
      status, 
      user.name
    );
    
    if (updatedMessage) {
      setMessage(updatedMessage);
      toast.success(`Status updated to ${status}`);
    }
  };
  
  const handleAssign = () => {
    if (!message || !user) return;
    
    const updatedMessage = updateMessageStatus(
      message.id,
      "inprogress",
      user.name
    );
    
    if (updatedMessage) {
      setMessage(updatedMessage);
      toast.success(`Assigned to ${user.name}`);
    }
  };
  
  const handleSendReply = () => {
    if (!message || !user || !replyText.trim()) return;
    
    setLoading(true);
    
    const newReply = addReply(message.id, replyText, user.name);
    
    if (newReply) {
      // Update the message status if needed
      if (message.status === "unread") {
        updateMessageStatus(message.id, "inprogress", user.name);
      }
      
      // Refresh the message data
      const messages = getMessages();
      const updatedMessage = messages.find((m) => m.id === messageId);
      
      if (updatedMessage) {
        setMessage(updatedMessage);
        setReplyText("");
        toast.success("Reply sent");
      }
    } else {
      toast.error("Failed to send reply");
    }
    
    setLoading(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };
  
  if (!message) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p>Loading...</p>
      </div>
    );
  }
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(date));
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('default', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-medium text-lg">
              Message {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </h2>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{formatDate(new Date(message.timestamp))}</span>
              <span className="mx-2">•</span>
              <MessageStatusBadge status={message.status} size="sm" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {message.status !== "completed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAssign}
              className="text-xs"
              disabled={message.assignedTo === user?.name}
            >
              <UserCircle className="h-3 w-3 mr-1" />
              {message.assignedTo ? 
                (message.assignedTo === user?.name ? 
                  "Assigned to you" : 
                  `Assigned to ${message.assignedTo}`) : 
                t("staff.assign")}
            </Button>
          )}
          
          {message.status !== "completed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("completed")}
              className="text-xs text-status-completed"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {t("staff.markComplete")}
            </Button>
          )}
        </div>
      </div>
      
      {/* Message content */}
      <Card className="p-4 mb-4">
        <p>{message.content}</p>
        
        {message.imageUrl && (
          <div className="mt-3">
            <img
              src={message.imageUrl}
              alt="Guest uploaded"
              className="max-h-60 rounded-md"
            />
          </div>
        )}
      </Card>
      
      {/* Chat thread */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {message.replies.map((reply) => (
          <div key={reply.id} className="flex">
            <div className="max-w-[80%] bg-gray-100 dark:bg-gray-800 rounded-2xl p-3 rounded-tl-sm">
              <div className="flex items-center mb-1">
                <UserCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                <p className="text-xs font-medium">{reply.staffName}</p>
              </div>
              <p className="text-sm">{reply.content}</p>
              <p className="text-xs text-muted-foreground text-right mt-1">
                {formatTime(new Date(reply.timestamp))}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Reply form */}
      <div className="mt-auto">
        {message.status !== "completed" ? (
          <div className="flex items-center space-x-2">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("staff.reply")}
              className="flex-1"
              disabled={loading}
            />
            <Button
              onClick={handleSendReply}
              disabled={!replyText.trim() || loading}
              className="bg-ios-blue hover:bg-ios-blue/90"
            >
              <SendHorizontal className="h-4 w-4 mr-2" />
              {t("staff.send")}
            </Button>
          </div>
        ) : (
          <div className="bg-status-completed/10 text-status-completed p-2 rounded-md flex items-center justify-center">
            <Check className="h-4 w-4 mr-1" />
            <span className="text-sm">This message has been marked as completed</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageDetail;
