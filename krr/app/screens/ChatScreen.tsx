import React, { FC, useState, useCallback, useEffect } from "react"
import { GiftedChat, Bubble, Time } from "react-native-gifted-chat"
import { ChatProps } from "@/navigators/types"

export const ChatScreen: FC<ChatProps<"Chat">> = function ChatScreen(_props) {
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ])
  }, [])

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: { color: "#333333" },
        }}
        wrapperStyle={{
          right: { backgroundColor: "#FFFFFF" },
          left: { backgroundColor: "#49c5b1", marginLeft: -40 },
        }}
        renderTime={(props: any) => {
          return (
            <Time
              {...props}
              timeTextStyle={{ right: { color: "#333333" }, left: { color: "#333333" } }}
            />
          )
        }}
      />
    )
  }

  const onSend = useCallback((messages: any[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    <GiftedChat
      messages={messages}
      renderBubble={renderBubble}
      messagesContainerStyle={{ backgroundColor: "#F5F5F5", paddingBottom: 20, paddingLeft: 0 }}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}
export default ChatScreen
