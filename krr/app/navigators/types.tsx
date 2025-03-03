import { NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, RouteProp, NavigationProp } from "@react-navigation/native"

// Define the AppStack navigator params (from your existing AppNavigator)
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  Tabs: NavigatorScreenParams<TabParamList>
  // Add any other root stack screens here
}

// Main bottom tab navigator param list (renamed from DemoTabParamList for clarity)
export type TabParamList = {
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  Profile: undefined
  Logs: NavigatorScreenParams<LogsTabParamList>
  DashboardScreen: undefined
  DemoDebug: undefined
}

// For backward compatibility
export type DemoTabParamList = TabParamList

// Logs material top tab navigator param list
export type LogsTabParamList = {
  Vitals: undefined
  Activity: undefined
  Diet: undefined
}

// Helper screen prop types
export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

// Define simpler individual props types to avoid complex nested composite types
export type VitalsLoggerProps = {
  navigation: NavigationProp<LogsTabParamList, 'Vitals'> & {
    getParent<T = NavigationProp<TabParamList, 'Logs'>>(name?: string): T;
  };
  route: RouteProp<LogsTabParamList, 'Vitals'>;
}

export type ActivityLoggerProps = {
  navigation: NavigationProp<LogsTabParamList, 'Activity'> & {
    getParent<T = NavigationProp<TabParamList, 'Logs'>>(name?: string): T;
  };
  route: RouteProp<LogsTabParamList, 'Activity'>;
}

export type DietLoggerProps = {
  navigation: NavigationProp<LogsTabParamList, 'Diet'> & {
    getParent<T = NavigationProp<TabParamList, 'Logs'>>(name?: string): T;
  };
  route: RouteProp<LogsTabParamList, 'Diet'>;
}

// A simpler LogsScreenProps type that avoids the complex CompositeScreenProps
export type LogsScreenProps = TabScreenProps<'Logs'>;