import React, { FC } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Header, Screen, Text } from "../components"
import { TabScreenProps } from "../navigators/types"
import { useAppTheme } from "../utils/useAppTheme"
import { LogsNavigator } from "../navigators/LogsNavigator"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { VitalsLogger } from "../screens/VitalsLogger"
import { DietLogger } from "../screens/DietLogger"
import { ActivityLogger } from "../screens/ActivityLogger"

export const LogsScreen: FC<TabScreenProps<"Logs">> = function LogsScreen() {
  const { 
    theme: { colors, spacing },
    themed 
  } = useAppTheme()
  const { bottom } = useSafeAreaInsets()

  return (
    <View style={$container}>
      <Header
        title="Health Tracker"
        titleMode="center"
        titleStyle={$headerTitle}
        backgroundColor={colors.background}
      />
      <View style={[$navigatorContainer, { marginBottom: bottom }]}>
        <LogsNavigator />
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
}

const $headerTitle: TextStyle = {
  fontWeight: "bold",
}

const $navigatorContainer: ViewStyle = {
  flex: 1,
}