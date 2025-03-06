import { FC, useState } from "react"
import { ViewStyle } from "react-native"
import { Screen, TextField, Icon, Button } from "@/components"
import { $styles } from "@/theme"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import theme from "@/theme/theme"
import { ThemeProvider } from "@shopify/restyle"
import { VitalsLoggerProps } from "@/navigators/types"

export const VitalsLoggerScreen: FC<VitalsLoggerProps> = function VitalsLoggerScreen(_props) {
  const { themed } = useAppTheme()

  const [heart_rate, set_heart_rate] = useState("")
  const [blood_pressure, set_blood_pressure] = useState("")
  const [weight, set_weight] = useState("")
  const [log, set_log] = useState("")

  const inputFieldStyle: ViewStyle = {
  }

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
          // RightAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} size={21} />}
        />
        <Button preset="filled">{"Add"}</Button>
      </Screen>
    </ThemeProvider>
  )
}

const $textField: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 10,
    backgroundColor: "#e9e7e3",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
})

// Export the old name for backward compatibility
export const VitalsLogger = VitalsLoggerScreen
