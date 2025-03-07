import React, { FC, useState, useCallback, useEffect, useRef } from "react"
import { GiftedChat, Bubble, Time } from "react-native-gifted-chat"
import { View, Text, Animated, StyleSheet } from "react-native"
import { ChatProps } from "@/navigators/types"

// Azure OpenAI configuration
const AZURE_OPENAI_API_KEY = "" // WARNING: Exposing API keys in client code is insecure.
const AZURE_OPENAI_ENDPOINT = "https://e0957-m7dhe0bf-eastus2.cognitiveservices.azure.com"
const DEPLOYMENT_NAME = "gpt-4"
const API_VERSION = "2024-08-01-preview"

// This function calls the Azure OpenAI API directly.
const sendToAzureOpenAI = async (userMessage: string) => {
  const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`
  const payload = {
    messages: [{ role: "user", content: userMessage }],
    // You can add other parameters here like temperature, max_tokens, etc.
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": AZURE_OPENAI_API_KEY,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Azure OpenAI API error: ${error}`)
  }

  const data = await response.json()
  return data
}

// Inline TypingIndicator using a single Animated.Value to drive sequential opacity.
const TypingIndicator: FC = () => {
  const animation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 3, // we'll have three phases (0-1, 1-2, 2-3)
        duration: 900, // total duration for one complete cycle
        useNativeDriver: true,
      })
    ).start()
  }, [animation])

  // Each dot's opacity is determined by its position in the cycle.
  const dot1Opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
    extrapolate: "clamp",
  })
  const dot2Opacity = animation.interpolate({
    inputRange: [1, 1.5, 2],
    outputRange: [0.3, 1, 0.3],
    extrapolate: "clamp",
  })
  const dot3Opacity = animation.interpolate({
    inputRange: [2, 2.5, 3],
    outputRange: [0.3, 1, 0.3],
    extrapolate: "clamp",
  })

  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
      <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
      <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
    </View>
  )
}

export const ChatScreen: FC<ChatProps<"Chat">> = function ChatScreen(_props) {
  const [messages, setMessages] = useState<any[]>([])
  const [isTyping, setIsTyping] = useState(false)

  // Initialize chat with a welcome message from the chatbot.
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ])
  }, [])

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      textStyle={{
        right: { color: "#333333" },
      }}
      wrapperStyle={{
        right: { backgroundColor: "#FFFFFF" },
        left: { backgroundColor: "#49c5b1", marginLeft: -40 },
      }}
      renderTime={(props: any) => (
        <Time
          {...props}
          timeTextStyle={{ right: { color: "#333333" }, left: { color: "#333333" } }}
        />
      )}
    />
  )

  const onSend = useCallback(async (newMessages: any[] = []) => {
    // Append the user's message.
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    const userMessage = newMessages[0].text

    setIsTyping(true)
    try {
      // Call Azure OpenAI directly.
      const response = await sendToAzureOpenAI(userMessage)
      // Assuming response.choices[0].message.content holds the reply.
      const botReply = response.choices[0].message.content

      // Create a message object for the chatbot's response.
      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: botReply,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: "https://placeimg.com/140/140/any",
        },
      }
      // Append the chatbot's message to the conversation.
      setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]))
    } catch (error) {
      console.error("Error calling Azure OpenAI:", error)
    } finally {
      setIsTyping(false)
    }
  }, [])

  const renderFooter = () => (isTyping ? <TypingIndicator /> : null)

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderFooter={renderFooter}
        messagesContainerStyle={{
          backgroundColor: "#F5F5F5",
          paddingBottom: 20,
          paddingLeft: 0,
        }}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  typingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#aaa",
    marginHorizontal: 3,
  },
})

export default ChatScreen
