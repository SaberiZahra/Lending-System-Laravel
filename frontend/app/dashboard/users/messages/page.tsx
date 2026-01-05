"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { messagesAPI, authAPI } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import Footer from "@/components/Footer";


type Conversation = {
  id: number;
  participants?: Array<{
    id: number;
    full_name: string;
    username: string;
    profile_image?: string;
  }>;
  messages?: Array<{
    id: number;
    message_text: string;
    created_at: string;
  }>;
};

type Message = {
  id: number;
  conversation_id: number;
  message_text: string;
  sender_id: number;
  created_at: string;
  sender?: {
    id: number;
    full_name: string;
    username: string;
  };
};

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [conversationsData, userData] = await Promise.all([
          messagesAPI.getConversations(),
          authAPI.me().catch(() => null),
        ]);
        setConversations(conversationsData || []);
        setUser(userData);
      } catch (err: any) {
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (activeConversation) {
      const fetchMessages = async () => {
        try {
          const messagesData = await messagesAPI.getMessages(activeConversation.id);
          setMessages(messagesData || []);
        } catch (err: any) {
          console.error("Error fetching messages:", err);
        }
      };
      fetchMessages();
    }
  }, [activeConversation]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversation) return;

    try {
      await messagesAPI.send({
        conversation_id: activeConversation.id,
        message: messageText,
      });
      setMessageText("");
      
      // Refresh messages
      const messagesData = await messagesAPI.getMessages(activeConversation.id);
      setMessages(messagesData || []);
    } catch (err: any) {
      console.error("Error sending message:", err);
      alert("خطا در ارسال پیام");
    }
  };

  const getOtherUser = (conversation: Conversation) => {
    if (!conversation.participants || !user) return null;
    return conversation.participants.find(p => p.id !== user.id);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "الان";
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} ساعت پیش`;
    return date.toLocaleDateString('fa-IR');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-blue-100 p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-800">پیام‌ها</h1>
      </div>

      <div className="flex h-[calc(100vh-300px)] bg-white rounded-2xl shadow overflow-hidden">
        {/* Conversations List */}
        <aside className="w-80 border-l border-gray-200 overflow-y-auto bg-gray-50">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              هیچ مکالمه‌ای وجود ندارد
            </div>
          ) : (
            conversations.map((conv) => {
              const otherUser = getOtherUser(conv);
              const lastMessage = conv.messages?.[0];
              
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full text-right p-4 border-b border-gray-200 hover:bg-blue-50 transition ${
                    activeConversation?.id === conv.id ? "bg-blue-100" : ""
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-800">
                      {otherUser?.full_name || "کاربر"}
                    </span>
                    {lastMessage && (
                      <span className="text-xs text-gray-400">
                        {formatTime(lastMessage.created_at)}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className="text-sm text-gray-600 truncate">
                      {lastMessage.message_text}
                    </p>
                  )}
                </button>
              );
            })
          )}
        </aside>

        {/* Chat Area */}
        {activeConversation ? (
          <section className="flex-1 flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-200 p-4 bg-white shadow-sm">
              {(() => {
                const otherUser = getOtherUser(activeConversation);
                return (
                  <>
                    <h2 className="font-semibold text-gray-800">
                      {otherUser?.full_name || "کاربر"}
                    </h2>
                    <p className="text-xs text-gray-500">@{otherUser?.username || ""}</p>
                  </>
                );
              })()}
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  هیچ پیامی وجود ندارد
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`max-w-md px-4 py-2 rounded-2xl text-sm ${
                        isOwn
                          ? "ml-auto bg-blue-600 text-white"
                          : "mr-auto bg-white border border-gray-200"
                      }`}
                    >
                      <p>{msg.message_text}</p>
                      <span
                        className={`block mt-1 text-xs ${
                          isOwn ? "text-blue-200" : "text-gray-400"
                        }`}
                      >
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input */}
            <footer className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="پیام خود را بنویسید..."
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  ارسال
                </button>
              </div>
            </footer>
          </section>
        ) : (
          <section className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <p className="text-lg">یک مکالمه را انتخاب کنید</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
  <Footer />
