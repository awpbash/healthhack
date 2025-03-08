import React, { useState } from "react"
import { Platform } from "react-native"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from "react-native"
import { LineChart, BarChart } from "react-native-chart-kit"
import type { FC } from "react"
import type { DemoTabScreenProps } from "../navigators/TabNavigator"
import {
  Activity,
  Heart,
  Scale,
  Utensils,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native"
import { Picker } from "@react-native-picker/picker"

import theme from "@/theme/theme"

interface VitalsDataPoint {
  date: string
  heartRate: number
  systolic: number
  diastolic: number
  weight: number
}

interface ActivityDataPoint {
  date: string
  activity: string
  minutes: number
}

interface NutritionDataPoint {
  date: string
  vegetables: number
  fruits: number
  wholeGrains: number
  sugaryBeverages: number
}

// Define types for health metric thresholds
type RangeType = [number, number]
type BloodPressureRangeType = {
  systolic: RangeType
  diastolic: RangeType
}

type ThresholdType = {
  range: RangeType
  message: string
}

type BloodPressureThresholdType = {
  range: BloodPressureRangeType
  message: string
}

// Define types for status and metrics
type StatusType = "good" | "warning" | "danger"
type MetricType = "heartRate" | "bloodPressure" | "weight" | "activity" | "nutrition"

type MetricThresholdsType = {
  heartRate: {
    good: ThresholdType
    warning: ThresholdType
    danger: ThresholdType
  }
  bloodPressure: {
    good: BloodPressureThresholdType
    warning: BloodPressureThresholdType
    danger: BloodPressureThresholdType
  }
  weight: {
    good: ThresholdType
    warning: ThresholdType
    danger: ThresholdType
  }
  activity: {
    good: ThresholdType
    warning: ThresholdType
    danger: ThresholdType
  }
  nutrition: {
    good: ThresholdType
    warning: ThresholdType
    danger: ThresholdType
  }
}

// Define health metric thresholds and feedback messages
const healthMetricThresholds: MetricThresholdsType = {
  heartRate: {
    good: {
      range: [60, 80],
      message: "Your heart rate is in a healthy range. Keep up the good work!",
    },
    warning: {
      range: [50, 90],
      message:
        "Your heart rate is slightly outside the optimal range. Consider monitoring it more closely.",
    },
    danger: {
      range: [0, 200],
      message: "Your heart rate is concerning. Please consult with a healthcare professional.",
    },
  },
  bloodPressure: {
    good: {
      range: { systolic: [90, 120], diastolic: [60, 80] },
      message: "Your blood pressure is in a healthy range. Keep it up!",
    },
    warning: {
      range: { systolic: [120, 140], diastolic: [80, 90] },
      message:
        "Your blood pressure is slightly elevated. Consider lifestyle changes and monitor regularly.",
    },
    danger: {
      range: { systolic: [140, 220], diastolic: [90, 120] },
      message:
        "Your blood pressure readings are concerning. Please consult a healthcare professional.",
    },
  },
  weight: {
    good: {
      range: [50, 80],
      message:
        "Your weight is within a healthy range for your profile. Keep maintaining your healthy habits!",
    },
    warning: {
      range: [45, 90],
      message:
        "Your weight is slightly outside the optimal range. Consider reviewing your diet and exercise routine.",
    },
    danger: {
      range: [0, 150],
      message:
        "Your weight may pose health risks. Consider consulting with a healthcare professional.",
    },
  },
  activity: {
    good: {
      range: [150, 1000],
      message:
        "Great job meeting the recommended weekly activity minutes! Keep up the active lifestyle!",
    },
    warning: {
      range: [75, 150],
      message:
        "You're getting some activity, but try to reach at least 150 minutes per week for optimal health.",
    },
    danger: {
      range: [0, 75],
      message:
        "Your activity level is below recommendations. Try to incorporate more movement into your daily routine.",
    },
  },
  nutrition: {
    good: {
      range: [9, 100],
      message:
        "Excellent work on your nutrition intake! You're meeting the recommended servings of healthy foods.",
    },
    warning: {
      range: [5, 9],
      message:
        "Your nutrition intake is adequate but could be improved. Try to increase your daily servings of vegetables and fruits.",
    },
    danger: {
      range: [0, 5],
      message:
        "Your nutrition intake is below recommendations. Consider adding more fruits, vegetables, and whole grains to your diet.",
    },
  },
}

// Function to determine the status based on value and thresholds
const getStatusForMetric = (metric: MetricType, value: number | string): StatusType => {
  if (metric === "bloodPressure") {
    const [systolic, diastolic] = String(value).split("/").map(Number)

    if (
      systolic >= healthMetricThresholds.bloodPressure.good.range.systolic[0] &&
      systolic <= healthMetricThresholds.bloodPressure.good.range.systolic[1] &&
      diastolic >= healthMetricThresholds.bloodPressure.good.range.diastolic[0] &&
      diastolic <= healthMetricThresholds.bloodPressure.good.range.diastolic[1]
    ) {
      return "good"
    } else if (
      systolic >= healthMetricThresholds.bloodPressure.warning.range.systolic[0] &&
      systolic <= healthMetricThresholds.bloodPressure.warning.range.systolic[1] &&
      diastolic >= healthMetricThresholds.bloodPressure.warning.range.diastolic[0] &&
      diastolic <= healthMetricThresholds.bloodPressure.warning.range.diastolic[1]
    ) {
      return "warning"
    } else {
      return "danger"
    }
  }

  const numericValue = typeof value === "string" ? parseFloat(value) : value
  const thresholds = healthMetricThresholds[metric]

  if (numericValue >= thresholds.good.range[0] && numericValue <= thresholds.good.range[1]) {
    return "good"
  } else if (
    numericValue >= thresholds.warning.range[0] &&
    numericValue <= thresholds.warning.range[1]
  ) {
    return "warning"
  } else {
    return "danger"
  }
}

// Get message for a specific metric and status
const getMessageForMetric = (metric: MetricType, status: StatusType): string => {
  return healthMetricThresholds[metric][status].message
}

// Get color for status
const getColorForStatus = (status: StatusType): string => {
  switch (status) {
    case "good":
      return "#4ade80" // green
    case "warning":
      return "#facc15" // yellow
    case "danger":
      return "#ef4444" // red
    default:
      return theme.colors.text
  }
}

// Chart Components
const HeartRateChart: FC<{ data: VitalsDataPoint[]; color?: string }> = ({ data, color }) => {
  return (
    <LineChart
      data={{
        labels: data.map((item) => item.date.slice(-2)),
        datasets: [
          {
            data: data.map((item) => item.heartRate),
            color: () => "black",
            strokeWidth: 2,
          },
        ],
      }}
      width={Dimensions.get("window").width - 64}
      height={220}
      chartConfig={{
        backgroundColor: "white",
        backgroundGradientFrom: "white",
        backgroundGradientTo: "white",
        decimalPlaces: 0,
        color: () => theme.colors.text,
        labelColor: () => theme.colors.text,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "black",
          fill: "black",
        },
      }}
      bezier={false}
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  )
}

