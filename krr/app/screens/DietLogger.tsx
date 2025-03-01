import { FC, useState } from "react"
import { ViewStyle } from "react-native"
import { Screen, TextField, Icon, Button } from "@/components"
import { $styles } from "@/theme"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import theme from "@/theme/theme"
import { ThemeProvider } from "@shopify/restyle"
import { DietLoggerProps } from "@/navigators/types"

export const DietLoggerScreen: FC<DietLoggerProps> = function DietLoggerScreen(_props) {
  const { themed } = useAppTheme()

  const [servings_of_vege_and_fruit, set_servings_of_vege_and_fruit] = useState("")
  const [wholegrains, set_whole_grains] = useState("")
  const [sugary_beverages, set_sugary_beverages] = useState("")
  const [dessert, set_dessert] = useState("")
  const [log, set_log] = useState("")

  return (
    <ThemeProvider theme={theme}>
      <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={[]}>
        <TextField
          value={servings_of_vege_and_fruit}
          onChangeText={set_servings_of_vege_and_fruit}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="dietLoggerScreen:vegeFruitLabel"
          placeholderTx="dietLoggerScreen:vegeFruitPlaceholder"
        />
        <TextField
          value={wholegrains}
          onChangeText={set_whole_grains}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="dietLoggerScreen:wholegrainLabel"
          placeholderTx="dietLoggerScreen:wholegrainPlaceholder"
        />
        <TextField
          value={sugary_beverages}
          onChangeText={set_sugary_beverages}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="dietLoggerScreen:sugaryBeveragesLabel"
          placeholderTx="dietLoggerScreen:sugaryBeveragesPlaceholder"
        />
        <TextField
          value={dessert}
          onChangeText={set_dessert}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="dietLoggerScreen:dessertLabel"
          placeholderTx="dietLoggerScreen:dessertPlaceholder"
        />
        <TextField
          value={log}
          onChangeText={set_log}
          labelTx="dietLoggerScreen:logLabel"
          labelTxOptions={{ prop: "label" }}
          helperTx="demoTextField:useCase.passingContent.supportsMultiline.helper"
          helperTxOptions={{ prop: "helper" }}
          placeholderTx="dietLoggerScreen:logPlaceholder"
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
export const DietLogger = DietLoggerScreen
