import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StyleSheet, 
  Dimensions 
} from "react-native";
import { LineChart, BarChart } from 'react-native-chart-kit';
import type { FC } from "react";
import type { DemoTabScreenProps } from "../navigators/TabNavigator";
import { 
  Activity, 
  Heart, 
  Scale, 
  Utensils, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";


import theme from "@/theme/theme";

// Type Definitions
interface VitalsDataPoint {
  date: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  weight: number;
}

interface ActivityDataPoint {
  date: string;
  activity: string;
  minutes: number;
}

interface NutritionDataPoint {
  date: string;
  vegetables: number;
  fruits: number;
  wholeGrains: number;
  sugaryBeverages: number;
}

// Chart Components
const HeartRateChart: FC<{ data: VitalsDataPoint[], color?: string }> = ({ data, color }) => {
  return (
    <LineChart
      data={{
        labels: data.map(item => item.date.slice(-2)),
        datasets: [
          {
            data: data.map(item => item.heartRate),
            color: () => 'black',
            strokeWidth: 2
          }
        ]
      }}
      width={Dimensions.get('window').width - 64}
      height={220}
      chartConfig={{
        backgroundColor: 'white',
        backgroundGradientFrom: 'white',
        backgroundGradientTo: 'white',
        decimalPlaces: 0,
        color: () => theme.colors.text,
        labelColor: () => theme.colors.text,
        style: {
          borderRadius: 16
        },
        propsForDots: {
          r: '6',
          strokeWidth: '2',
          stroke: 'black',
          fill: 'black'
        }
      }}
      bezier = {false}
      style={{
        marginVertical: 8,
        borderRadius: 16
      }}
    />
  );
};

const BloodPressureChart: FC<{ data: VitalsDataPoint[], color?: string }> = ({ data, color }) => {
  return (
    <LineChart
      data={{
        labels: data.map(item => item.date.slice(-2)),
        datasets: [
          {
            data: data.map(item => item.systolic),
            color: () => 'black',
            strokeWidth: 2
          },
          {
            data: data.map(item => item.diastolic),
            color: (opacity = 1) => '#FF6384',
            strokeWidth: 2
          }
        ],
        legend: ['Systolic', 'Diastolic']
      }}
      width={Dimensions.get('window').width - 64}
      height={220}
      chartConfig={{
        backgroundColor: 'white',
        backgroundGradientFrom: 'white',
        backgroundGradientTo: 'white',
        decimalPlaces: 0,
        color: () => theme.colors.text,
        labelColor: () => theme.colors.text,
        style: {
          borderRadius: 16
        },
        propsForDots: {
          r: '6',
          strokeWidth: '2',
          stroke: 'black',
          fill: 'black'
        }
      }}
      bezier={false}
      style={{
        marginVertical: 8,
        borderRadius: 16
      }}
    />
  );
};

export const ActivityBarChart: FC<{ data: ActivityDataPoint[], color?: string }> = ({ data, color }) => {
  // Group activities and sum their minutes
  const activitySummary = data.reduce((acc, curr) => {
    if (curr.minutes > 0) {
      acc[curr.activity] = (acc[curr.activity] ?? 0) + curr.minutes;
    }
    return acc;
  }, {} as { [key: string]: number });

  return (
    <BarChart
      data={{
        labels: Object.keys(activitySummary),
        datasets: [{
          data: Object.values(activitySummary)
        }]
      }}
      width={Dimensions.get('window').width - 64}
      height={220}
      yAxisLabel=""
      yAxisSuffix=" min"
      chartConfig={{
        backgroundColor: 'white',
        backgroundGradientFrom: 'white',
        backgroundGradientTo: 'white',
        decimalPlaces: 0,
        color: () => theme.colors.text,
        labelColor: () => theme.colors.text,
        barPercentage: 1.0,
        fillShadowGradient: theme.colors.primary,
        fillShadowGradientOpacity: 0.8
      }}
      verticalLabelRotation={30}
      fromZero={true} 
      showValuesOnTopOfBars={true} 
      style={{
        marginVertical: 8,
        borderRadius: 16
      }}
    />
  );
};

// Helper Components
const NutritionProgressBar: FC<{
  title: string;
  value: number;
  color: string;
  maxValue: number;
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
              backgroundColor: color
            }
          ]} 
        />
      </View>
    </View>
  );
};

const SummaryCard: FC<{
  icon: React.ReactNode;
  title: string;
  value: number | string;
  unit?: string;
}> = ({ icon, title, value, unit }) => {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryIcon}>{icon}</View>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={styles.summaryValue}>
        {value} {unit && <Text style={styles.summaryUnit}>{unit}</Text>}
      </Text>
    </View>
  );
};

const Card: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View style={styles.card}>{children}</View>;
};

const CardHeader: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View style={styles.cardHeader}>{children}</View>;
};

const CardContent: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View style={styles.cardContent}>{children}</View>;
};

