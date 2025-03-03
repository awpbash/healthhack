import React, { useState, useEffect, ReactNode, createContext, useContext } from "react";
import type { FC } from "react";
import type { DemoTabScreenProps } from "../navigators/TabNavigator";
import { Activity, Heart, Scale, Utensils, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

// Theme Context and Provider
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

const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  
  // Effect to detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
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

// Define TypeScript interfaces for better type safety
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

interface CardProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

interface CardHeaderProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

interface CardTitleProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

interface CardDescriptionProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

interface CardContentProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

interface TabButtonProps {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}

interface DataTableProps {
  title: string;
  data: DataTableItem[];
  color: string;
  unit?: string;
}

interface NutritionSummaryProps {
  title: string;
  value: number;
  color: string;
  bgColor: string;
}

// Safe type definition for activity colors
const getActivityColors = (isDark: boolean): Record<string, string> => ({
  'Run': '#FF8042',
  'Swim': '#0088FE',
  'Cycle': '#00C49F',
  'Pilates': '#FFBB28',
  'Gym': '#8884d8',
  'Rest': isDark ? '#CCCCCC' : '#999999'
});

// Main Dashboard Component with theme support
const DashboardScreen: FC<DemoTabScreenProps<"DashboardScreen">> = (_props) => {
  const { isDark, colors, toggleTheme } = useTheme();
  const [timeframe, setTimeframe] = useState('week');
  const [activeTab, setActiveTab] = useState('heartRate');
  
  // Theme-aware color constants
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

  // Get latest nutrition data for detailed view
  const latestNutrition = nutritionData[nutritionData.length - 1];

  // Weekly summary calculations
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
    <div style={{ 
      backgroundColor: colors.background, 
      color: colors.text.primary,
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "auto",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    }}>      
      <div style={{ padding: 16 }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          marginBottom: 20,
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12
        }}>
          <div>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 500, 
              margin: 0, 
              marginBottom: 6,
              letterSpacing: "-0.5px",
              color: colors.text.primary
            }}>
              Health Dashboard
            </h1>
            <p style={{ 
              color: colors.text.secondary, 
              margin: 0,
              fontSize: 16
            }}>
              February 22 - 28, 2025
            </p>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            {/* Theme Toggle Button */}
            <button 
              style={{
                backgroundColor: colors.cardBackground,
                color: colors.text.primary,
                border: "none",
                borderRadius: 20,
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: 14
              }}
              onClick={toggleTheme}
            >
              {isDark ? "🌙 Dark" : "☀️ Light"}
            </button>
            
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              backgroundColor: colors.cardBackground,
              borderRadius: 24,
              padding: "4px 4px",
              minWidth: 180
            }}>
              <button style={{ 
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <ChevronLeft color={colors.text.primary} size={18} />
              </button>
              <div style={{ 
                flex: 1,
                textAlign: "center"
              }}>
                <select 
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: colors.text.primary,
                    fontSize: 16,
                    fontWeight: 500,
                    outline: "none",
                    cursor: "pointer",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                    textAlign: "center",
                    textAlignLast: "center",
                    paddingRight: 16
                  }}
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="day">Daily</option>
                  <option value="week">Weekly</option>
                  <option value="month">Monthly</option>
                </select>
              </div>
              <button style={{ 
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <ChevronRight color={colors.text.primary} size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", 
          gap: 12,
          marginBottom: 20
        }}>
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
            icon={<Utensils color={themeAwareColors.vegetables} size={24} />}
            title="Nutrition"
            value={totalVeggies + totalFruits + totalWholeGrains}
            unit="servings"
          />
        </div>

        {/* Today's Nutrition */}
        <div style={{ marginBottom: 20 }}>
          <Card>
            <CardHeader>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ fontSize: 18, fontWeight: 500 }}>Feb 28</div>
                <div style={{ fontSize: 16 }}>
                  {latestNutrition.vegetables + latestNutrition.fruits + latestNutrition.wholeGrains} servings
                </div>
              </div>
            </CardHeader>
            <CardContent style={{ padding: 16 }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4
                }}>
                  <span style={{ color: themeAwareColors.vegetables, fontSize: 16 }}>Vegetables</span>
                  <span style={{ fontSize: 16 }}>{latestNutrition.vegetables}</span>
                </div>
                <div style={{ 
                  height: 8, 
                  backgroundColor: colors.cardBackground,
                  borderRadius: 4,
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    height: "100%", 
                    width: `${(latestNutrition.vegetables / 5) * 100}%`,
                    backgroundColor: themeAwareColors.vegetables,
                    borderRadius: 4
                  }}></div>
                </div>
              </div>
              
              <div style={{ marginBottom: 14 }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4
                }}>
                  <span style={{ color: themeAwareColors.fruits, fontSize: 16 }}>Fruits</span>
                  <span style={{ fontSize: 16 }}>{latestNutrition.fruits}</span>
                </div>
                <div style={{ 
                  height: 8, 
                  backgroundColor: colors.cardBackground,
                  borderRadius: 4,
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    height: "100%", 
                    width: `${(latestNutrition.fruits / 5) * 100}%`,
                    backgroundColor: themeAwareColors.fruits,
                    borderRadius: 4
                  }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4
                }}>
                  <span style={{ color: themeAwareColors.wholeGrains, fontSize: 16 }}>Whole Grains</span>
                  <span style={{ fontSize: 16 }}>{latestNutrition.wholeGrains}</span>
                </div>
                <div style={{ 
                  height: 8, 
                  backgroundColor: colors.cardBackground,
                  borderRadius: 4,
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    height: "100%", 
                    width: `${(latestNutrition.wholeGrains / 5) * 100}%`,
                    backgroundColor: themeAwareColors.wholeGrains,
                    borderRadius: 4
                  }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nutrition Summary */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 20
        }}>
          <NutritionSummary
            title="Vegetables"
            value={totalVeggies}
            color={themeAwareColors.vegetables}
            bgColor={isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.08)"}
          />
          
          <NutritionSummary
            title="Fruits"
            value={totalFruits}
            color={themeAwareColors.fruits}
            bgColor={isDark ? "rgba(234, 179, 8, 0.15)" : "rgba(234, 179, 8, 0.08)"}
          />
          
          <NutritionSummary
            title="Whole Grains"
            value={totalWholeGrains}
            color={themeAwareColors.wholeGrains}
            bgColor={isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(139, 92, 246, 0.08)"}
          />
          
          <NutritionSummary
            title="Sugary Beverages"
            value={totalSugaryBeverages}
            color={themeAwareColors.sugaryBeverages}
            bgColor={isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.08)"}
          />
        </div>

        {/* Vitals Tracking */}
        <div style={{ marginBottom: 20 }}>
          <Card>
            <CardHeader>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Heart size={18} color={themeAwareColors.heartRate} style={{ marginRight: 8 }} />
                <CardTitle>Vitals Tracking</CardTitle>
              </div>
              <CardDescription>Heart rate, blood pressure, weight</CardDescription>
            </CardHeader>
            <CardContent style={{ padding: 0 }}>
              <div style={{ 
                display: "flex", 
                borderBottom: `1px solid ${colors.border}`
              }}>
                <TabButton 
                  active={activeTab === 'heartRate'} 
                  onClick={() => setActiveTab('heartRate')}
                >
                  Heart Rate
                </TabButton>
                <TabButton 
                  active={activeTab === 'bloodPressure'} 
                  onClick={() => setActiveTab('bloodPressure')}
                >
                  Blood Pressure
                </TabButton>
                <TabButton 
                  active={activeTab === 'weight'} 
                  onClick={() => setActiveTab('weight')}
                >
                  Weight
                </TabButton>
              </div>
              
              <div style={{ padding: 16 }}>
                {activeTab === 'heartRate' && (
                  <DataTable
                    title="Heart Rate (bpm)"
                    data={vitalsData.map(item => ({
                      label: item.date,
                      value: item.heartRate
                    }))}
                    color={themeAwareColors.heartRate}
                    unit="bpm"
                  />
                )}
                
                {activeTab === 'bloodPressure' && (
                  <DataTable
                    title="Blood Pressure"
                    data={vitalsData.map(item => ({
                      label: item.date,
                      value: `${item.systolic}/${item.diastolic}`
                    }))}
                    color={themeAwareColors.bloodPressure}
                  />
                )}
                
                {activeTab === 'weight' && (
                  <DataTable
                    title="Weight (kg)"
                    data={vitalsData.map(item => ({
                      label: item.date,
                      value: item.weight
                    }))}
                    color={themeAwareColors.weight}
                    unit="kg"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Breakdown */}
        <div style={{ marginBottom: 20 }}>
          <Card>
            <CardHeader>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Activity size={18} color={themeAwareColors.activity} style={{ marginRight: 8 }} />
                <CardTitle>Activity Breakdown</CardTitle>
              </div>
              <CardDescription>Minutes by activity type</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: 16, fontWeight: 500 }}>Daily Activity</h3>
                {activityData.map((day, index) => (
                  <div key={index} style={{ 
                    marginBottom: 16
                  }}>
                    <div style={{ 
                      fontWeight: 500,
                      fontSize: 14,
                      marginBottom: 6,
                      color: colors.text.secondary
                    }}>
                      {day.date}
                    </div>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center" 
                    }}>
                      <div style={{ 
                        flex: 1, 
                        height: 24, 
                        backgroundColor: colors.cardBackground, 
                        borderRadius: 12,
                        position: "relative",
                        overflow: "hidden"
                      }}>
                        {day.minutes > 0 && (
                          <div style={{ 
                            width: `${(day.minutes / 120) * 100}%`,
                            maxWidth: "100%", 
                            height: "100%", 
                            backgroundColor: getActivityColors(isDark)[day.activity] || "#999",
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: 10
                          }}>
                            <span style={{ 
                              fontSize: 12, 
                              fontWeight: 500,
                              color: isDark ? "#fff" : "#000",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "100%"
                            }}>
                              {day.activity} - {day.minutes} minutes
                            </span>
                          </div>
                        )}
                        {day.minutes === 0 && (
                          <div style={{ 
                            position: "absolute",
                            left: 10,
                            top: 0,
                            height: "100%",
                            display: "flex",
                            alignItems: "center"
                          }}>
                            <span style={{ fontSize: 12 }}>Rest Day</span>
                          </div>
                        )}
                      </div>
                      <div style={{ 
                        minWidth: 50, 
                        textAlign: "right", 
                        marginLeft: 8,
                        fontSize: 14,
                        fontWeight: 500
                      }}>
                        {day.minutes} min
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <h3 style={{ margin: "0 0 12px 0", fontSize: 16, fontWeight: 500 }}>Activity Types</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {Object.entries(getActivityColors(isDark)).map(([activity, color]) => (
                    <div key={activity} style={{ 
                      display: "flex", 
                      alignItems: "center",
                      padding: "4px 8px",
                      backgroundColor: colors.cardBackground,
                      borderRadius: 12
                    }}>
                      <div style={{ 
                        width: 10, 
                        height: 10, 
                        backgroundColor: color,
                        borderRadius: 5,
                        marginRight: 6
                      }}></div>
                      <span style={{ fontSize: 13 }}>{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Component helper functions
const SummaryCard: FC<{
  icon: ReactNode;
  title: string;
  value: number | string;
  unit?: string;
}> = ({ icon, title, value, unit }) => {
  const { colors } = useTheme();
  
  return (
    <div style={{ 
      backgroundColor: colors.cardBackground, 
      borderRadius: 12, 
      padding: 16,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center"
    }}>
      <div style={{ marginBottom: 8 }}>
        {icon}
      </div>
      <p style={{ 
        color: colors.text.secondary, 
        fontSize: 14, 
        margin: 0, 
        marginBottom: 4 
      }}>
        {title}
      </p>
      <h3 style={{ 
        fontSize: 24, 
        fontWeight: 500, 
        margin: 0, 
        lineHeight: 1.2,
        color: colors.text.primary
      }}>
        {value} {unit && <span style={{ fontSize: 14, fontWeight: "normal" }}>{unit}</span>}
      </h3>
    </div>
  );
};

const Card: FC<CardProps> = ({ children, style = {} }) => {
  const { colors } = useTheme();
  
  return (
    <div style={{ 
      backgroundColor: colors.cardBackground, 
      borderRadius: 12, 
      overflow: "hidden",
      ...style
    }}>
      {children}
    </div>
  );
};

const CardHeader: FC<CardHeaderProps> = ({ children, style = {} }) => {
  const { colors } = useTheme();
  
  return (
    <div style={{ 
      padding: 16,
      borderBottom: `1px solid ${colors.border}`,
      ...style
    }}>
      {children}
    </div>
  );
};

const CardTitle: FC<CardTitleProps> = ({ children, style = {} }) => {
  const { colors } = useTheme();
  
  return (
    <h2 style={{ 
      fontSize: 18, 
      fontWeight: 500,
      margin: 0,
      color: colors.text.primary,
      ...style
    }}>
      {children}
    </h2>
  );
};

const CardDescription: FC<CardDescriptionProps> = ({ children, style = {} }) => {
  const { colors } = useTheme();
  
  return (
    <p style={{ 
      fontSize: 14, 
      color: colors.text.secondary,
      margin: 0,
      marginTop: 4,
      ...style
    }}>
      {children}
    </p>
  );
};

const CardContent: FC<CardContentProps> = ({ children, style = {} }) => (
  <div style={{ 
    padding: 16,
    ...style
  }}>
    {children}
  </div>
);

const TabButton: FC<TabButtonProps> = ({ children, active, onClick }) => {
  const { colors } = useTheme();
  
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 12px",
        backgroundColor: active ? colors.tabActive : "transparent",
        border: "none",
        color: active ? colors.text.primary : colors.text.secondary,
        fontWeight: active ? "500" : "normal",
        cursor: "pointer",
        fontSize: 14,
        flex: 1,
        textAlign: "center"
      }}
    >
      {children}
    </button>
  );
};

const DataTable: FC<DataTableProps> = ({ title, data, color, unit = "" }) => {
  const { colors, isDark } = useTheme();
  
  // Safely calculate the maximum value for the bar widths
  const numericData = data.filter((item): item is { label: string; value: number } => 
    typeof item.value === 'number'
  );
  
  const maxValue = numericData.length > 0 
    ? Math.max(...numericData.map(item => item.value))
    : 100;

  return (
    <div>
      <h3 style={{ margin: "0 0 12px 0", fontSize: 16, fontWeight: 500, color: colors.text.primary }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((item, idx) => (
          <div 
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px",
              backgroundColor: idx % 2 === 0 ? colors.cardBackgroundAlt : colors.cardBackground,
              borderRadius: 8
            }}
          >
            <div style={{ width: 80, fontSize: 14, color: colors.text.primary }}>{item.label}</div>
            <div 
              style={{ 
                flex: 1, 
                height: 6, 
                backgroundColor: colors.progressBackground,
                borderRadius: 3,
                marginRight: 12
              }}
            >
              <div 
                style={{ 
                  height: "100%", 
                  width: typeof item.value === 'number' 
                    ? `${(item.value / maxValue) * 100}%` 
                    : "50%",
                  backgroundColor: color,
                  borderRadius: 3
                }}
              ></div>
            </div>
            <div style={{ 
              fontWeight: 500,
              fontSize: 16,
              minWidth: 55,
              textAlign: "right",
              color: colors.text.primary
            }}>
              {item.value} {unit && <span style={{ fontSize: 12 }}>{unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NutritionSummary: FC<NutritionSummaryProps> = ({ title, value, color, bgColor }) => {
  const { colors } = useTheme();
  
  return (
    <div style={{ 
      padding: 16, 
      borderRadius: 12, 
      backgroundColor: bgColor 
    }}>
      <h4 style={{ 
        fontSize: 16, 
        fontWeight: 500, 
        margin: 0,
        marginBottom: 8, 
        color: color 
      }}>
        {title}
      </h4>
      <div style={{ 
        fontSize: 24, 
        fontWeight: 500, 
        color: color,
        lineHeight: 1.2 
      }}>
        {value}
      </div>
    </div>
  );
};

// Export ThemeProvider wrapped Dashboard Component
const ThemedDashboardScreen: FC<DemoTabScreenProps<"DashboardScreen">> = (props) => {
  return (
    <ThemeProvider>
      <DashboardScreen {...props} />
    </ThemeProvider>
  );
};

export default ThemedDashboardScreen;