
import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { addMessage, Reply } from "../../data/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, SendHorizontal } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  imageUrl?: string;
  isGuest: boolean;
  staffName?: string;
}

const ChatInterface = () => {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load any existing conversation from localStorage
  useEffect(() => {
    const loadMessages = () => {
      try {
        const storedConvo = localStorage.getItem('guestConversation');
        if (storedConvo) {
          const parsedConvo = JSON.parse(storedConvo);
          setMessages(parsedConvo.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        }
      } catch (error) {
        console.error("Error loading conversation:", error);
      }
    };
    
    loadMessages();
  }, []);

  // Save conversation to localStorage when it changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('guestConversation', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if ((!message && !selectedImage) || message.trim() === "") return;
    
    // For demo purposes we'll encode the image as a data URL
    if (selectedImage && previewUrl) {
      const newMsg = addMessage(message, previewUrl);
      
      setMessages((prev) => [
        ...prev,
        {
          id: newMsg.id,
          content: message,
          timestamp: new Date(),
          imageUrl: previewUrl,
          isGuest: true
        }
      ]);
    } else {
      const newMsg = addMessage(message);
      
      setMessages((prev) => [
        ...prev,
        {
          id: newMsg.id,
          content: message,
          timestamp: new Date(),
          isGuest: true
        }
      ]);
    }
    
    toast.success(t("guest.message.sent"));
    
    setMessage("");
    setSelectedImage(null);
    setPreviewUrl(null);

    // Simulate a response after a delay for demo purposes
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          content: "Thank you for your message. Our staff will respond shortly.",
          timestamp: new Date(),
          isGuest: false,
          staffName: "System"
        }
      ]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setSelectedImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="flex flex-col h-[80vh] bg-gray-50 dark:bg-gray-900 rounded-ios overflow-hidden shadow-ios">
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.isGuest ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl p-3 ${
                  msg.isGuest
                    ? "bg-ios-blue text-white rounded-tr-sm"
                    : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-tl-sm"
                }`}
              >
                {!msg.isGuest && msg.staffName && (
                  <p className="font-medium text-xs opacity-75 mb-1">{msg.staffName}</p>
                )}
                <p className="text-sm">{msg.content}</p>
                
                {msg.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={msg.imageUrl}
                      alt="Attached"
                      className="rounded-lg max-h-60 w-auto"
                    />
                  </div>
                )}
                
                <p className="text-xs opacity-75 text-right mt-1">
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Preview for selected image */}
      {previewUrl && (
        <div className="p-2 bg-gray-100 dark:bg-gray-800">
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-20 rounded-md object-cover"
            />
            <button
              onClick={() => {
                setSelectedImage(null);
                setPreviewUrl(null);
              }}
              className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleImageClick}
            className="p-2 text-gray-500 hover:text-ios-blue dark:text-gray-300 dark:hover:text-white transition-colors"
            aria-label="Upload image"
          >
            <Camera size={24} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("guest.input.placeholder")}
            className="flex-1 rounded-full py-2 px-4 bg-white dark:bg-gray-700"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() && !selectedImage}
            className="rounded-full bg-ios-blue hover:bg-ios-blue/90 p-2"
            aria-label="Send message"
          >
            <SendHorizontal size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
