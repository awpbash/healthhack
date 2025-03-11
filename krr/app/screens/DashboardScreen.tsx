import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Platform, 
  Modal
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

// Updated nutrition data structure to combine fruits/vegetables and include proteins and sugars in grams
interface NutritionDataPoint {
  date: string
  fruitsVegetables: number // servings (combined) 
  wholeGrains: number // servings
  proteins: number // grams
  sugars: number // grams
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
type NutritionMetricType = "fruitsVegetables" | "wholeGrains" | "proteins" | "sugars";


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

type NutritionThresholdType = {
  range: RangeType;
  message: string;
};

type NutritionMetricThresholdsType = {
  fruitsVegetables: {
    good: NutritionThresholdType;
    warning: NutritionThresholdType;
    danger: NutritionThresholdType;
  };
  wholeGrains: {
    good: NutritionThresholdType;
    warning: NutritionThresholdType;
    danger: NutritionThresholdType;
  };
  proteins: {
    good: NutritionThresholdType;
    warning: NutritionThresholdType;
    danger: NutritionThresholdType;
  };
  sugars: {
    good: NutritionThresholdType;
    warning: NutritionThresholdType;
    danger: NutritionThresholdType;
  };
};

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

const nutritionMetricThresholds: NutritionMetricThresholdsType = {
  fruitsVegetables: {
    good: {
      range: [5, 10],
      message: "Excellent! You're meeting the recommended 5+ daily servings of fruits and vegetables."
    },
    warning: {
      range: [3, 5],
      message: "You're on the right track. Try to increase to 5+ servings of fruits and vegetables daily."
    },
    danger: {
      range: [0, 3],
      message: "Your fruit and vegetable intake is below recommendations. Aim for at least 5 servings daily."
    }
  },
  wholeGrains: {
    good: {
      range: [3, 10],
      message: "Great job including whole grains in your diet! Keep up the 3+ servings daily."
    },
    warning: {
      range: [1, 3],
      message: "Try to increase your whole grain intake to at least 3 servings daily."
    },
    danger: {
      range: [0, 1],
      message: "Your whole grain intake is low. Include more whole grains for better health benefits."
    }
  },
  proteins: {
    good: {
      range: [50, 100],
      message: "You're meeting your daily protein needs. Keep it up!"
    },
    warning: {
      range: [30, 50],
      message: "Your protein intake is moderate. Consider increasing to 50+ grams daily."
    },
    danger: {
      range: [0, 30],
      message: "Your protein intake is low. Aim for at least 50 grams daily for optimal health."
    }
  },
  sugars: {
    good: {
      range: [0, 25],
      message: "Excellent job keeping added sugars under the recommended limit!"
    },
    warning: {
      range: [25, 36],
      message: "Your sugar intake is approaching the upper limit. Try to reduce below 25g daily."
    },
    danger: {
      range: [36, 200],
      message: "Your sugar intake exceeds recommendations. Try to limit added sugars to under 25g daily."
    }
  }
};

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

const getNutritionStatus = (metric: NutritionMetricType, value: number): StatusType => {
  const thresholds = nutritionMetricThresholds[metric];
  
  if (metric === 'sugars') {
    // For sugar, lower is better
    if (value <= thresholds.good.range[1]) {
      return "good";
    } else if (value <= thresholds.warning.range[1]) {
      return "warning";
    } else {
      return "danger";
    }
  } else {
    // For other metrics, higher is better
    if (value >= thresholds.good.range[0]) {
      return "good";
    } else if (value >= thresholds.warning.range[0]) {
      return "warning";
    } else {
      return "danger";
    }
  }
};

const getNutritionMessage = (metric: NutritionMetricType, value: number): string => {
  const status = getNutritionStatus(metric, value);
  return nutritionMetricThresholds[metric][status].message;
};

// Chart Components
const HeartRateChart: FC<{ data: VitalsDataPoint[]; color?: string }> = ({ data, color }) => {
  return (
    <LineChart
      data={{
        labels: data.map((item) => item.date.slice(-2)),
        datasets: [
          {
            data: data.map((item) => item.heartRate),
            color: () => theme.colors.primary,
            strokeWidth: 2,
          },
          // {
          //   data: [60],
          //   withDots: false,
          // },
        ],
      }}
      width={Dimensions.get("window").width - 64}
      height={220}
      chartConfig={{
        backgroundColor: "white",
        backgroundGradientFrom: "white",
        backgroundGradientTo: "white",
        decimalPlaces: 0,
        color: () => theme.colors.primary,
        labelColor: () => "black",
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: theme.colors.primary,
          fill: theme.colors.primary,
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
            color: () => "#49c5b1",
            strokeWidth: 2,
          },
          {
            data: data.map((item) => item.diastolic),
            color: (opacity = 1) => "#E76F51",
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
        color: () => theme.colors.primary,
        labelColor: () => "black",
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

export const ActivityBarChart: FC<{ data: ActivityDataPoint[]; color?: string }> = ({
  data,
  color,
}) => {
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
  unit: string
}> = ({ title, value, color, maxValue, unit }) => {
  return (
    <View style={styles.nutritionItem}>
      <View style={styles.nutritionItemHeader}>
        <Text style={[styles.nutritionItemTitle, { color }]}>{title}</Text>
        <Text style={styles.nutritionItemValue}>
          {value} {unit}
        </Text>
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

interface NutritionQuadrantProps {
  title: string;
  value: number;
  unit: string;
  metric: NutritionMetricType;
}

// Color-coded Summary Card Component
interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value?: number | string;
  unit?: string;
  metric: MetricType;
  isNutritionCard?: boolean;
  nutritionData?: {
    fruitsVegetables: number;
    wholeGrains: number;
    proteins: number;
    sugars: number;
  };
  colors?: {
    fruitsVegetables?: string;
    wholeGrains?: string;
    proteins?: string;
    sugars?: string;
  };
  status_of_val: string
}

const SummaryCard: FC<SummaryCardProps> = ({
  icon,
  title,
  value,
  unit,
  metric,
  isNutritionCard = false,
  nutritionData,
}) => {
  // State to control the modal visibility
  const [showModal, setShowModal] = useState(false);
  // New state to track which nutrition metric to show info for
  const [activeNutritionMetric, setActiveNutritionMetric] = useState<NutritionMetricType | null>(null);

  // Standard status colors
  const statusColors = {
    good: "#4ade80", // Green
    warning: "#facc15", // Yellow
    danger: "#ef4444", // Red
  };

  // Render regular summary card (not nutrition card)
  if (!isNutritionCard) {
    // Determine status based on the metric and value
    // Add null check for value to fix type error
    const status: StatusType = value !== undefined 
      ? getStatusForMetric(metric, value as number | string) 
      : "warning"; // Default to warning if value is undefined
    const message: string = getMessageForMetric(metric, status);
    const statusColor: string = statusColors[status] || theme.colors.text;

    return (
      <>
        <TouchableOpacity
          style={/*[*/styles.summaryCard/*, styles.uniformCardSize]*/}
          onPress={() => setShowModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.summaryIcon}>{icon}</View>
          <Text style={styles.summaryTitle}>{title}</Text>
          <Text style={styles.summaryValue}>
            <Text style={{ color: statusColor }}>{value}</Text>
            {unit && <Text style={styles.summaryUnit}> {unit}</Text>}
          </Text>
        </TouchableOpacity>

        {/* Modal for regular cards */}
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowModal(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
              onPress={e => e.stopPropagation()}
            >
              <Text style={styles.modalTitle}>{title}</Text>
              <Text style={styles.modalValue}>
              <Text style={{ 
                color: statusColor, 
                fontSize: 24, 
                fontFamily: "spaceGroteskSemiBold"
              }}>
                {value}
              </Text>
              {unit && <Text style={{ 
                fontSize: 16, 
                fontFamily: "spaceGroteskRegular" 
              }}> {unit}</Text>}
            </Text>
              <Text style={styles.modalMessage}>{message}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Got it</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }

  const NutritionQuadrant: FC<NutritionQuadrantProps> = ({ title, value, unit, metric }) => {
    // Get status and color based on specific nutrition metric
    const status = getNutritionStatus(metric, value);
    const valueColor = statusColors[status];

    // Determine background color based on status
    const getBgColor = (status: StatusType): string => {
      if (status === 'good') return "#ecfdf5"; // Light green
      if (status === 'warning') return "#fef9c3"; // Light yellow
      if (status === 'danger') return "#fee2e2"; // Light red
      return "#f5f5f5"; // Default
    };

    return (
      <View style={styles.nutritionQuad}>
        <TouchableOpacity
          style={[styles.quadContent, { backgroundColor: getBgColor(status) }]}
          onPress={() => setActiveNutritionMetric(metric)}
          activeOpacity={0.7}
        >
          <Text style={styles.quadTitle}>{title}</Text>
          <View style={styles.quadValueContainer}>
            <Text style={[styles.quadValue, { color: valueColor }]}>{value}</Text>
            <Text style={styles.quadUnit}>{unit}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const latestData = nutritionData || {
    fruitsVegetables: 6,
    wholeGrains: 2,
    proteins: 66,
    sugars: 55,
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.summaryCard, /*styles.uniformCardSize,*/ styles.nutritionCard]}
        activeOpacity={0.9}
      >
        <View style={styles.summaryIcon}>{icon}</View>
        <Text style={styles.summaryTitle}>{title}</Text>
        
        {/* Quad layout for nutrition card */}
        <View style={styles.nutritionQuadContainer}>
          <NutritionQuadrant
            title="F&V"
            value={latestData.fruitsVegetables}
            unit="servings"
            metric="fruitsVegetables"
          />

          <NutritionQuadrant
            title="Grains"
            value={latestData.wholeGrains}
            unit="servings"
            metric="wholeGrains"
          />

          <NutritionQuadrant
            title="Protein"
            value={latestData.proteins}
            unit="grams"
            metric="proteins"
          />

          <NutritionQuadrant
            title="Sugar"
            value={latestData.sugars}
            unit="grams"
            metric="sugars"
          />
        </View>
      </TouchableOpacity>

      {activeNutritionMetric !== null && (
        <Modal
          visible={activeNutritionMetric !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setActiveNutritionMetric(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setActiveNutritionMetric(null)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
              onPress={e => e.stopPropagation()}
            >
              <Text style={styles.modalTitle}>
                {activeNutritionMetric === "fruitsVegetables" ? "Fruits & Vegetables" :
                 activeNutritionMetric === "wholeGrains" ? "Whole Grains" :
                 activeNutritionMetric === "proteins" ? "Protein" : "Sugar"}
              </Text>
              <Text style={styles.modalValue}>
            <Text style={{ 
              color: statusColors[getNutritionStatus(activeNutritionMetric, 
                activeNutritionMetric === "fruitsVegetables" ? latestData.fruitsVegetables :
                activeNutritionMetric === "wholeGrains" ? latestData.wholeGrains :
                activeNutritionMetric === "proteins" ? latestData.proteins : latestData.sugars
              )],
              fontSize: 24,
              fontFamily: "spaceGroteskSemiBold"
            }}>
              {activeNutritionMetric === "fruitsVegetables" ? latestData.fruitsVegetables :
              activeNutritionMetric === "wholeGrains" ? latestData.wholeGrains :
              activeNutritionMetric === "proteins" ? latestData.proteins : latestData.sugars}
            </Text>
            <Text style={{ 
              fontSize: 16, 
              fontFamily: "spaceGroteskRegular" 
            }}>
              {activeNutritionMetric === "fruitsVegetables" || activeNutritionMetric === "wholeGrains" 
                ? " servings" 
                : " grams"}
            </Text>
          </Text>
              <Text style={styles.modalMessage}>
                {activeNutritionMetric && getNutritionMessage(
                  activeNutritionMetric,
                  activeNutritionMetric === "fruitsVegetables" ? latestData.fruitsVegetables :
                  activeNutritionMetric === "wholeGrains" ? latestData.wholeGrains :
                  activeNutritionMetric === "proteins" ? latestData.proteins : latestData.sugars
                )}
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setActiveNutritionMetric(null)}
              >
                <Text style={styles.modalButtonText}>Got it</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};

// const SummaryCard: FC<{
//   icon: React.ReactNode
//   title: string
//   value: number | string
//   unit?: string
//   status_of_val: string
// }> = ({ icon, title, value, unit, status_of_val }) => {
//   const text_color =
//     status_of_val === "Good"
//       ? theme.colors.status_good
//       : status_of_val === "Average"
//         ? theme.colors.status_avg
//         : theme.colors.status_error
//   const text_style = StyleSheet.create({
//     text: {
//       fontSize: 24,
//       // fontWeight: "500",
//       fontWeight: Platform.OS === "ios" ? "600" : "500", // iOS tends to render thin text
//       color: text_color,
//     },
//   })
//   return (
//     <View style={styles.summaryCard}>
//       <View style={styles.summaryIcon}>{icon}</View>
//       <Text style={styles.summaryTitle}>{title}</Text>
//       <Text style={text_style.text}>
//         {value} {unit && <Text style={styles.summaryUnit}>{unit}</Text>}
//       </Text>
//     </View>
//   )
//   // <Text style={styles.summaryValue}>
//   //   {value} {unit && <Text style={styles.summaryUnit}>{unit}</Text>}
//   // </Text>
// }
// >>>>>>> Stashed changes

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
    fruitsVegetables: "#4ade80", // green
    wholeGrains: "#8b5cf6", // purple
    proteins: "#06b6d4", // cyan
    sugars: "#ef4444", // red
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

  // Updated nutrition data with combined fruits/vegetables and proteins and sugars in grams
  const nutritionData: NutritionDataPoint[] = [
    { date: "Feb 22", fruitsVegetables: 5, wholeGrains: 2, proteins: 65, sugars: 38 },
    { date: "Feb 23", fruitsVegetables: 5, wholeGrains: 3, proteins: 72, sugars: 25 },
    { date: "Feb 24", fruitsVegetables: 5, wholeGrains: 1, proteins: 68, sugars: 45 },
    { date: "Feb 25", fruitsVegetables: 7, wholeGrains: 4, proteins: 75, sugars: 30 },
    { date: "Feb 26", fruitsVegetables: 7, wholeGrains: 2, proteins: 70, sugars: 35 },
    { date: "Feb 27", fruitsVegetables: 6, wholeGrains: 3, proteins: 78, sugars: 28 },
    { date: "Feb 28", fruitsVegetables: 6, wholeGrains: 2, proteins: 66, sugars: 55 },
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

  // Calculate total servings (fruits/vegetables, whole grains)
  const totalFruitsVegetables = nutritionData.reduce((acc, curr) => acc + curr.fruitsVegetables, 0)
  const totalWholeGrains = nutritionData.reduce((acc, curr) => acc + curr.wholeGrains, 0)
  const totalServings = totalFruitsVegetables + totalWholeGrains

  // Calculate average daily protein and sugar intake
  const avgProtein = Math.round(
    nutritionData.reduce((acc, curr) => acc + curr.proteins, 0) / nutritionData.length,
  )
  const avgSugar = Math.round(
    nutritionData.reduce((acc, curr) => acc + curr.sugars, 0) / nutritionData.length,
  )

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
                {latestNutrition.fruitsVegetables + latestNutrition.wholeGrains} servings,{" "}
                {latestNutrition.proteins}g protein, {latestNutrition.sugars}g sugar
              </Text>
            </View>

            {/* Servings-based nutrition items */}
            <Text style={styles.nutritionSectionTitle}>Food Groups (servings)</Text>

            <NutritionProgressBar
              title="Fruits & Vegetables"
              value={latestNutrition.fruitsVegetables}
              color={themeAwareColors.fruitsVegetables}
              maxValue={7}
              unit="servings"
            />

            <NutritionProgressBar
              title="Whole Grains"
              value={latestNutrition.wholeGrains}
              color={themeAwareColors.wholeGrains}
              maxValue={5}
              unit="servings"
            />

            {/* Gram-based nutrition items */}
            <Text style={styles.nutritionSectionTitle}>Macronutrients (grams)</Text>

            <NutritionProgressBar
              title="Proteins"
              value={latestNutrition.proteins}
              color={themeAwareColors.proteins}
              maxValue={100}
              unit="g"
            />

            <NutritionProgressBar
              title="Sugars"
              value={latestNutrition.sugars}
              color={themeAwareColors.sugars}
              maxValue={50}
              unit="g"
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
              <View style={styles.pickerContainer}>
              <Picker
                  selectedValue={timeframe}
                  onValueChange={(itemValue) => setTimeframe(itemValue)}
                  style={{ 
                    color: theme.colors.text,
                    fontFamily: "spaceGroteskRegular" 
                  }}
                >
                  <Picker.Item label="Daily" value="day" />
                  <Picker.Item label="Weekly" value="week" />
                  <Picker.Item label="Monthly" value="month" />
                </Picker>
              </View>
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
            status_of_val="Average"
          />

          <SummaryCard
            icon={<TrendingUp color={themeAwareColors.bloodPressure} size={24} />}
            title="Blood Pressure"
            value={`${avgBloodPressure.systolic}/${avgBloodPressure.diastolic}`}
            metric="bloodPressure"
            status_of_val="Bad"
          />

          <SummaryCard
            icon={<Scale color={themeAwareColors.weight} size={24} />}
            title="Weight"
            value={vitalsData[vitalsData.length - 1].weight}
            unit="kg"
            metric="weight"
            status_of_val="Good"
          />

          <SummaryCard
            icon={<Activity color={themeAwareColors.activity} size={24} />}
            title="Activity"
            value={totalActivityMinutes}
            unit="min"
            metric="activity"
            status_of_val="Good"
          />

          <SummaryCard
            icon={<Utensils color="#4ade80" size={24} />}
            title="Nutrition"
            metric="nutrition"
            isNutritionCard={true}
            nutritionData={{
              fruitsVegetables: nutritionData[nutritionData.length - 1].fruitsVegetables,
              wholeGrains: nutritionData[nutritionData.length - 1].wholeGrains,
              proteins: nutritionData[nutritionData.length - 1].proteins,
              sugars: nutritionData[nutritionData.length - 1].sugars,
            }}
            status_of_val="Good"
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
                    activeChartTab === "nutrition"
                      ? themeAwareColors.fruitsVegetables
                      : theme.colors.text
                  }
                />
                <Text
                  style={[
                    styles.chartTabText,
                    activeChartTab === "nutrition" && {
                      color: themeAwareColors.fruitsVegetables,
                      fontWeight: "600",
                    },
                  ]}
                >
                  Nutrition
                </Text>
              </TouchableOpacity>
            </View>
            <CardContent>{renderActiveChart()}</CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// Styles defined as a variable outside the component to avoid scoping issues
const styles = StyleSheet.create({
  // Layout & Container styles remain the same
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 20,
    zIndex: 0,
  },

  // Header styles with direct font references
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontFamily: "spaceGroteskBold",
    fontSize: 28,
    color: theme.colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: "spaceGroteskRegular",
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

  // Time picker styles remain the same
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

  // Summary cards layout remains the same
  summaryCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 2,
    // gap: 8,
    // marginRight: 16,
    width: "100%",
    marginBottom: 16,
    // margin: 16,
    // height: 500,
    justifyContent: "space-between",
  },

  // Summary card base styles with direct font references
  summaryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: "2.5%",
    minWidth: 150,
    maxWidth: "45%",
    flexGrow: 1,
    alignSelf: "stretch",
    height: 170,
    minHeight: 110,
    marginHorizontal: 2,
  },
  summaryIcon: {
    marginBottom: 4,
    transform: [{ scale: 1.1 }],
  },
  summaryTitle: {
    fontFamily: "spaceGroteskMedium",
    fontSize: 15,
    color: theme.colors.text,
    opacity: 0.7,
    marginBottom: 2,
    textAlign: "center",
  },
  summaryValue: {
    fontFamily: "spaceGroteskSemiBold",
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 2,
    textAlign: "center",
  },
  summaryUnit: {
    fontFamily: "spaceGroteskRegular",
    fontSize: 12,
    color: theme.colors.text,
  },

  // Nutrition card specific styles
  nutritionCard: {
    height: 170,
    minHeight: 170,
    padding: 6,
    paddingTop: 8,
  },
  nutritionQuadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0,
    justifyContent: "flex-start",
    marginTop: 2,
    width: "100%",
  },
  nutritionQuad: {
    width: "50%",
    height: 40,
  },
  quadContent: {
    borderRadius: 4,
    padding: 2,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  quadTitle: {
    fontFamily: "spaceGroteskMedium",
    fontSize: 11,
    color: theme.colors.text,
    opacity: 0.7,
    marginBottom: 0,
    textAlign: "center",
  },
  quadValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  quadValue: {
    fontFamily: "spaceGroteskSemiBold",
    fontSize: 16,
  },
  quadUnit: {
    fontFamily: "spaceGroteskRegular",
    fontSize: 12,
    marginLeft: 1,
    color: theme.colors.text,
    opacity: 0.7,
  },

  // Card styles for detailed metrics
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
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
    fontFamily: "spaceGroteskSemiBold",
    fontSize: 18,
    color: theme.colors.text,
  },
  cardDescription: {
    fontFamily: "spaceGroteskRegular",
    fontSize: 13,
    color: theme.colors.text,
    opacity: 0.7,
    marginTop: 4,
  },
  cardContent: {
    padding: 16,
  },

  // Chart tab navigation styles
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
    paddingVertical: 10,
    paddingHorizontal: 8,
    flex: 1,
  },
  activeChartTab: {
    borderBottomWidth: 2,
    backgroundColor: "white",
  },
  chartTabText: {
    fontFamily: "spaceGroteskRegular",
    marginLeft: 4,
    fontSize: 12,
    color: theme.colors.text,
  },

  // Content & Chart styles
  chartTitle: {
    fontFamily: "spaceGroteskSemiBold",
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 12,
  },
  nutritionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  normalText: {
    fontFamily: "spaceGroteskRegular",
    fontSize: 14,
    color: theme.colors.text,
  },
  nutritionItem: {
    marginBottom: 12,
  },
  nutritionItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  nutritionItemTitle: {
    fontFamily: "spaceGroteskMedium",
    fontSize: 14,
  },
  nutritionItemValue: {
    fontFamily: "spaceGroteskRegular",
    fontSize: 14,
    color: theme.colors.text,
  },
  nutritionSectionTitle: {
    fontFamily: "spaceGroteskSemiBold",
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 4,
  },

  // Progress bar styles remain the same
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  // Data display styles
  dataRows: {
    marginTop: 12,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dataDate: {
    fontFamily: "spaceGroteskRegular",
    color: theme.colors.text,
    opacity: 0.7,
    fontSize: 13,
  },
  dataValue: {
    fontFamily: "spaceGroteskMedium",
    fontWeight: "500",
    color: theme.colors.text,
    fontSize: 13,
  },

  // Tab button styles
  tabButtons: {
    flexDirection: "row",
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#f0f0f0",
  },
  tabButtonText: {
    fontFamily: "spaceGroteskRegular",
    color: theme.colors.text,
    fontSize: 13,
  },

  // Chart and list section styles remain the same
  chartSection: {
    marginTop: 8,
  },
  listSection: {
    marginTop: 8,
  },

  // Activity day styles
  activityDay: {
    marginBottom: 12,
  },
  activityDate: {
    fontFamily: "spaceGroteskMedium",
    fontSize: 13,
    color: theme.colors.text,
    opacity: 0.7,
    marginBottom: 4,
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
    borderRadius: 10,
    paddingLeft: 8,
    justifyContent: "center",
  },
  activityBarLabel: {
    fontFamily: "spaceGroteskMedium",
    fontSize: 11,
    color: "#ffffff",
  },
  restDayLabel: {
    fontFamily: "spaceGroteskRegular",
    fontSize: 11,
    position: "absolute",
    left: 8,
    top: 4,
    color: theme.colors.text,
    opacity: 0.7,
  },
  activityMinutes: {
    fontFamily: "spaceGroteskMedium",
    minWidth: 40,
    textAlign: "right",
    marginLeft: 6,
    fontSize: 13,
    color: theme.colors.text,
  },

  // Tooltip styles
  tooltipContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    pointerEvents: "box-none",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    borderRadius: 8,
    padding: 8,
    width: 150,
    maxWidth: 160,
    zIndex: 2000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipText: {
    fontFamily: "spaceGroteskRegular",
    color: "#FFFFFF",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 14,
  },
  closeButton: {
    position: "absolute",
    top: 2,
    right: 4,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontFamily: "spaceGroteskBold",
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 18,
  },
  
  // Modal styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 16,
    width: "80%",
    maxWidth: 300,
    alignSelf: "center",
    marginTop: "40%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: "spaceGroteskSemiBold",
    fontSize: 18, 
    color: theme.colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  modalValue: {
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontFamily: "spaceGroteskRegular",
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  modalButtonText: {
    fontFamily: "spaceGroteskMedium",
    color: "white",
    fontSize: 15,
  },
  
  // // Ensure this style exists
  // uniformCardSize: {
  //   width: "19%",
  //   maxWidth: "19%",
  //   minWidth: 60,
  //   height: 170,
  //   minHeight: 110,
  // },
});

export default DashboardScreen
