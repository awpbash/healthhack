import { FC, useState } from "react"
import { ViewStyle, View } from "react-native"
import { Screen, Button } from "@/components"
import { $styles } from "@/theme"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import theme from "@/theme/theme"
import { ThemeProvider } from "@shopify/restyle"
import { SelectField } from "@/components/SelectField"
import { ActivityLoggerProps } from "@/navigators/types"

export const ActivityLoggerScreen: FC<ActivityLoggerProps> = function ActivityLoggerScreen(_props) {
  const { themed } = useAppTheme()

  const [selected_activity, set_selected_activity] = useState<string[]>([])
  const activities = [
    { label: "Run", value: "Run" },
    { label: "Swim", value: "Swim" },
    { label: "Cycle", value: "Cycle" },
    { label: "Pilates", value: "Pilates" },
    { label: "Gym", value: "Gym" },
  ]
  const [selected_time, set_selected_time] = useState<string[]>([])
  const times = [...Array(30).keys()].map((ind) => {
    return {
      label: `${ind * 5}min`,
      value: `${ind * 5}`,
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={[]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "65%" }}>
            <SelectField
              label="Activity"
              helper="Select your activity"
              placeholder="e.g. Run"
              value={selected_activity}
              onSelect={set_selected_activity}
              options={activities}
              multiple={false}
              containerStyle={{ marginBottom: theme.spacing.lg, width: "100%" }}
            />
          </View>
          <View style={{ width: "30%" }}>
            <SelectField
              label="Time"
              helper="How long?"
              placeholder="e.g. 5min"
              value={selected_time}
              onSelect={set_selected_time}
              options={times}
              multiple={false}
              containerStyle={{ marginBottom: theme.spacing.lg, width: "100%" }}
            />
          </View>
        </View>
        <Button preset="filled">{"Submit"}</Button>
      </Screen>
    </ThemeProvider>
  )
}

const $textField: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 10,
})

// Export the old name for backward compatibility
export const ActivityLogger = ActivityLoggerScreen
