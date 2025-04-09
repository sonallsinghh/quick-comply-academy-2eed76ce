
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, SendHorizontal } from "lucide-react";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatHelpProps {
  slideTitle: string;
  slideContent: string;
}

const ChatHelp: React.FC<ChatHelpProps> = ({ slideTitle, slideContent }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "Hello! I'm your AI assistant. Ask me any questions about this slide.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };
    
    setChatMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: `I can help you understand "${slideTitle}". ${generateAIResponse(inputText, slideContent)}`,
        isUser: false,
        timestamp: new Date(),
      };
      
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (question: string, content: string): string => {
    // This is just a mock response. In a production app, you'd call an AI API
    const responses = [
      `Based on the slide content, I think this might help: "${content.substring(0, 50)}..."`,
      "That's a great question! The slide explains this concept in detail.",
      "I'd recommend focusing on the key points mentioned in this slide.",
      "This slide covers that topic. The main idea is about learning progressively.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'h-[400px]' : 'h-auto'}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">AI Learning Assistant</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleExpand}
          className="text-sm"
        >
          {isExpanded ? "Minimize" : "Expand"}
        </Button>
      </div>

      {isExpanded && (
        <ScrollArea className="h-[280px] p-4">
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    msg.isUser
                      ? "bg-complybrand-700 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-xs">
                      {msg.isUser ? "You" : "AI Assistant"}
                    </span>
                    <span className="text-xs opacity-70">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="p-4 flex items-center">
        {!isExpanded && <MessageCircle className="w-5 h-5 mr-2 text-complybrand-700" />}
        <div className="flex-1 relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a question about this slide..."
            className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-complybrand-500 resize-none"
            rows={isExpanded ? 2 : 1}
          />
          <Button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
            size="sm"
            variant="ghost"
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={handleSendMessage}
          className="ml-2 bg-complybrand-700 hover:bg-complybrand-800"
          disabled={!inputText.trim()}
        >
          Ask
        </Button>
      </div>
    </Card>
  );
};

export default ChatHelp;
