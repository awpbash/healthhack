// DashboardScreen.tsx
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Appearance } from 'react-native';

// Replace these with your favorite icon library or custom icons
const HeartIcon = () => <Text>❤️</Text>;
const TrendingUpIcon = () => <Text>📈</Text>;
const ScaleIcon = () => <Text>⚖️</Text>;
const ActivityIcon = () => <Text>🏃‍♂️</Text>;
const UtensilsIcon = () => <Text>🍽️</Text>;
const ChevronLeftIcon = () => <Text>{'<'}</Text>;
const ChevronRightIcon = () => <Text>{'>'}</Text>;

// -----------------------
// Theme Context & Provider
// -----------------------
interface ThemeContextType {
  isDark: boolean;
  colors: {
    background: string;
    cardBackground: string;
    cardBackgroundAlt: string;
    tabActive: string;
    border: string;
    text: {
      primary: string;
      secondary: string;
    };
    progressBackground: string;
  };
  toggleTheme: () => void;
}

const defaultTheme: ThemeContextType = {
  isDark: true,
  colors: {
    background: "#1a0e13",
    cardBackground: "#2a1a23",
    cardBackgroundAlt: "#3a2a33",
    tabActive: "#3a2a33",
    border: "#3a2a33",
    text: {
      primary: "#fff",
      secondary: "#888",
    },
    progressBackground: "#4a3a43",
  },
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultTheme);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = Appearance.getColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
    });
    return () => subscription.remove();
  }, []);

  const colors = isDark
    ? {
        background: "#1a0e13",
        cardBackground: "#2a1a23",
        cardBackgroundAlt: "#3a2a33",
        tabActive: "#3a2a33",
        border: "#3a2a33",
        text: {
          primary: "#fff",
          secondary: "#888",
        },
        progressBackground: "#4a3a43",
      }
    : {
        background: "#f5f5f7",
        cardBackground: "#ffffff",
        cardBackgroundAlt: "#f0f0f2",
        tabActive: "#e6e6e9",
        border: "#e0e0e3",
        text: {
          primary: "#111",
          secondary: "#666",
        },
        progressBackground: "#e6e6e9",
      };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

// -----------------------
// Data Interfaces & Sample Data
// -----------------------
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

interface DataTableItem {
  label: string;
  value: number | string;
}

// -----------------------
// Main Dashboard Screen
// -----------------------
const DashboardScreen = () => {
  const { isDark, colors, toggleTheme } = useTheme();
  const [timeframe, setTimeframe] = useState('week');
  const [activeTab, setActiveTab] = useState('heartRate');

  const themeAwareColors = {
    heartRate: "#ef4444",
    bloodPressure: "#3b82f6",
    weight: "#a855f7",
    activity: "#f97316",
    vegetables: "#22c55e",
    fruits: "#eab308",
    wholeGrains: "#8b5cf6",
    sugaryBeverages: "#ef4444"
  };

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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={[styles.title, { color: colors.text.primary }]}>Health Dashboard</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>February 22 - 28, 2025</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: colors.cardBackground }]}
            onPress={toggleTheme}
          >
            <Text style={{ color: colors.text.primary }}>{isDark ? "🌙 Dark" : "☀️ Light"}</Text>
          </TouchableOpacity>
          <View style={[styles.pickerContainer, { backgroundColor: colors.cardBackground }]}>
            <TouchableOpacity style={styles.arrowButton}>
              <ChevronLeftIcon />
            </TouchableOpacity>
            <Picker
              selectedValue={timeframe}
              style={[styles.picker, { color: colors.text.primary }]}
              onValueChange={(itemValue) => setTimeframe(itemValue)}
              mode="dropdown"
            >
              <Picker.Item label="Daily" value="day" />
              <Picker.Item label="Weekly" value="week" />
              <Picker.Item label="Monthly" value="month" />
            </Picker>
            <TouchableOpacity style={styles.arrowButton}>
              <ChevronRightIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryCardsContainer}>
        <SummaryCard
          icon={<HeartIcon />}
          title="Heart Rate"
          value={avgHeartRate}
          unit="bpm"
        />
        <SummaryCard
          icon={<TrendingUpIcon />}
          title="Blood Pressure"
          value={`${avgBloodPressure.systolic}/${avgBloodPressure.diastolic}`}
        />
        <SummaryCard
          icon={<ScaleIcon />}
          title="Weight"
          value={vitalsData[vitalsData.length - 1].weight}
          unit="kg"
        />
        <SummaryCard
          icon={<ActivityIcon />}
          title="Activity"
          value={totalActivityMinutes}
          unit="min"
        />
        <SummaryCard
          icon={<UtensilsIcon />}
          title="Nutrition"
          value={totalVeggies + totalFruits + totalWholeGrains}
          unit="servings"
        />
      </View>

      {/* Nutrition Summary */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Nutrition Summary</Text>
        <View style={styles.nutritionSummaryContainer}>
          <NutritionSummary
            title="Vegetables"
            value={totalVeggies}
            color={themeAwareColors.vegetables}
            bgColor={colors.cardBackgroundAlt}
          />
          <NutritionSummary
            title="Fruits"
            value={totalFruits}
            color={themeAwareColors.fruits}
            bgColor={colors.cardBackgroundAlt}
          />
          <NutritionSummary
            title="Whole Grains"
            value={totalWholeGrains}
            color={themeAwareColors.wholeGrains}
            bgColor={colors.cardBackgroundAlt}
          />
          <NutritionSummary
            title="Sugary Beverages"
            value={totalSugaryBeverages}
            color={themeAwareColors.sugaryBeverages}
            bgColor={colors.cardBackgroundAlt}
          />
        </View>
      </View>
      {/* Additional sections (Vitals Tracking, Activity Breakdown, etc.) */}
    </ScrollView>
  );
};

// -----------------------
// Helper Components
// -----------------------
const SummaryCard = ({
  icon,
  title,
  value,
  unit,
}: {
  icon: ReactNode;
  title: string;
  value: number | string;
  unit?: string;
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={[styles.cardTitle, { color: colors.text.secondary }]}>{title}</Text>
      <Text style={[styles.cardValue, { color: colors.text.primary }]}>{value} {unit}</Text>
    </View>
  );
};

const NutritionSummary = ({
  title,
  value,
  color,
  bgColor,
}: {
  title: string;
  value: number;
  color: string;
  bgColor: string;
}) => {
  return (
    <View style={[styles.nutritionCard, { backgroundColor: bgColor }]}>
      <Text style={[styles.nutritionTitle, { color }]}>{title}</Text>
      <Text style={[styles.nutritionValue, { color }]}>{value}</Text>
    </View>
  );
};

// -----------------------
// Styles
// -----------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 12,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    padding: 4,
    minWidth: 180,
  },
  arrowButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    flex: 1,
  },
  summaryCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  nutritionSummaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionCard: {
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  nutritionValue: {
    fontSize: 24,
    fontWeight: '500',
  },
});

// -----------------------
// Export the Themed Dashboard
// -----------------------
const ThemedDashboardScreen = () => (
  <ThemeProvider>
    <DashboardScreen />
  </ThemeProvider>
);

export default ThemedDashboardScreen;

