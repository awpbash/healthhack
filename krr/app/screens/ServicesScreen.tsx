import React, { FC } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native"

// Navigation and theming imports
import { Screen, Text } from "../components"
import { useAppTheme } from "@/utils/useAppTheme"
import theme from "@/theme/theme"
import { ThemeProvider } from "@shopify/restyle"
import type { ThemedStyle } from "@/theme"

// Navigation types
import { DemoTabScreenProps } from "../navigators/TabNavigator"

export const ServicesScreen: FC<DemoTabScreenProps<"Services">> = function ServicesScreen({ navigation }) {
  const { themed } = useAppTheme()

  return (
    <ThemeProvider theme={theme}>
      <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={["top"]}>
        {/* Header */}
        <View style={$styles.row}>
          <Text preset="heading" text="Services" style={{ flex: 1 }} />
        </View>

        {/* Popular Services Section */}
        <Text preset="subheading" text="Popular Services" style={themed($sectionTitle)} />
        
        <View style={themed($servicesGrid)}>
          {/* COVID-19 Records */}
          <TouchableOpacity 
            style={themed($serviceItem)}
          >
            <View style={themed($iconContainerGreen)}>
              <Text style={themed($iconText)}>💉</Text>
            </View>
            <View style={themed($serviceTextContainer)}>
              <Text text="COVID-19" style={themed($serviceText)} />
              <Text text="records" style={themed($serviceText)} />
            </View>
          </TouchableOpacity>

          {/* Lab Reports */}
          <TouchableOpacity 
            style={themed($serviceItem)}
          >
            <View style={themed($iconContainerGreen)}>
              <Text style={themed($iconText)}>📋</Text>
            </View>
            <Text text="Lab reports" style={themed($serviceText)} />
          </TouchableOpacity>

          {/* Payment */}
          <TouchableOpacity 
            style={themed($serviceItem)}
          >
            <View style={themed($iconContainerBlue)}>
              <Text style={themed($iconText)}>💳</Text>
            </View>
            <Text text="Payment" style={themed($serviceText)} />
          </TouchableOpacity>

          {/* Medication Refill */}
          <TouchableOpacity 
            style={themed($serviceItem)}
          >
            <View style={themed($iconContainerOrange)}>
              <Text style={themed($iconText)}>💊</Text>
            </View>
            <View style={themed($serviceTextContainer)}>
              <Text text="Medication" style={themed($serviceText)} />
              <Text text="refill" style={themed($serviceText)} />
            </View>
          </TouchableOpacity>

          {/* Health Screening */}
          <TouchableOpacity 
            style={themed($serviceItem)}
          >
            <View style={themed($iconContainerOrange)}>
              <Text style={themed($iconText)}>🩺</Text>
            </View>
            <View style={themed($serviceTextContainer)}>
              <Text text="Health" style={themed($serviceText)} />
              <Text text="screening" style={themed($serviceText)} />
            </View>
          </TouchableOpacity>

          {/* CHAS */}
          <TouchableOpacity 
            style={themed($serviceItem)}
          >
            <View style={themed($iconContainerBlue)}>
              <View style={themed($chasContainer)}>
                <Text text="CHAS" style={themed($chasText)} />
              </View>
            </View>
            <Text text="CHAS" style={themed($serviceText)} />
          </TouchableOpacity>
        </View>

        {/* Services Categories */}
        <Text preset="subheading" text="Services Categories" style={themed($sectionTitle)} />
        
        <View style={themed($categoriesContainer)}>
          {/* Healthier SG */}
          <TouchableOpacity 
            style={themed($categoryCard)}
          >
            <View style={themed($categoryIconBlue)}>
              <Text style={themed($iconText)}>❤️</Text>
              <Text text="HealthierSG" style={themed($healthierSGText)} />
            </View>
            <Text text="Healthier SG" style={themed($categoryText)} />
          </TouchableOpacity>

          {/* Appointments */}
          <TouchableOpacity 
            style={themed($categoryCard)}
          >
            <View style={themed($categoryIconBlue)}>
              <Text style={themed($iconText)}>📅</Text>
            </View>
            <Text text="Appointments" style={themed($categoryText)} />
          </TouchableOpacity>
        </View>

        <View style={themed($categoriesContainer)}>
          {/* Medications */}
          <TouchableOpacity 
            style={themed($categoryCard)}
          >
            <View style={themed($categoryIconBlue)}>
              <Text style={themed($iconText)}>💊</Text>
            </View>
            <Text text="Medications" style={themed($categoryText)} />
          </TouchableOpacity>

          {/* Payments & Financials */}
          <TouchableOpacity 
            style={themed($categoryCard)}
          >
            <View style={themed($categoryIconBlue)}>
              <Text style={themed($iconText)}>💸</Text>
            </View>
            <View style={themed($paymentTextContainer)}>
              <Text text="Payments" style={themed($categoryText)} />
              <Text text="& financials" style={themed($categoryText)} />
            </View>
          </TouchableOpacity>
        </View>
      </Screen>
    </ThemeProvider>
  )
}

// Styles
const $styles = {
  container: {},
  row: {}
}

// Theming and Style Definitions
const $iconText: ThemedStyle<TextStyle> = () => ({
  fontSize: 30,
  textAlign: 'center',
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.lg,
  marginBottom: spacing.sm,
})

const $servicesGrid: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
})

const $serviceItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "33%",
  alignItems: "center",
  marginBottom: spacing.lg,
})

const $iconContainerGreen: ThemedStyle<ViewStyle> = () => ({
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: "#E8F5E9",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 8,
})

const $iconContainerBlue: ThemedStyle<ViewStyle> = () => ({
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: "#E3F2FD",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 8,
})

const $iconContainerOrange: ThemedStyle<ViewStyle> = () => ({
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: "#FFF3E0",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 8,
})

const $serviceTextContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
})

const $serviceText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  textAlign: "center",
  color: colors.text,
})

const $chasContainer: ThemedStyle<ViewStyle> = () => ({
  width: 40,
  height: 25,
  borderWidth: 1,
  borderColor: "#0277BD",
  borderRadius: 4,
  justifyContent: "center",
  alignItems: "center",
})

const $chasText: ThemedStyle<TextStyle> = () => ({
  color: "#0277BD",
  fontWeight: "bold",
  fontSize: 12,
})

const $categoriesContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: spacing.md,
})

const $categoryCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "48%",
  height: 180,
  backgroundColor: "#F5F5F5",
  borderRadius: 16,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.sm,
})

const $categoryIconBlue: ThemedStyle<ViewStyle> = () => ({
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: "#E3F2FD",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 16,
})

const $categoryText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 18,
  fontWeight: "600",
  textAlign: "center",
  color: colors.text,
})

const $healthierSGText: ThemedStyle<TextStyle> = () => ({
  fontSize: 8,
  fontWeight: "700",
  color: "#0277BD",
  transform: [{ rotate: "-45deg" }],
})

const $paymentTextContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
})

export default ServicesScreen