const BloodPressureChart: FC<{ data: VitalsDataPoint[]; color?: string }> = ({ data, color }) => {
  return (
    <LineChart
      data={{
        labels: data.map((item) => item.date.slice(-2)),
        datasets: [
          {
            data: data.map((item) => item.systolic),
            color: () => "black",
            strokeWidth: 2,
          },
          {
            data: data.map((item) => item.diastolic),
            color: (opacity = 1) => "#FF6384",
            strokeWidth: 2,
          },
        ],
        legend: ["Systolic", "Diastolic"],
      }}
      width={Dimensions.get("window").width - 64}
      height={220}
      chartConfig={{
        backgroundColor: "white",
        backgroundGradientFrom: "white",
        backgroundGradientTo: "white",
        decimalPlaces: 0,
        color: () => theme.colors.text,
        labelColor: () => theme.colors.text,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "black",
          fill: "black",
        },
      }}
      bezier={false}
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  )
}

const ActivityBarChart: FC<{ data: ActivityDataPoint[]; color?: string }> = ({ data, color }) => {
  // Group activities and sum their minutes
  const activitySummary = data.reduce(
    (acc, curr) => {
      if (curr.minutes > 0) {
        acc[curr.activity] = (acc[curr.activity] ?? 0) + curr.minutes
      }
      return acc
    },
    {} as { [key: string]: number },
  )

  return (
    <BarChart
      data={{
        labels: Object.keys(activitySummary),
        datasets: [
          {
            data: Object.values(activitySummary),
          },
        ],
      }}
      width={Dimensions.get("window").width - 64}
      height={220}
      yAxisLabel=""
      yAxisSuffix=" min"
      chartConfig={{
        backgroundColor: "white",
        backgroundGradientFrom: "white",
        backgroundGradientTo: "white",
        decimalPlaces: 0,
        color: () => theme.colors.text,
        labelColor: () => theme.colors.text,
        barPercentage: 1.0,
        fillShadowGradient: theme.colors.primary,
        fillShadowGradientOpacity: 0.8,
      }}
      verticalLabelRotation={30}
      fromZero={true}
      showValuesOnTopOfBars={true}
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  )
}

