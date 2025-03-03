/* eslint-disable react-native/no-color-literals */
import { FC, useState } from "react"
import {
  ViewStyle,
  View,
  Text as RNText,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native"
import { Screen, Button, Text } from "@/components"
import { $styles } from "@/theme"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import theme from "@/theme/theme"
import { ThemeProvider } from "@shopify/restyle"
import { ActivityLoggerProps } from "@/navigators/types"

export const ActivityLoggerScreen: FC<ActivityLoggerProps> = function ActivityLoggerScreen(_props) {
  const { themed } = useAppTheme()

  const [selectedActivity, setSelectedActivity] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [activityModalVisible, setActivityModalVisible] = useState(false)
  const [timeModalVisible, setTimeModalVisible] = useState(false)

  // Dropdown Options for activities & times
  const activities = [
    { label: "Bodyweight Exercises", value: "Bodyweight Exercises" },
    { label: "Cycle", value: "Cycle" },
    { label: "High Intensity Interval Training", value: "High Intensity Interval Training" },
    { label: "Pilates", value: "Pilates" },
    { label: "Run", value: "Run" },
    { label: "Swim", value: "Swim" },
    { label: "Tai Chi", value: "Tai Chi" },
    { label: "Walk", value: "Walk" },
    { label: "Yoga", value: "Yoga" },
    { label: "Dance Fitness", value: "Dance Fitness" },
  ]

  const times = [...Array(36).keys()].map((ind) => {
    return {
      label: `${(ind + 1)* 5}min`,
      value: `${(ind + 1) * 5}`,
    }
  })

  // label getters
  const getActivityLabel = () => {
    const activity = activities.find((a) => a.value === selectedActivity)
    return activity ? activity.label : "e.g. Run"
  }

  const getTimeLabel = () => {
    const time = times.find((t) => t.value === selectedTime)
    return time ? time.label : "e.g. 5min"
  }

  // handle selection
  const selectActivity = (value: string) => {
    setSelectedActivity(value)
    setActivityModalVisible(false)
  }

  const selectTime = (value: string) => {
    setSelectedTime(value)
    setTimeModalVisible(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={[]}>
        <View style={styles.row}>
          <View style={styles.activityContainer}>
            <Text style={styles.label}>Activity</Text>
            <RNText style={styles.helperText}>Select your activity</RNText>
            <TouchableOpacity style={styles.selector} onPress={() => setActivityModalVisible(true)}>
              <RNText style={styles.selectorText}>{getActivityLabel()}</RNText>
              <RNText style={styles.dropdownIcon}>▼</RNText>
            </TouchableOpacity>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.label}>Time</Text>
            <RNText style={styles.helperText}>How long?</RNText>
            <TouchableOpacity style={styles.selector} onPress={() => setTimeModalVisible(true)}>
              <RNText style={styles.selectorText}>{getTimeLabel()}</RNText>
              <RNText style={styles.dropdownIcon}>▼</RNText>
            </TouchableOpacity>
          </View>
        </View>

        <Button preset="filled">{"Add"}</Button>

        {/* Activity Selection Modal */}
        <Modal
          transparent={true}
          visible={activityModalVisible}
          animationType="fade"
          onRequestClose={() => setActivityModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setActivityModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <FlatList
                data={activities}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => selectActivity(item.value)}
                  >
                    <RNText style={styles.modalItemText}>{item.label}</RNText>
                    {selectedActivity === item.value && <RNText style={styles.checkmark}>✓</RNText>}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Time Selection Modal */}
        <Modal
          transparent={true}
          visible={timeModalVisible}
          animationType="fade"
          onRequestClose={() => setTimeModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setTimeModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <FlatList
                data={times}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => selectTime(item.value)}>
                    <RNText style={styles.modalItemText}>{item.label}</RNText>
                    {selectedTime === item.value && <RNText style={styles.checkmark}>✓</RNText>}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </Screen>
    </ThemeProvider>
  )
}

// Styles
const styles = StyleSheet.create({
  activityContainer: {
    width: "65%",
  },
  checkmark: {
    color: "green",
    fontWeight: "bold",
  },
  dropdownIcon: {
    color: "#666",
    fontSize: 12,
  },
  helperText: {
    color: "#666",
    fontSize: 12,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    maxHeight: "60%",
    padding: 15,
    width: "80%",
  },
  // eslint-disable-next-line react-native/no-color-literals
  modalItem: {
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  modalItemText: {
    fontSize: 16,
  },
  // eslint-disable-next-line react-native/no-color-literals
  modalOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  // eslint-disable-next-line react-native/no-color-literals
  selector: {
    alignItems: "center",
    borderColor: "#ddd",
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  selectorText: {
    color: "#333",
  },
  timeContainer: {
    width: "30%",
  },
})

// Export the old name for backward compatibility
export const ActivityLogger = ActivityLoggerScreen
