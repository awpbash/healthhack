/* eslint-disable import/no-unresolved */
import { FC, useState } from "react"
import { ViewStyle } from "react-native"
import { Screen, TextField, Icon, Button } from "@/components"
import { $styles } from "@/theme"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import theme from "@/theme/theme"
import { ThemeProvider } from "@shopify/restyle"
import { VitalsLoggerProps } from "@/navigators/types"
import * as Api from "@/services/api/api"

export const VitalsLoggerScreen: FC<VitalsLoggerProps> = function VitalsLoggerScreen(_props) {
  const { themed } = useAppTheme()

  const [heart_rate, set_heart_rate] = useState("")
  const [blood_pressure, set_blood_pressure] = useState("")
  const [weight, set_weight] = useState("")
  const [log, set_log] = useState("")

  // This function is called when the user presses the "Add" button.
  const handleAdd = async () => {
    try {
      // For this example, we assume:
      // - heart_rate is mapped to PulseRate (converted to number)
      // - blood_pressure is mapped directly to BloodPressure
      // - weight is mapped to Temperature (converted to number)
      // - We generate Datetime automatically
      const vitalsData = {
        User_ID: "5", // Replace with your actual user id
        Temperature: parseFloat(weight), // or adjust as needed
        BloodPressure: blood_pressure,
        PulseRate: parseFloat(heart_rate),
        Datetime: new Date().toISOString(),
      }

      const response = await Api.insertVitals(vitalsData)
      console.log("Vitals inserted successfully:", response)

      // Optionally, clear the fields after insertion
      set_heart_rate("")
      set_blood_pressure("")
      set_weight("")
      set_log("")
    } catch (error) {
      console.error("Error inserting vitals:", error)
    }
  }

  const inputFieldStyle: ViewStyle = {}

  return (
    <ThemeProvider theme={theme}>
      <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={[]}>
        <TextField
          value={heart_rate}
          onChangeText={set_heart_rate}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="numeric"
          labelTx="vitalLoggerScreen:heartRateLabel"
          placeholderTx="vitalLoggerScreen:heartRatePlaceholder"
        />
        <TextField
          value={blood_pressure}
          onChangeText={set_blood_pressure}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="numeric"
          labelTx="vitalLoggerScreen:bloodPressureLabel"
          placeholderTx="vitalLoggerScreen:bloodPressurePlaceholder"
        />
        <TextField
          value={weight}
          onChangeText={set_weight}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="numeric"
          labelTx="vitalLoggerScreen:weightLabel"
          placeholderTx="vitalLoggerScreen:weightPlaceholder"
        />
        <TextField
          value={log}
          onChangeText={set_log}
          labelTx="vitalLoggerScreen:logLabel"
          labelTxOptions={{ prop: "label" }}
          helperTxOptions={{ prop: "helper" }}
          placeholderTx="vitalLoggerScreen:logPlaceholder"
          multiline
          style={{ minHeight: 40, maxHeight: 120 }}
          containerStyle={themed($textField)}
        />
        <Button preset="filled" onPress={handleAdd}>
          {"Add"}
        </Button>
      </Screen>
    </ThemeProvider>
  )
}

const $textField: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 10,
  padding: 12,
})

// Export the old name for backward compatibility
export const VitalsLogger = VitalsLoggerScreen
