import type React from "react"
import { useState, type FormEvent, useRef, useEffect } from "react"
import { apiService } from "../api/apiService"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  styled,
} from "@mui/material"
import { Send, Delete, Logout } from "@mui/icons-material"
import ReactMarkdown from "react-markdown"

interface Message {
  text: string
  sender: "user" | "assistant"
}

const ScrollableCardContent = styled(CardContent)`
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0.4em;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom]) 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!inputMessage.trim()) return

    const userMessage: Message = {
      text: inputMessage,
      sender: "user",
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await apiService.post("/chat", {
        message: inputMessage,
      })

      const assistantMessage: Message = {
        text: response.data.data,
        sender: "assistant",
      }
      setMessages((prevMessages) => [...prevMessages, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        text: "Sorry, something went wrong. Please try again.",
        sender: "assistant",
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    apiService.post("/signout")
    window.location.href = "/signin"
  }

  const handleClearConversation = () => {
    setMessages([])
  }

  return (
    <Card
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        m: 0,
        p: 0,
      }}
    >
      <CardHeader
        title="Chat Interface"
        action={
          <Box>
            <IconButton onClick={handleClearConversation} aria-label="clear conversation">
              <Delete />
            </IconButton>
            <IconButton onClick={handleSignOut} aria-label="sign out">
              <Logout />
            </IconButton>
          </Box>
        }
      />
      <ScrollableCardContent
        ref={scrollRef}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: message.sender === "user" ? "row-reverse" : "row",
                alignItems: "end",
              }}
            >
              <Avatar sx={{ bgcolor: message.sender === "user" ? "primary.main" : "secondary.main" }}>
                {message.sender === "user" ? "U" : "A"}
              </Avatar>
              <Box
                sx={{
                  maxWidth: "70%",
                  p: 1,
                  borderRadius: 1,
                  bgcolor: message.sender === "user" ? "primary.light" : "secondary.light",
                  ml: message.sender === "user" ? 2 : 0, 
                  mr: message.sender === "user" ? 0 : 2, 
                }}
              >
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </Box>
            </Box>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
            <Avatar sx={{ bgcolor: "secondary.main" }}>A</Avatar>
            <Typography
              variant="body1"
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: "secondary.light",
                ml: 1,
              }}
            >
              Typing...
            </Typography>
          </Box>
        )}
      </ScrollableCardContent>
      <CardContent>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
          <TextField
            fullWidth
            variant="outlined"
            value={inputMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading || !inputMessage.trim()}
            endIcon={<Send />}
          >
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default ChatInterface

