import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "@/i18n"
import { DemoShowroomScreen, DemoDebugScreen } from "../screens"
import { VitalsLogger } from "@/screens/VitalsLogger"
<<<<<<< HEAD:krr/app/navigators/DemoNavigator.tsx
import { ProfileScreen } from "@/screens/ProfileScreen"
=======
import { ActivityLogger } from "@/screens/ActivityLogger"
>>>>>>> origin/main:krr/app/navigators/TabNavigator.tsx
import { DemoPodcastListScreen } from "../screens/DemoPodcastListScreen"
import type { ThemedStyle } from "@/theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { useAppTheme } from "@/utils/useAppTheme"
import { DietLogger } from "@/screens/DietLogger"

<<<<<<< HEAD:krr/app/navigators/DemoNavigator.tsx
// Keep the existing param list structure but rename DemoCommunity to Profile
export type DemoTabParamList = {
=======
export type TabParamList = {
  DemoCommunity: undefined
>>>>>>> origin/main:krr/app/navigators/TabNavigator.tsx
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  Profile: undefined  // Only changing this name
  VitalsLogger: undefined
<<<<<<< HEAD:krr/app/navigators/DemoNavigator.tsx
  DemoPodcastList: undefined
  DemoDebug: undefined
=======
  ActivityLogger: undefined
  DietLogger: undefined
  Chat: undefined
  Dashboard: undefined
>>>>>>> origin/main:krr/app/navigators/TabNavigator.tsx
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type DemoTabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<TabParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 */
export function TabNavigator() {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { height: bottom + 70 }]),
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarItemStyle: themed($tabBarItem),
      }}
    >
      <Tab.Screen
        name="DemoShowroom"
        component={DemoShowroomScreen}
        options={{
          tabBarLabel: translate("demoNavigator:componentsTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="components" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"  // Changed from DemoCommunity to Profile
        component={ProfileScreen}
        options={{
          tabBarLabel: translate("demoNavigator:profileTab"),  // Use profileTab instead of communityTab
          tabBarIcon: ({ focused }) => (
            <Icon icon="community" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="VitalsLogger"
        component={VitalsLogger}
        options={{
          tabBarLabel: translate("demoNavigator:loggerTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="menu" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="ActivityLogger"
        component={ActivityLogger}
        options={{
          tabBarLabel: translate("demoNavigator:loggerTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="menu" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="DietLogger"
        component={DietLogger}
        options={{
          tabBarLabel: translate("demoNavigator:loggerTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="menu" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="DemoPodcastList"
        component={DemoPodcastListScreen}
        options={{
          tabBarAccessibilityLabel: translate("demoNavigator:podcastListTab"),
          tabBarLabel: translate("demoNavigator:podcastListTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="podcast" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="DemoDebug"
        component={DemoDebugScreen}
        options={{
          tabBarLabel: translate("demoNavigator:debugTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="debug" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  color: colors.text,
})
