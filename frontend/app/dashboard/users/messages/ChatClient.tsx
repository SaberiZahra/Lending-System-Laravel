"use client";

import { useState } from "react";
import { Conversation, Message } from "./types";

export default function ChatClient({
  conversations,
  initialMessages,
}: {
  conversations: Conversation[];
  initialMessages: Message[];
}) {
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(conversations[0] || null);

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");

  function sendMessage() {
    if (!text.trim() || !activeConversation) return;

    const newMessage: Message = {
      id: Date.now(),
      conversationId: activeConversation.id,
      senderId: 1,
      text,
      createdAt: "الان",
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setText("");
  }

  return (
    <div className="flex h-[calc(100vh-3rem)] bg-blue-50 rounded-2xl shadow overflow-hidden">
  {/* Conversations */}
  <aside className="w-80 border-l overflow-y-auto bg-white">
    {conversations.map((c) => (
      <button
        key={c.id}
        onClick={() => setActiveConversation(c)}
        className={`w-full text-right p-4 border-b transition-colors
          ${activeConversation?.id === c.id ? "bg-blue-100" : "hover:bg-blue-50"}`}
      >
        <div className="flex justify-between">
          <span className="font-medium text-gray-800">{c.otherUserName}</span>
          <span className="text-xs text-gray-400">{c.updatedAt}</span>
        </div>

        <p className="text-sm text-gray-500 truncate">{c.lastMessage}</p>

        {c.unreadCount > 0 && (
          <span className="inline-block mt-1 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
            {c.unreadCount}
          </span>
        )}
      </button>
    ))}
  </aside>

  {/* Chat */}
  <section className="flex-1 flex flex-col">
    {/* Header */}
    <header className="p-4 border-b bg-white font-semibold text-gray-800 shadow-sm">
      {activeConversation?.otherUserName}
    </header>

    {/* Messages */}
    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
      {messages
        .filter((m) => m.conversationId === activeConversation?.id)
        .map((m) => (
          <div
            key={m.id}
            className={`max-w-md px-4 py-2 rounded-2xl text-sm
              ${
                m.isOwn
                  ? "ml-auto bg-blue-600 text-white"  // پیام خود کاربر: آبی روشن و متن سفید
                  : "mr-auto bg-white border border-gray-200" // پیام طرف مقابل: سفید با حاشیه خاکستری
              }`}
          >
            <p>{m.text}</p>
            <span className="block mt-1 text-xs text-gray-400">{m.createdAt}</span>
          </div>
        ))}
    </div>

    {/* Input */}
    <footer className="p-4 border-t bg-white flex gap-2 shadow-inner rounded-b-2xl">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="پیام خود را بنویسید..."
        className="flex-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
      <button
        onClick={sendMessage}
        className="px-5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition"
      >
        ارسال
      </button>
    </footer>
  </section>
</div>


  );
}
