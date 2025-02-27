import { FC, useState } from "react"
import { ViewStyle } from "react-native"
import { Screen, TextField, Icon, Button } from "../components"
import { DemoTabScreenProps } from "../navigators/TabNavigator"
import { $styles } from "../theme"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"

import theme, { Theme } from "@/theme/theme"
import { ThemeProvider} from "@shopify/restyle"

export const VitalsLogger: FC<DemoTabScreenProps<"VitalsLogger">> = function VitalsLogger(_props) {
  const { themed } = useAppTheme()

  const [heart_rate, set_heart_rate] = useState("")
  const [blood_pressure, set_blood_pressure] = useState("")
  const [weight, set_weight] = useState("")
  const [log, set_log] = useState("")

  return (
    <ThemeProvider theme={theme}>
      <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={["top"]}>
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
          // helper={"lol"}
          // status={"lol" ? "error" : undefined}
          // onSubmitEditing={() => authPasswordInput.current?.focus()}
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
          // helper={"lol"}
          // status={"lol" ? "error" : undefined}
          // onSubmitEditing={() => authPasswordInput.current?.focus()}
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
          // helper={"lol"}
          // status={"lol" ? "error" : undefined}
          // onSubmitEditing={() => authPasswordInput.current?.focus()}
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
