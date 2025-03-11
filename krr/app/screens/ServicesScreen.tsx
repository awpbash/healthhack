import React, { FC } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, Image, ImageStyle } from "react-native"

// Navigation and theming imports
import { Screen, Text } from "../components"
import { useAppTheme } from "@/utils/useAppTheme"
import theme from "@/theme/theme"
import { ThemeProvider } from "@shopify/restyle"
import { $styles } from "@/theme"
import type { ThemedStyle } from "@/theme"

// Navigation types
import { DemoTabScreenProps } from "../navigators/TabNavigator"

export const ServicesScreen: FC<DemoTabScreenProps<"Services">> = function ServicesScreen({
  navigation,
}) {
  const { themed } = useAppTheme()

  // Service Item Component
  const ServiceItem = ({ icon, label, color, zoom = 1.0 }) => (
    <TouchableOpacity style={themed($serviceItem)}>
      <View style={[themed($iconContainer), { backgroundColor: color }]}>
        <View style={themed($iconImageContainer)}>
          <Image
            source={icon}
            style={[
              $iconImage,
              {
                transform: [{ scale: zoom }],
              },
            ]}
            resizeMode="cover"
          />
        </View>
      </View>
      <View style={themed($serviceTextContainer)}>
        {label.includes(" ") ? (
          <>
            <Text text={label.split(" ")[0]} style={themed($serviceText)} />
            <Text text={label.split(" ")[1]} style={themed($serviceText)} />
          </>
        ) : (
          <Text text={label} style={themed($serviceText)} />
        )}
      </View>
    </TouchableOpacity>
  )

  // Category Card Component
  const CategoryCard = ({ icon, label, color = "#E3F2FD", zoom = 1.0 }) => (
    <TouchableOpacity style={themed($categoryCard)}>
      <View style={[themed($categoryIcon), { backgroundColor: color }]}>
        <View style={themed($categoryImageContainer)}>
          <Image
            source={icon}
            style={[
              $categoryIconImage,
              {
                transform: [{ scale: zoom }],
              },
            ]}
            resizeMode="cover"
          />
        </View>
      </View>
      <View style={themed($serviceTextContainer)}>
        {label.includes(" & ") ? (
          <>
            <Text text={label.split(" & ")[0]} style={themed($categoryText)} />
            <Text text={"& " + label.split(" & ")[1]} style={themed($categoryText)} />
          </>
        ) : (
          <Text text={label} style={themed($categoryText)} />
        )}
      </View>
    </TouchableOpacity>
  )

  // Sample icons (replace with your actual local images)
  // For local images, you'll need to use require()

  // Sample icons (replace with your actual local images)
  // For local images, you'll need to use require()
  const icons = {
    asthmaControlTest: require("@/components/act.png"),
    cancerRiskCalculator: require("@/components/calculator.png"),
    smokingCessation: require("@/components/smokingcessation.png"),
    medication: require("@/components/medication.png"),
    healthScreening: require("@/components/healthscreening.png"),
    chas: require("@/components/chas.png"),
    healthierSG: require("@/components/healthierSG.png"),
    appointments: require("@/components/act.png"),
    medications: require("@/components/act.png"),
    paymentFinancials: require("@/components/act.png"),
  }

  // Light color variants based on the app's primary teal color (#49c5b1)
  const colorVariants = {
    lightTeal: "#E7F7F5", // Light teal (primary)
    lightBlue: "#E3F2FD", // Light blue
    lightOrange: "#FFF3E0", // Light orange
    lightGreen: "#E8F5E9", // Light green
  }

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
          {/* ACT */}
          <ServiceItem
            icon={icons.asthmaControlTest}
            label="Asthma Control Test"
            color={colorVariants.lightTeal}
            zoom={1.5} /* Adjust this value to control zoom level */
          />

          {/* Cancer Risk Calculator */}
          <ServiceItem
            icon={icons.cancerRiskCalculator}
            label="Cancer Risk Calculator"
            color={colorVariants.lightTeal}
            zoom={1.5}
          />

          {/* Smoking Cessation */}
          <ServiceItem
            icon={icons.smokingCessation}
            label="Smoking Cessation"
            color={colorVariants.lightTeal}
            zoom={1.5}
          />

          {/* Medication Refill - Your inhaler image */}
          <ServiceItem
            icon={icons.medication}
            label="Medication refill"
            color={colorVariants.lightTeal}
            zoom={1.1} /* Higher zoom for the inhaler image */
          />

          {/* Health Screening */}
          <ServiceItem
            icon={icons.healthScreening}
            label="Health screening"
            color={colorVariants.lightTeal}
            zoom={1.4}
          />

          {/* CHAS */}
          <ServiceItem icon={icons.chas} label="CHAS" color={colorVariants.lightTeal} zoom={1.7} />
        </View>

        {/* Services Categories */}
        <Text preset="subheading" text="Services Categories" style={themed($sectionTitle)} />

        <View style={themed($categoriesContainer)}>
          {/* Healthier SG */}
          <CategoryCard
            icon={icons.healthierSG}
            label="Healthier SG"
            color={colorVariants.lightTeal}
            zoom={1.5}
          />

          {/* Appointments */}
          <CategoryCard
            icon={icons.appointments}
            label="Appointments"
            color={colorVariants.lightTeal}
            zoom={1.5}
          />
        </View>

        <View style={themed($categoriesContainer)}>
          {/* Medications - Your inhaler image */}
          <CategoryCard
            icon={icons.medications}
            label="Medications"
            color={colorVariants.lightTeal}
            zoom={1.8} /* Higher zoom for the inhaler image */
          />

          {/* Payments & Financials */}
          <CategoryCard
            icon={icons.paymentFinancials}
            label="Payments & financials"
            color={colorVariants.lightTeal}
            zoom={1.5}
          />
        </View>
      </Screen>
    </ThemeProvider>
  )
}

// Styles
const $iconImageContainer: ThemedStyle<ViewStyle> = () => ({
  width: 50,
  height: 50,
  borderRadius: 25,
  overflow: "hidden",
  justifyContent: "center",
  alignItems: "center",
})

const $categoryImageContainer: ThemedStyle<ViewStyle> = () => ({
  width: 70,
  height: 70,
  borderRadius: 35,
  overflow: "hidden",
  justifyContent: "center",
  alignItems: "center",
})

const $iconImage: ImageStyle = {
  width: 50,
  height: 50,
}

const $categoryIconImage: ImageStyle = {
  width: 70,
  height: 70,
}

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
  marginBottom: spacing.sm,
  padding: spacing.md,
  backgroundColor: "white",
  borderRadius: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 2,
})

const $iconContainer: ThemedStyle<ViewStyle> = () => ({
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3,
})

const $serviceTextContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
})

const $serviceText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 14,
  textAlign: "center",
  color: colors.text,
  fontFamily: typography?.primary?.normal,
})

const $categoriesContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: spacing.md,
})

const $categoryCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  width: "48%",
  height: 180,
  backgroundColor: "white",
  borderRadius: 16,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.sm,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
})

const $categoryIcon: ThemedStyle<ViewStyle> = () => ({
  width: 80,
  height: 80,
  borderRadius: 40,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 16,
  shadowRadius: 3,
  shadowOpacity: 0.2,
  elevation: 2,
})

const $categoryText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 16,
  fontWeight: "600",
  textAlign: "center",
  color: colors.text,
  fontFamily: typography?.primary?.medium,
})

export default ServicesScreen
