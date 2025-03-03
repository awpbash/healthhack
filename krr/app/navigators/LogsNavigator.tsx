import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { VitalsLoggerScreen } from "../screens/VitalsLogger"
import { ActivityLoggerScreen } from "../screens/ActivityLogger"
import { DietLoggerScreen } from "../screens/DietLogger"
import { useAppTheme } from "../utils/useAppTheme"
import { translate } from "../i18n"
import { LogsTabParamList } from "../navigators/types"

// Create navigator with proper typing
const LogsTab = createMaterialTopTabNavigator<LogsTabParamList>()

export function LogsNavigator() {
  const { theme } = useAppTheme()

  return (
    <LogsTab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.colors.background },
        tabBarIndicatorStyle: { backgroundColor: theme.colors.tint },
        tabBarActiveTintColor: theme.colors.tint,
        tabBarInactiveTintColor: theme.colors.textDim,
        swipeEnabled: false,
      }}
    >
      <LogsTab.Screen
        name="Vitals"
        component={VitalsLoggerScreen}
        options={{
          // Use hardcoded string instead of translate until you add the translation keys
          tabBarLabel: "Vitals"
          // Alternatively, add the keys to your i18n files and use:
          // tabBarLabel: translate("logsNavigator.vitalsTab")
        }}
      />
      <LogsTab.Screen
        name="Activity"
        component={ActivityLoggerScreen}
        options={{ 
          tabBarLabel: "Activity" 
          // tabBarLabel: translate("logsNavigator.activityTab") 
        }}
      />
      <LogsTab.Screen
        name="Diet"
        component={DietLoggerScreen}
        options={{ 
          tabBarLabel: "Diet" 
          // tabBarLabel: translate("logsNavigator.dietTab") 
        }}
      />
    </LogsTab.Navigator>
  )
}