// Helper Components
const NutritionProgressBar: FC<{
  title: string
  value: number
  color: string
  maxValue: number
}> = ({ title, value, color, maxValue }) => {
  return (
    <View style={styles.nutritionItem}>
      <View style={styles.nutritionItemHeader}>
        <Text style={[styles.nutritionItemTitle, { color }]}>{title}</Text>
        <Text style={styles.nutritionItemValue}>{value}</Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${(value / maxValue) * 100}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  )
}

// Color-coded Summary Card Component
const SummaryCard: FC<{
  icon: React.ReactNode
  title: string
  value: number | string
  unit?: string
  metric: MetricType
}> = ({ icon, title, value, unit, metric }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  // Determine status based on the metric and value
  const status: StatusType = getStatusForMetric(metric, value)
  const message: string = getMessageForMetric(metric, status)
  const statusColor: string = getColorForStatus(status)

  // Long press handler for showing tooltip
  let pressTimer: NodeJS.Timeout | null = null

  const handlePressIn = () => {
    pressTimer = setTimeout(() => {
      setShowTooltip(true)
    }, 500) // Show tooltip after 500ms of pressing
  }

  const handlePressOut = () => {
    if (pressTimer) {
      clearTimeout(pressTimer)
      pressTimer = null
    }
  }

  // Regular tap to toggle tooltip
  const handlePress = () => {
    setShowTooltip(!showTooltip)
  }

  return (
    <TouchableOpacity
      style={styles.summaryCard}
      onPress={handlePress}
      onLongPress={() => setShowTooltip(true)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      delayLongPress={500}
    >
      <View style={styles.summaryIcon}>{icon}</View>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={styles.summaryValue}>
        <Text style={{ color: statusColor }}>{value}</Text>
        {unit && <Text style={styles.summaryUnit}> {unit}</Text>}
      </Text>

      {/* Tooltip/Message that appears on press/long press */}
      {showTooltip && (
        <View style={styles.tooltipContainer}>
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{message}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowTooltip(false)}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  )
}

const Card: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View style={styles.card}>{children}</View>
}

const CardHeader: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View style={styles.cardHeader}>{children}</View>
}

const CardContent: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View style={styles.cardContent}>{children}</View>
}