// Main Dashboard Component
const DashboardScreen: FC<DemoTabScreenProps<"DashboardScreen">> = (_props) => {
  const [timeframe, setTimeframe] = useState('week');
  const [activeTab, setActiveTab] = useState('heartRate');
  const [activityViewMode, setActivityViewMode] = useState('chart');
  
  // Theme-aware color constants
  const themeAwareColors = {
    heartRate: theme.colors.primary,
    bloodPressure: theme.colors.secondary,
    weight: "#a855f7",
    activity: theme.colors.primary,
    vegetables: theme.colors.secondary,
    fruits: "#eab308",
    wholeGrains: "#8b5cf6",
    sugaryBeverages: "#ef4444"
  };
  
  // Sample data for visualizations
  const vitalsData: VitalsDataPoint[] = [
    { date: 'Feb 22', heartRate: 72, systolic: 122, diastolic: 78, weight: 78.2 },
    { date: 'Feb 23', heartRate: 74, systolic: 124, diastolic: 80, weight: 78.0 },
    { date: 'Feb 24', heartRate: 70, systolic: 120, diastolic: 76, weight: 77.8 },
    { date: 'Feb 25', heartRate: 75, systolic: 126, diastolic: 82, weight: 77.9 },
    { date: 'Feb 26', heartRate: 71, systolic: 118, diastolic: 75, weight: 77.5 },
    { date: 'Feb 27', heartRate: 73, systolic: 121, diastolic: 77, weight: 77.7 },
    { date: 'Feb 28', heartRate: 69, systolic: 119, diastolic: 76, weight: 77.4 },
  ];

  const activityData: ActivityDataPoint[] = [
    { date: 'Feb 22', activity: 'Run', minutes: 30 },
    { date: 'Feb 23', activity: 'Swim', minutes: 45 },
    { date: 'Feb 24', activity: 'Rest', minutes: 0 },
    { date: 'Feb 25', activity: 'Cycle', minutes: 60 },
    { date: 'Feb 26', activity: 'Pilates', minutes: 40 },
    { date: 'Feb 27', activity: 'Gym', minutes: 50 },
    { date: 'Feb 28', activity: 'Run', minutes: 35 },
  ];

  const nutritionData: NutritionDataPoint[] = [
    { date: 'Feb 22', vegetables: 3, fruits: 2, wholeGrains: 2, sugaryBeverages: 1 },
    { date: 'Feb 23', vegetables: 4, fruits: 1, wholeGrains: 3, sugaryBeverages: 0 },
    { date: 'Feb 24', vegetables: 2, fruits: 3, wholeGrains: 1, sugaryBeverages: 2 },
    { date: 'Feb 25', vegetables: 5, fruits: 2, wholeGrains: 4, sugaryBeverages: 0 },
    { date: 'Feb 26', vegetables: 3, fruits: 4, wholeGrains: 2, sugaryBeverages: 1 },
    { date: 'Feb 27', vegetables: 4, fruits: 2, wholeGrains: 3, sugaryBeverages: 0 },
    { date: 'Feb 28', vegetables: 3, fruits: 3, wholeGrains: 2, sugaryBeverages: 1 },
  ];

  const latestNutrition = nutritionData[nutritionData.length - 1];

  const avgHeartRate = Math.round(vitalsData.reduce((acc, curr) => acc + curr.heartRate, 0) / vitalsData.length);
  const avgBloodPressure = {
    systolic: Math.round(vitalsData.reduce((acc, curr) => acc + curr.systolic, 0) / vitalsData.length),
    diastolic: Math.round(vitalsData.reduce((acc, curr) => acc + curr.diastolic, 0) / vitalsData.length)
  };
  const totalActivityMinutes = activityData.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalVeggies = nutritionData.reduce((acc, curr) => acc + curr.vegetables, 0);
  const totalFruits = nutritionData.reduce((acc, curr) => acc + curr.fruits, 0);
  const totalWholeGrains = nutritionData.reduce((acc, curr) => acc + curr.wholeGrains, 0);
  const totalSugaryBeverages = nutritionData.reduce((acc, curr) => acc + curr.sugaryBeverages, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        {/* Summary Cards */}
        <View style={styles.summaryCards}>
          <SummaryCard
            icon={<Heart color={themeAwareColors.heartRate} size={24} />}
            title="Heart Rate"
            value={avgHeartRate}
            unit="bpm"
          />
          
          <SummaryCard
            icon={<TrendingUp color={themeAwareColors.bloodPressure} size={24} />}
            title="Blood Pressure"
            value={`${avgBloodPressure.systolic}/${avgBloodPressure.diastolic}`}
          />

          <SummaryCard
            icon={<Scale color={themeAwareColors.weight} size={24} />}
            title="Weight"
            value={vitalsData[vitalsData.length - 1].weight}
            unit="kg"
          />

          <SummaryCard
            icon={<Activity color={themeAwareColors.activity} size={24} />}
            title="Activity"
            value={totalActivityMinutes}
            unit="min"
          />

          <SummaryCard
            icon={<Utensils color={themeAwareColors.vegetables} size={24} /> }
              title="Nutrition"
              value={totalVeggies + totalFruits + totalWholeGrains}
            unit="servings"
          />
        </View>

        {/* Today's Nutrition */}
        <View style={styles.section}>
          <Card>
            <CardHeader>
              <View style={styles.nutritionHeader}>
                <Text style={styles.cardTitle}>Feb 28</Text>
                <Text style={styles.normalText}>
                  {latestNutrition.vegetables + latestNutrition.fruits + latestNutrition.wholeGrains + latestNutrition.sugaryBeverages} servings
                </Text>
              </View>
            </CardHeader>
            <CardContent>
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


            </CardContent>
          </Card>
        </View>

        {/* Heart Rate Chart Section */}
        <View style={styles.section}>
          <Card>
            <CardHeader>
              <View style={styles.cardHeaderWithIcon}>
                <Heart size={18} color={themeAwareColors.heartRate} style={{ marginRight: 8 }} />
                <Text style={styles.cardTitle}>Heart Rate</Text>
              </View>
              <Text style={styles.cardDescription}>Weekly Trends</Text>
            </CardHeader>
            <CardContent>
              <Text style={styles.chartTitle}>Heart Rate (bpm)</Text>
              
              <HeartRateChart 
                data={vitalsData} 
                color={themeAwareColors.heartRate} 
              />
              
              {/* Simple data display */}
              <View style={styles.dataRows}>
                {vitalsData.map((item, index) => (
                  <View key={index} style={styles.dataRow}>
                    <Text style={styles.dataDate}>{item.date}</Text>
                    <Text style={styles.dataValue}>{item.heartRate} bpm</Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Blood Pressure Chart Section */}
        <View style={styles.section}>
          <Card>
            <CardHeader>
              <View style={styles.cardHeaderWithIcon}>
                <TrendingUp size={18} color={themeAwareColors.bloodPressure} style={{ marginRight: 8 }} />
                <Text style={styles.cardTitle}>Blood Pressure</Text>
              </View>
              <Text style={styles.cardDescription}>Systolic & Diastolic</Text>
            </CardHeader>
            <CardContent>
              <Text style={styles.chartTitle}>Blood Pressure</Text>
              
              <BloodPressureChart 
                data={vitalsData} 
                color={themeAwareColors.bloodPressure} 
              />
              
              {/* Simple data display */}
              <View style={styles.dataRows}>
                {vitalsData.map((item, index) => (
                  <View key={index} style={styles.dataRow}>
                    <Text style={styles.dataDate}>{item.date}</Text>
                    <Text style={styles.dataValue}>{item.systolic}/{item.diastolic}</Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Activity Breakdown Section */}
        <View style={styles.section}>
          <Card>
            <CardHeader>
              <View style={styles.cardHeaderWithIcon}>
                <Activity size={18} color={themeAwareColors.activity} style={{ marginRight: 8 }} />
                <Text style={styles.cardTitle}>Activity Breakdown</Text>
              </View>
              <Text style={styles.cardDescription}>Minutes by activity type</Text>
            </CardHeader>
            <CardContent>
              <View style={styles.tabButtons}>
                <TouchableOpacity 
                  style={[
                    styles.tabButton, 
                    activityViewMode === 'chart' && styles.activeTab
                  ]}
                  onPress={() => setActivityViewMode('chart')}
                >
                  <Text style={styles.tabButtonText}>Chart</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.tabButton, 
                    activityViewMode === 'list' && styles.activeTab
                  ]}
                  onPress={() => setActivityViewMode('list')}
                >
                  <Text style={styles.tabButtonText}>List</Text>
                </TouchableOpacity>
              </View>
              
              {activityViewMode === 'chart' ? (
                <View style={styles.chartSection}>
                  <Text style={styles.chartTitle}>Activity Distribution</Text>
                  
                  <ActivityBarChart 
                    data={activityData} 
                    color={themeAwareColors.activity} 
                  />
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
                            <View style={[
                              styles.activityBarFill, 
                              { 
                                width: `${(day.minutes / 120) * 100}%`,
                                backgroundColor: day.activity === 'Run' 
                                  ? themeAwareColors.activity 
                                  : '#8884d8'
                              }
                            ]}>
                              <Text style={styles.activityBarLabel} numberOfLines={1}>
                                {day.activity} - {day.minutes} minutes
                              </Text>
                            </View>
                          )}
                          {day.minutes === 0 && (
                            <Text style={styles.restDayLabel}>Rest Day</Text>
                          )}
                        </View>
                        <Text style={styles.activityMinutes}>{day.minutes} min</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
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
  },
  summaryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 140,
    flex: 1,
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
    fontWeight: "500",
    color: theme.colors.text,
  },
  summaryUnit: {
    fontSize: 14,
    fontWeight: "normal",
  },
  section: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  nutritionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    backgroundColor: '#f5f5f5',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dataDate: {
    color: theme.colors.text,
    opacity: 0.7,
  },
  dataValue: {
    fontWeight: '500',
    color: theme.colors.text,
  },
  tabButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#f5f5f5',
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
});

export default DashboardScreen;