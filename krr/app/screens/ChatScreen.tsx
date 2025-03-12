import React, { FC, useState, useCallback, useEffect, useRef } from "react"
import { GiftedChat, Bubble, Time } from "react-native-gifted-chat"
import { View, Text, Animated, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { ChatProps } from "@/navigators/types"
import * as Api from "@/services/api/api"
import { get_prompt } from "@/services/api/prompt"

// Azure OpenAI configuration
const AZURE_OPENAI_API_KEY =
  "FvC65KLeZ0QT9ZvEGDEagkBZN4WtWYE1SpdTJH4J6YooUkWq3gSLJQQJ99BBACHYHv6XJ3w3AAAAACOGCZgz" // WARNING: Exposing API keys in client code is insecure.
const AZURE_OPENAI_ENDPOINT = "https://e0957-m7dhe0bf-eastus2.cognitiveservices.azure.com"
const DEPLOYMENT_NAME = "gpt-4"
const API_VERSION = "2024-08-01-preview"

// Function to call the Azure OpenAI API directly.
const sendToAzureOpenAI = async (userMessage: string) => {
  const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`
  const payload = {
    messages: [{ role: "user", content: userMessage }],
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

//=======================================================================================================
// This section for the typing indicator pubor
const TypingIndicator: FC = () => {
  const animation = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 3, // three phases: 0-1, 1-2, 2-3
        duration: 900, // total duration for one complete cycle
        useNativeDriver: true,
      }),
    ).start()
  }, [animation])
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
//=======================================================================================================

// Define available prompt modes.
const promptModes = [
  { key: "symptom_checker", label: "Symptom Checker" },
  { key: "lifestyle_summary", label: "Lifestyle Summary" },
  { key: "treatment_recommendation", label: "Treatment Rec." },
  { key: "general_conversation", label: "General Chat" },
]

export const ChatScreen: FC<ChatProps<"Chat">> = function ChatScreen(_props) {
  const [messages, setMessages] = useState<any[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState("symptom_checker")

  // Initialize chat with a welcome message.
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello User, Missy here!",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: require("../../assets/images/bot-icon.png"),
        },
      },
    ])
  }, [])

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      textStyle={{ right: { color: "#333333" } }}
      wrapperStyle={{
        right: { backgroundColor: "#FFFFFF" },
        left: { backgroundColor: "#49c5b1", marginLeft: -0 },
      }}
      renderTime={(props: any) => (
        <Time
          {...props}
          timeTextStyle={{ right: { color: "#333333" }, left: { color: "#333333" } }}
        />
      )}
    />
  )

  // Standard onSend for regular chat messages.
  const onSend = useCallback(async (newMessages: any[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages))

    const userMessage = newMessages[0].text
    console.log(userMessage)
    console.log(newMessages)
    if (selectedPrompt === "symptom_checker") {
      //console.log("gaygayagy")
      onSymptomCheck(newMessages)
      return
    }
    if (selectedPrompt === "lifestyle_summary") {
      //console.log("gaygayagy")
      onMedicalSummary(newMessages)
      return
    }
    setIsTyping(true)
    try {
      const response = await sendToAzureOpenAI(userMessage)
      const botReply = response.choices[0].message.content
      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: botReply,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
        },
      }
      setMessages((previousMessages) => GiftedChat.append(previousMessages, [botMessage]))
    } catch (error) {
      console.error("Error calling Azure OpenAI:", error)
    } finally {
      setIsTyping(false)
    }
  }, [])

  // onSymptomCheck retrieves medical records for user "129", builds a combined prompt, and calls Azure OpenAI.
  const onSymptomCheck = useCallback(async (msg: any[]=[]) => {
    // Retrieve the latest user symptom from messages.
    //console.log(msg);
    const latestUserMsg = msg[0].text;
    //console.log(latestUserMsg)
    if (!latestUserMsg) {
      console.warn("No user symptom found.");
      return;
    }
    const symptomText = latestUserMsg;
    // Retrieve medical records for user "129" using your query API.
    let records: any[] = [];
    try {
      console.log(symptomText);
      console.log("gaygaygay")
      records = await Api.queryMedical("129", symptomText);
    } catch (error) {
      console.error("Error retrieving medical records:", error);
    }
    const recordsStr = records
      .map((rec: any) => `${rec.Symptom}: ${rec.Diagnosis} (${rec.Datetime})`)
      .join("\n");
    // Build the combined prompt using the selected prompt mode.
    const additionalContext = `Patient symptoms: ${symptomText}\nPast Medical Records:\n${recordsStr}`;
    const combinedPrompt = get_prompt(selectedPrompt, additionalContext);
    // Add a temporary message indicating evaluation is in progress.
    console.log(combinedPrompt)
    setIsTyping(true);
    try {
      const response = await sendToAzureOpenAI(combinedPrompt);
      const botReply = response.choices[0].message.content;
      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: botReply,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Missy",
          avatar: require("../../assets/images/bot-icon.png")
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [botMessage])
      );
    } catch (error) {
      console.error("Error calling Azure OpenAI for symptom check:", error);
    } finally {
      setIsTyping(false);
    }
  }, [messages, selectedPrompt]);

  const onMedicalSummary = useCallback(async (msg: any[] = []) => {
    const latestUserMsg = msg[0].text;
    if (!latestUserMsg) {
      console.warn("No user message found.");
      return;
    }
    // Use the user's message to query vitals and activity.
    let vitalsRecords: any[] = [];
    let activityRecords: any[] = [];
    try {
      console.log("Medical Summary - Querying Vitals and Activity for:", latestUserMsg);
      vitalsRecords = await Api.queryVitals("129");
      activityRecords = await Api.queryActivity("129");
    } catch (error) {
      console.error("Error retrieving vitals or activity data:", error);
      return;
    }
    // Format the records into strings.
    const vitalsStr = vitalsRecords
      .map((rec: any) => `Temp: ${rec.Temperature}, BP: ${rec.BloodPressure}, Pulse: ${rec.PulseRate} at ${rec.Datetime}`)
      .join("\n");
    const activityStr = activityRecords
      .map((rec: any) => `${rec.Activity} for ${rec.Duration} mins at ${rec.Datetime}`)
      .join("\n");

    // Build the additional context.
    const additionalContext = `Vitals Data:\n${vitalsStr}\n\nActivity Data:\n${activityStr}`;
    // Generate the combined prompt using the selected prompt mode.
    const combinedPrompt = get_prompt(selectedPrompt, additionalContext);
    console.log("Combined prompt for medical_summary:", combinedPrompt);
    setIsTyping(true);
    try {
      const response = await sendToAzureOpenAI(combinedPrompt);
      const botReply = response.choices[0].message.content;
      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: botReply,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Missy",
          avatar: require("../../assets/images/bot-icon.png"),
        },
      };
      setMessages((previousMessages) => GiftedChat.append(previousMessages, [botMessage]));
    } catch (error) {
      console.error("Error calling Azure OpenAI for medical summary:", error);
    } finally {
      setIsTyping(false);
    }
  }, [selectedPrompt]);

  const renderFooter = () => (isTyping ? <TypingIndicator /> : null);

  // Render prompt mode selection UI.
  const renderPromptModes = () => (
    <ScrollView
      horizontal
      contentContainerStyle={styles.promptModesContainer}
      showsHorizontalScrollIndicator={false}
    >
      {promptModes.map((mode) => (
        <TouchableOpacity
          key={mode.key}
          style={[
            styles.promptModeButton,
            selectedPrompt === mode.key && styles.promptModeButtonSelected,
          ]}
          onPress={() => setSelectedPrompt(mode.key)}
        >
          <Text
            style={[
              styles.promptModeButtonText,
              selectedPrompt === mode.key && styles.promptModeButtonTextSelected,
            ]}
          >
            {mode.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.2 }}>{renderPromptModes()}</View>
      {/* Show the Symptom Check button only when "symptom_checker" mode is selected */}
      {selectedPrompt === "symptom_checker"}
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderFooter={renderFooter}
        messagesContainerStyle={styles.messagesContainer}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1 }}
      />
    </View>
  );
};

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
  promptModesContainer: {
    // flexDirection: "row",
    // paddingVertical: 10,
    // paddingHorizontal: 5,
    // justifyContent: "center",
    alignItems: "center",
    // height: "10%"
  },
  promptModeButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  promptModeButtonSelected: {
    backgroundColor: "#49c5b1",
  },
  promptModeButtonText: {
    color: "#333",
    fontSize: 14,
  },
  promptModeButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  symptomButton: {
    backgroundColor: "#49c5b1",
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignSelf: "center",
  },
  symptomButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  messagesContainer: {
    // backgroundColor: "#F5F5F5",
    paddingBottom: 20,
    paddingLeft: 0,
  },
})

export default ChatScreen