// Main Dashboard Component
const DashboardScreen: FC<DemoTabScreenProps<"DashboardScreen">> = (_props) => {
  const [timeframe, setTimeframe] = useState("week")
  const [activeChartTab, setActiveChartTab] = useState("heartRate")
  const [activityViewMode, setActivityViewMode] = useState("chart")

  // Theme-aware color constants
  const themeAwareColors = {
    heartRate: theme.colors.primary,
    bloodPressure: theme.colors.secondary,
    weight: "#a855f7",
    activity: theme.colors.primary,
    vegetables: theme.colors.secondary,
    fruits: "#eab308",
    wholeGrains: "#8b5cf6",
    sugaryBeverages: "#ef4444",
  }

  // Sample data for visualizations
  const vitalsData: VitalsDataPoint[] = [
    { date: "Feb 22", heartRate: 75, systolic: 119, diastolic: 78, weight: 78.2 },
    { date: "Feb 23", heartRate: 81, systolic: 120, diastolic: 80, weight: 78.0 },
    { date: "Feb 24", heartRate: 77, systolic: 120, diastolic: 76, weight: 77.8 },
    { date: "Feb 25", heartRate: 80, systolic: 120, diastolic: 82, weight: 77.9 },
    { date: "Feb 26", heartRate: 80, systolic: 118, diastolic: 75, weight: 77.5 },
    { date: "Feb 27", heartRate: 85, systolic: 121, diastolic: 77, weight: 77.7 },
    { date: "Feb 28", heartRate: 90, systolic: 119, diastolic: 76, weight: 77.4 },
  ]

  const activityData: ActivityDataPoint[] = [
    { date: "Feb 22", activity: "Run", minutes: 30 },
    { date: "Feb 23", activity: "Swim", minutes: 45 },
    { date: "Feb 24", activity: "Rest", minutes: 0 },
    { date: "Feb 25", activity: "Cycle", minutes: 60 },
    { date: "Feb 26", activity: "Pilates", minutes: 40 },
    { date: "Feb 27", activity: "Gym", minutes: 50 },
    { date: "Feb 28", activity: "Run", minutes: 35 },
  ]

  const nutritionData: NutritionDataPoint[] = [
    { date: "Feb 22", vegetables: 3, fruits: 2, wholeGrains: 2, sugaryBeverages: 1 },
    { date: "Feb 23", vegetables: 4, fruits: 1, wholeGrains: 3, sugaryBeverages: 0 },
    { date: "Feb 24", vegetables: 2, fruits: 3, wholeGrains: 1, sugaryBeverages: 2 },
    { date: "Feb 25", vegetables: 5, fruits: 2, wholeGrains: 4, sugaryBeverages: 0 },
    { date: "Feb 26", vegetables: 3, fruits: 4, wholeGrains: 2, sugaryBeverages: 1 },
    { date: "Feb 27", vegetables: 4, fruits: 2, wholeGrains: 3, sugaryBeverages: 0 },
    { date: "Feb 28", vegetables: 3, fruits: 3, wholeGrains: 2, sugaryBeverages: 1 },
  ]

  const latestNutrition = nutritionData[nutritionData.length - 1]

  const avgHeartRate = Math.round(
    vitalsData.reduce((acc, curr) => acc + curr.heartRate, 0) / vitalsData.length,
  )
  const avgBloodPressure = {
    systolic: Math.round(
      vitalsData.reduce((acc, curr) => acc + curr.systolic, 0) / vitalsData.length,
    ),
    diastolic: Math.round(
      vitalsData.reduce((acc, curr) => acc + curr.diastolic, 0) / vitalsData.length,
    ),
  }
  const totalActivityMinutes = activityData.reduce((acc, curr) => acc + curr.minutes, 0)
  const totalVeggies = nutritionData.reduce((acc, curr) => acc + curr.vegetables, 0)
  const totalFruits = nutritionData.reduce((acc, curr) => acc + curr.fruits, 0)
  const totalWholeGrains = nutritionData.reduce((acc, curr) => acc + curr.wholeGrains, 0)
  const totalSugaryBeverages = nutritionData.reduce((acc, curr) => acc + curr.sugaryBeverages, 0)
  const totalNutritionServings = totalVeggies + totalFruits + totalWholeGrains

  // Render the current active chart based on tab
  const renderActiveChart = () => {
    switch (activeChartTab) {
      case "heartRate":
        return (
          <>
            <Text style={styles.chartTitle}>Heart Rate (bpm)</Text>
            <HeartRateChart data={vitalsData} color={themeAwareColors.heartRate} />
            <View style={styles.dataRows}>
              {vitalsData.map((item, index) => (
                <View key={index} style={styles.dataRow}>
                  <Text style={styles.dataDate}>{item.date}</Text>
                  <Text style={styles.dataValue}>{item.heartRate} bpm</Text>
                </View>
              ))}
            </View>
          </>
        )

      case "bloodPressure":
        return (
          <>
            <Text style={styles.chartTitle}>Blood Pressure</Text>
            <BloodPressureChart data={vitalsData} color={themeAwareColors.bloodPressure} />
            <View style={styles.dataRows}>
              {vitalsData.map((item, index) => (
                <View key={index} style={styles.dataRow}>
                  <Text style={styles.dataDate}>{item.date}</Text>
                  <Text style={styles.dataValue}>
                    {item.systolic}/{item.diastolic}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )

      case "activity":
        return (
          <>
            <View style={styles.tabButtons}>
              <TouchableOpacity
                style={[styles.tabButton, activityViewMode === "chart" && styles.activeTab]}
                onPress={() => setActivityViewMode("chart")}
              >
                <Text style={styles.tabButtonText}>Chart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activityViewMode === "list" && styles.activeTab]}
                onPress={() => setActivityViewMode("list")}
              >
                <Text style={styles.tabButtonText}>List</Text>
              </TouchableOpacity>
            </View>

            {activityViewMode === "chart" ? (
              <View style={styles.chartSection}>
                <Text style={styles.chartTitle}>Activity Distribution</Text>

                <ActivityBarChart data={activityData} color={themeAwareColors.activity} />
              </View>
            ) : (
              <View style={styles.listSection}>
                <Text style={styles.chartTitle}>Daily Activity</Text>
                {activityData.map((day, index) => (
                  <View key={index} style={styles.activityDay}>
                    <Text style={styles.activityDate}>{day.date}</Text>
                    <View style={styles.activityBar}>
                      <View style={styles.activityBarBg}>
                        {day.minutes > 0 && (
                          <View
                            style={[
                              styles.activityBarFill,
                              {
                                width: `${(day.minutes / 120) * 100}%`,
                                backgroundColor:
                                  day.activity === "Run" ? themeAwareColors.activity : "#8884d8",
                              },
                            ]}
                          >
                            <Text style={styles.activityBarLabel} numberOfLines={1}>
                              {day.activity} - {day.minutes} minutes
                            </Text>
                          </View>
                        )}
                        {day.minutes === 0 && <Text style={styles.restDayLabel}>Rest Day</Text>}
                      </View>
                      <Text style={styles.activityMinutes}>{day.minutes} min</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )

      case "nutrition":
        return (
          <>
            <Text style={styles.chartTitle}>Today's Nutrition</Text>
            <View style={styles.nutritionHeader}>
              <Text style={styles.dataDate}>{latestNutrition.date}</Text>
              <Text style={styles.normalText}>
                {latestNutrition.vegetables +
                  latestNutrition.fruits +
                  latestNutrition.wholeGrains +
                  latestNutrition.sugaryBeverages}{" "}
                servings
              </Text>
            </View>

            <NutritionProgressBar
              title="Vegetables"
              value={latestNutrition.vegetables}
              color={themeAwareColors.vegetables}
              maxValue={5}
            />

            <NutritionProgressBar
              title="Fruits"
              value={latestNutrition.fruits}
              color={themeAwareColors.fruits}
              maxValue={5}
            />

            <NutritionProgressBar
              title="Whole Grains"
              value={latestNutrition.wholeGrains}
              color={themeAwareColors.wholeGrains}
              maxValue={5}
            />

            <NutritionProgressBar
              title="Sugary Beverages"
              value={latestNutrition.sugaryBeverages}
              color={themeAwareColors.sugaryBeverages}
              maxValue={5}
            />
          </>
        )

      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Health Dashboard</Text>
            <Text style={styles.subtitle}>February 22 - 28, 2025</Text>
          </View>
          <View style={styles.headerControls}>
            <View style={styles.timeframeContainer}>
              <TouchableOpacity style={styles.arrowButton}>
                <ChevronLeft color={theme.colors.text} size={18} />
              </TouchableOpacity>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={timeframe}
                  onValueChange={(itemValue) => setTimeframe(itemValue)}
                  style={{ color: theme.colors.text }}
                >
                  <Picker.Item label="Daily" value="day" />
                  <Picker.Item label="Weekly" value="week" />
                  <Picker.Item label="Monthly" value="month" />
                </Picker>
              </View>

              <TouchableOpacity style={styles.arrowButton}>
                <ChevronRight color={theme.colors.text} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Enhanced Summary Cards Section */}
        <View style={styles.summaryCards}>
          <SummaryCard
            icon={<Heart color={themeAwareColors.heartRate} size={24} />}
            title="Heart Rate"
            value={avgHeartRate}
            unit="bpm"
            metric="heartRate"
          />

          <SummaryCard
            icon={<TrendingUp color={themeAwareColors.bloodPressure} size={24} />}
            title="Blood Pressure"
            value={`${avgBloodPressure.systolic}/${avgBloodPressure.diastolic}`}
            metric="bloodPressure"
          />

          <SummaryCard
            icon={<Scale color={themeAwareColors.weight} size={24} />}
            title="Weight"
            value={vitalsData[vitalsData.length - 1].weight}
            unit="kg"
            metric="weight"
          />

          <SummaryCard
            icon={<Activity color={themeAwareColors.activity} size={24} />}
            title="Activity"
            value={totalActivityMinutes}
            unit="min"
            metric="activity"
          />

          <SummaryCard
            icon={<Utensils color={themeAwareColors.vegetables} size={24} />}
            title="Nutrition"
            value={totalNutritionServings}
            unit="servings"
            metric="nutrition"
          />
        </View>

        {/* Consolidated Charts Section with Tabs */}
        <View style={styles.section}>
          <Card>
            {/* Chart section header */}
            <CardHeader>
              <Text style={styles.cardTitle}>Health Metrics</Text>
              <Text style={styles.cardDescription}>View detailed analytics</Text>
            </CardHeader>

            {/* Chart Navigation Tabs */}

            <View style={styles.chartTabs}>
              <TouchableOpacity
                style={[styles.chartTab, activeChartTab === "heartRate" && styles.activeChartTab]}
                onPress={() => setActiveChartTab("heartRate")}
              >
                <Heart
                  size={16}
                  color={
                    activeChartTab === "heartRate" ? themeAwareColors.heartRate : theme.colors.text
                  }
                />
                <Text
                  style={[
                    styles.chartTabText,
                    activeChartTab === "heartRate" && {
                      color: themeAwareColors.heartRate,
                      fontWeight: "600",
                    },
                  ]}
                >
                  Heart Rate
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.chartTab,
                  activeChartTab === "bloodPressure" && styles.activeChartTab,
                ]}
                onPress={() => setActiveChartTab("bloodPressure")}
              >
                <TrendingUp
                  size={16}
                  color={
                    activeChartTab === "bloodPressure"
                      ? themeAwareColors.bloodPressure
                      : theme.colors.text
                  }
                />
                <Text
                  style={[
                    styles.chartTabText,
                    activeChartTab === "bloodPressure" && {
                      color: themeAwareColors.bloodPressure,
                      fontWeight: "600",
                    },
                  ]}
                >
                  BP
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.chartTab, activeChartTab === "activity" && styles.activeChartTab]}
                onPress={() => setActiveChartTab("activity")}
              >
                <Activity
                  size={16}
                  color={
                    activeChartTab === "activity" ? themeAwareColors.activity : theme.colors.text
                  }
                />
                <Text
                  style={[
                    styles.chartTabText,
                    activeChartTab === "activity" && {
                      color: themeAwareColors.activity,
                      fontWeight: "600",
                    },
                  ]}
                >
                  Activity
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.chartTab, activeChartTab === "nutrition" && styles.activeChartTab]}
                onPress={() => setActiveChartTab("nutrition")}
              >
                <Utensils
                  size={16}
                  color={
                    activeChartTab === "nutrition" ? themeAwareColors.vegetables : theme.colors.text
                  }
                />
                <Text
                  style={[
                    styles.chartTabText,
                    activeChartTab === "nutrition" && {
                      color: themeAwareColors.vegetables,
                      fontWeight: "600",
                    },
                  ]}
                >
                  Nutrition
                </Text>
              </TouchableOpacity>
            </View>

            {/* Chart Content - Dynamic based on selected tab */}
            <CardContent>{renderActiveChart()}</CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// Styles defined as a variable outside the component to avoid scoping issues
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 100, // Add extra padding at the bottom to ensure all content is visible
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    opacity: 0.7,
  },
  headerControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.md,
    flexWrap: "wrap",
    gap: 12,
  },
  timeframeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
    minWidth: 180,
  },
  pickerContainer: {
    flex: 1,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
    justifyContent: "flex-start", // Ensures proper wrapping on iOS
    alignItems: "flex-start", // Helps with proper wrapping behavior
  },
  summaryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 140,
    flex: 1,
    position: "relative",
    zIndex: 1, // Ensure summary cards have a higher z-index
  },
  summaryIcon: {
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    // fontWeight: "500",
    fontWeight: Platform.OS === "ios" ? "600" : "500", // iOS tends to render thin text
    color: theme.colors.text,
  },
  summaryUnit: {
    fontSize: 14,
    fontWeight: "normal",
    color: theme.colors.text,
  },
  section: {
    marginBottom: 20,
    zIndex: 0, // Lower z-index for chart section to prevent overlap
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardHeaderWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: theme.colors.text,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
    marginTop: 4,
  },
  cardContent: {
    padding: 16,
  },
  // Chart Tabs styling
  chartTabs: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  chartTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    flex: 1,
  },
  activeChartTab: {
    borderBottomWidth: 2,
    backgroundColor: "white",
  },
  chartTabText: {
    marginLeft: 4,
    fontSize: 12,
    color: theme.colors.text,
  },
  // Content styling
  nutritionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  normalText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  nutritionItem: {
    marginBottom: 14,
  },
  nutritionItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  nutritionItemTitle: {
    fontSize: 16,
  },
  nutritionItemValue: {
    fontSize: 16,
    color: theme.colors.text,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: 12,
  },
  dataRows: {
    marginTop: 16,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dataDate: {
    color: theme.colors.text,
    opacity: 0.7,
  },
  dataValue: {
    fontWeight: "500",
    color: theme.colors.text,
  },
  tabButtons: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#f0f0f0",
  },
  tabButtonText: {
    color: theme.colors.text,
  },
  chartSection: {
    marginTop: 10,
  },
  listSection: {
    marginTop: 10,
  },
  activityDay: {
    marginBottom: 16,
  },
  activityDate: {
    fontWeight: "500",
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
    marginBottom: 6,
  },
  activityBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityBarBg: {
    flex: 1,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    position: "relative",
    overflow: "hidden",
  },
  activityBarFill: {
    height: "100%",
    borderRadius: 12,
    paddingLeft: 10,
    justifyContent: "center",
  },
  activityBarLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ffffff",
  },
  restDayLabel: {
    fontSize: 12,
    position: "absolute",
    left: 10,
    top: 6,
    color: theme.colors.text,
    opacity: 0.7,
  },
  activityMinutes: {
    minWidth: 50,
    textAlign: "right",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
  // Tooltip styles - updated for better positioning and visibility
  tooltipContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    borderRadius: 8,
    padding: 12,
    width: 200,
    maxWidth: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  tooltipText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  closeButton: {
    position: "absolute",
    top: 4,
    right: 6,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 20,
  },
})

export default DashboardScreen
