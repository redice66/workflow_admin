"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

type Message = {
  id: number
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "请问您想去哪里旅行？",
  },
  {
    id: 2,
    role: "user",
    content: "我想去日本玩8天",
  },
  {
    id: 3,
    role: "assistant",
    content: "您的预算大约是多少？",
  },
  {
    id: 4,
    role: "user",
    content: "2万块",
  },
  {
    id: 5,
    role: "assistant",
    content:
      "您好！根据您的旅行信息（目的地日本，行程8天，预算约2万元人民币），我为您设计了一份详细的日本8日游行程安排。此行程覆盖了日本的主要城市和经典景点，兼顾文化体验、美食享受与购物休闲，以下是具体安排：",
  },
]

interface PreviewPanelProps {
  onClose?: () => void
}

export function PreviewPanel({ onClose }: PreviewPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Add a useEffect to scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    }

    setMessages([...messages, newMessage])
    setInput("")

    // 模拟助手回复
    setTimeout(() => {
      const assistantReply: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: "这是一个自动回复消息，实际应用中会根据工作流逻辑生成回复。",
      }
      setMessages((prev) => [...prev, assistantReply])
    }, 1000)
  }

  return (
    <div className="w-80 border-l bg-background flex flex-col h-full">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">预览</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4" ref={messagesContainerRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                } items-start gap-2`}
              >
                {message.role === "assistant" && (
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <Avatar className="mt-1 h-6 w-6">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="和机器人聊天..."
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <Button size="icon" onClick={handleSendMessage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </Button>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>功能已开启</span>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
            管理 →
          </Button>
        </div>
      </div>
    </div>
  )
}
