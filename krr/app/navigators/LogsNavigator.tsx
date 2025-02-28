// top tab navigator to switch between Vitals, Activity & Diet forms

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { VitalsLogger } from "../screens/VitalsLogger"
import { ActivityLogger } from "../screens/ActivityLogger"
import { DietLogger } from "../screens/DietLogger"
import { useAppTheme } from "../utils/useAppTheme"
import { translate } from "../i18n"

const LogsTab = createMaterialTopTabNavigator()

export function LogsNavigator() {
  const { theme } = useAppTheme()

  return (
    <LogsTab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.colors.background },
        tabBarIndicatorStyle: { backgroundColor: theme.colors.tint },
        tabBarActiveTintColor: theme.colors.tint,
        tabBarInactiveTintColor: theme.colors.textDim,
      }}
    >
      <LogsTab.Screen
        name="Vitals"
        component={VitalsLogger}
        options={{ tabBarLabel: translate("LogsNavigator:vitalsTab") }}
      />
      <LogsTab.Screen
        name="Activity"
        component={ActivityLogger}
        options={{ tabBarLabel: translate("LogsNavigator:activityTab") }}
      />
      <LogsTab.Screen
        name="Diet"
        component={DietLogger}
        options={{ tabBarLabel: translate("LogsNavigator:dietTab") }}
      />
    </LogsTab.Navigator>
  )
}
