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

  return (
    <ThemeProvider theme={theme}>
      <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={[]}>
        <TextField
          value={heart_rate}
          onChangeText={set_heart_rate}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="vitalLoggerScreen:heartRateLabel"
          placeholderTx="vitalLoggerScreen:heartRatePlaceholder"
        />
        <TextField
          value={blood_pressure}
          onChangeText={set_blood_pressure}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="vitalLoggerScreen:bloodPressureLabel"
          placeholderTx="vitalLoggerScreen:bloodPressurePlaceholder"
        />
        <TextField
          value={weight}
          onChangeText={set_weight}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="vitalLoggerScreen:weightLabel"
          placeholderTx="vitalLoggerScreen:weightPlaceholder"
        />
        <TextField
          value={log}
          onChangeText={set_log}
          labelTx="vitalLoggerScreen:logLabel"
          labelTxOptions={{ prop: "label" }}
          helperTx="demoTextField:useCase.passingContent.supportsMultiline.helper"
          helperTxOptions={{ prop: "helper" }}
          placeholderTx="vitalLoggerScreen:logPlaceholder"
          multiline
          RightAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} size={21} />}
        />
        <Button preset="filled">{"Submit"}</Button>
      </Screen>
    </ThemeProvider>
  )
}

const $textField: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 10,
})

// Export the old name for backward compatibility
export const VitalsLogger = VitalsLoggerScreen
