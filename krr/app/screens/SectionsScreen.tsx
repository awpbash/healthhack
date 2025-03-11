// import React, { FC, useState, useCallback, useEffect, useRef } from "react"
// import { GiftedChat, Bubble, Time } from "react-native-gifted-chat"
// import { View, Text, Animated, StyleSheet } from "react-native"
// import { ChatProps, SectionProps } from "@/navigators/types"

// export const SectionScreen: FC<SectionProps<"Section">> = function SectionScreen(_props) {
//   const [messages, setMessages] = useState<any[]>([])
//   const [isTyping, setIsTyping] = useState(false)

//   // Initialize chat with a welcome message from the chatbot.
//   useEffect(() => {
//     setMessages([
//       {
//         _id: 1,
//         text: "Hello developer",
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: "Chatbot",
//           avatar: "https://placeimg.com/140/140/any",
//         },
//       },
//     ])
//   }, [])

//   const renderBubble = (props: any) => (
//     <Bubble
//       {...props}
//       textStyle={{
//         right: { color: "#333333" },
//       }}
//       wrapperStyle={{
//         right: { backgroundColor: "#FFFFFF" },
//         left: { backgroundColor: "#49c5b1", marginLeft: -40 },
//       }}
//       renderTime={(props: any) => (
//         <Time
//           {...props}
//           timeTextStyle={{ right: { color: "#333333" }, left: { color: "#333333" } }}
//         />
//       )}
//     />
//   )

//   return (
//     <View style={{ flex: 1 }}>
//       <GiftedChat
//         messages={messages}
//         renderBubble={renderBubble}
//         messagesContainerStyle={{
//           backgroundColor: "#F5F5F5",
//           paddingBottom: 20,
//           paddingLeft: 0,
//         }}
//         user={{ _id: 1 }}
//       />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   typingContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 10,
//   },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: "#aaa",
//     marginHorizontal: 3,
//   },
// })

// export default SectionScreen
