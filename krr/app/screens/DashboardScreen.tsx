import React, { useState, useEffect, ReactNode } from "react";
import type { FC } from "react";
import type { DemoTabScreenProps } from "../navigators/TabNavigator";
import { Activity, Heart, Scale, Utensils, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

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
const ACTIVITY_COLORS: Record<string, string> = {
  'Run': '#FF8042',
  'Swim': '#0088FE',
  'Cycle': '#00C49F',
  'Pilates': '#FFBB28',
  'Gym': '#8884d8',
  'Rest': '#CCCCCC'
};

// Main Dashboard Component with type-safe implementation
const DashboardScreen: FC<DemoTabScreenProps<"DashboardScreen">> = (_props) => {
  const [timeframe, setTimeframe] = useState('week');
  const [activeTab, setActiveTab] = useState('heartRate');
  
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
      backgroundColor: "#000", 
      color: "#fff",
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
          marginBottom: 16,
          justifyContent: "space-between"
        }}>
          <div>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 500, 
              margin: 0, 
              marginBottom: 4,
              letterSpacing: "-0.5px"
            }}>
              Health Dashboard
            </h1>
            <p style={{ 
              color: "#999", 
              margin: 0,
              fontSize: 16
            }}>
              February 22 - 28, 2025
            </p>
          </div>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            backgroundColor: "#1a1a1a",
            borderRadius: 24,
            padding: "4px 4px"
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
              <ChevronLeft color="#fff" size={18} />
            </button>
            <div style={{ 
              padding: "0 8px"
            }}>
              <span style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: 500
              }}>
                {timeframe === 'week' ? 'Weekly' : timeframe === 'month' ? 'Monthly' : 'Yearly'}
              </span>
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
              <ChevronRight color="#fff" size={18} />
            </button>
          </div>
        </div>

        {/* Summary Cards - Grid layout for larger screens, flexbox for smaller screens */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", 
          gap: 12,
          marginBottom: 16
        }}>
          <SummaryCard
            icon={<Heart color="#ef4444" size={24} />}
            title="Heart Rate"
            value={avgHeartRate}
            unit="bpm"
          />
          
          <SummaryCard
            icon={<TrendingUp color="#3b82f6" size={24} />}
            title="Blood Pressure"
            value={`${avgBloodPressure.systolic}/${avgBloodPressure.diastolic}`}
          />

          <SummaryCard
            icon={<Scale color="#a855f7" size={24} />}
            title="Weight"
            value={vitalsData[vitalsData.length - 1].weight}
            unit="kg"
          />

          <SummaryCard
            icon={<Activity color="#f97316" size={24} />}
            title="Activity"
            value={totalActivityMinutes}
            unit="min"
          />

          <SummaryCard
            icon={<Utensils color="#22c55e" size={24} />}
            title="Nutrition"
            value={totalVeggies + totalFruits + totalWholeGrains}
            unit="servings"
          />
        </div>

        {/* Today's Nutrition */}
        <div style={{ marginBottom: 16 }}>
          <Card>
            <CardHeader>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ fontSize: 18, fontWeight: 500 }}>Feb 28</div>
                <div style={{ fontSize: 16 }}>{latestNutrition.vegetables + latestNutrition.fruits + latestNutrition.wholeGrains} servings</div>
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
                  <span style={{ color: "#22c55e", fontSize: 16 }}>Vegetables</span>
                  <span style={{ fontSize: 16 }}>{latestNutrition.vegetables}</span>
                </div>
                <div style={{ 
                  height: 8, 
                  backgroundColor: "#222",
                  borderRadius: 4,
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    height: "100%", 
                    width: `${(latestNutrition.vegetables / 5) * 100}%`,
                    backgroundColor: "#22c55e",
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
                  <span style={{ color: "#eab308", fontSize: 16 }}>Fruits</span>
                  <span style={{ fontSize: 16 }}>{latestNutrition.fruits}</span>
                </div>
                <div style={{ 
                  height: 8, 
                  backgroundColor: "#222",
                  borderRadius: 4,
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    height: "100%", 
                    width: `${(latestNutrition.fruits / 5) * 100}%`,
                    backgroundColor: "#eab308",
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
                  <span style={{ color: "#8b5cf6", fontSize: 16 }}>Whole Grains</span>
                  <span style={{ fontSize: 16 }}>{latestNutrition.wholeGrains}</span>
                </div>
                <div style={{ 
                  height: 8, 
                  backgroundColor: "#222",
                  borderRadius: 4,
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    height: "100%", 
                    width: `${(latestNutrition.wholeGrains / 5) * 100}%`,
                    backgroundColor: "#8b5cf6",
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
          marginBottom: 16
        }}>
          <NutritionSummary
            title="Vegetables"
            value={totalVeggies}
            color="#22c55e"
            bgColor="rgba(34, 197, 94, 0.2)"
          />
          
          <NutritionSummary
            title="Fruits"
            value={totalFruits}
            color="#eab308"
            bgColor="rgba(234, 179, 8, 0.2)"
          />
          
          <NutritionSummary
            title="Whole Grains"
            value={totalWholeGrains}
            color="#8b5cf6"
            bgColor="rgba(139, 92, 246, 0.2)"
          />
          
          <NutritionSummary
            title="Sugary Beverages"
            value={totalSugaryBeverages}
            color="#ef4444"
            bgColor="rgba(239, 68, 68, 0.2)"
          />
        </div>

        {/* Vitals Tracking */}
        <div style={{ marginBottom: 16 }}>
          <Card>
            <CardHeader>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Heart size={18} color="#ef4444" style={{ marginRight: 8 }} />
                <CardTitle>Vitals Tracking</CardTitle>
              </div>
              <CardDescription>Heart rate, blood pressure, weight</CardDescription>
            </CardHeader>
            <CardContent style={{ padding: 0 }}>
              <div style={{ 
                display: "flex", 
                borderBottom: "1px solid #222"
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
                    color="#ef4444"
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
                    color="#3b82f6"
                  />
                )}
                
                {activeTab === 'weight' && (
                  <DataTable
                    title="Weight (kg)"
                    data={vitalsData.map(item => ({
                      label: item.date,
                      value: item.weight
                    }))}
                    color="#a855f7"
                    unit="kg"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Breakdown */}
        <div style={{ marginBottom: 16 }}>
          <Card>
            <CardHeader>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Activity size={18} color="#f97316" style={{ marginRight: 8 }} />
                <CardTitle>Activity Breakdown</CardTitle>
              </div>
              <CardDescription>Minutes by activity type</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: 16, fontWeight: 500 }}>Daily Minutes</h3>
                {activityData.map((day, index) => (
                  <div key={index} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    marginBottom: 10 
                  }}>
                    <div style={{ width: 50, fontSize: 14 }}>{day.date.split(' ')[1]}</div>
                    <div style={{ 
                      flex: 1, 
                      height: 24, 
                      backgroundColor: "#222", 
                      borderRadius: 12,
                      position: "relative",
                      overflow: "hidden"
                    }}>
                      {day.minutes > 0 && (
                        <div style={{ 
                          width: `${(day.minutes / 60) * 100}%`,
                          maxWidth: "100%", 
                          height: "100%", 
                          backgroundColor: ACTIVITY_COLORS[day.activity] || "#999",
                          borderRadius: 12,
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: 10
                        }}>
                          <span style={{ 
                            fontSize: 12, 
                            fontWeight: 500,
                            color: "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%"
                          }}>
                            {day.activity} - {day.minutes}min
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
                          <span style={{ fontSize: 12 }}>Rest</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <h3 style={{ margin: "0 0 12px 0", fontSize: 16, fontWeight: 500 }}>Activity Types</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {Object.entries(ACTIVITY_COLORS).map(([activity, color]) => (
                    <div key={activity} style={{ 
                      display: "flex", 
                      alignItems: "center",
                      padding: "4px 8px",
                      backgroundColor: "#222",
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
}> = ({ icon, title, value, unit }) => (
  <div style={{ 
    backgroundColor: "#111", 
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
      color: "#888", 
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
      lineHeight: 1.2 
    }}>
      {value} {unit && <span style={{ fontSize: 14, fontWeight: "normal" }}>{unit}</span>}
    </h3>
  </div>
);

const Card: FC<CardProps> = ({ children, style = {} }) => (
  <div style={{ 
    backgroundColor: "#111", 
    borderRadius: 12, 
    overflow: "hidden",
    ...style
  }}>
    {children}
  </div>
);

const CardHeader: FC<CardHeaderProps> = ({ children, style = {} }) => (
  <div style={{ 
    padding: 16,
    borderBottom: "1px solid #222",
    ...style
  }}>
    {children}
  </div>
);

const CardTitle: FC<CardTitleProps> = ({ children, style = {} }) => (
  <h2 style={{ 
    fontSize: 18, 
    fontWeight: 500,
    margin: 0,
    ...style
  }}>
    {children}
  </h2>
);

const CardDescription: FC<CardDescriptionProps> = ({ children, style = {} }) => (
  <p style={{ 
    fontSize: 14, 
    color: "#888",
    margin: 0,
    marginTop: 4,
    ...style
  }}>
    {children}
  </p>
);

const CardContent: FC<CardContentProps> = ({ children, style = {} }) => (
  <div style={{ 
    padding: 16,
    ...style
  }}>
    {children}
  </div>
);

const TabButton: FC<TabButtonProps> = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "10px 12px",
      backgroundColor: active ? "#222" : "transparent",
      border: "none",
      color: active ? "#fff" : "#888",
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

const DataTable: FC<DataTableProps> = ({ title, data, color, unit = "" }) => {
  // Safely calculate the maximum value for the bar widths
  const numericData = data.filter((item): item is { label: string; value: number } => 
    typeof item.value === 'number'
  );
  
  const maxValue = numericData.length > 0 
    ? Math.max(...numericData.map(item => item.value))
    : 100;

  return (
    <div>
      <h3 style={{ margin: "0 0 12px 0", fontSize: 16, fontWeight: 500 }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((item, idx) => (
          <div 
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px",
              backgroundColor: idx % 2 === 0 ? "#222" : "#191919",
              borderRadius: 8
            }}
          >
            <div style={{ width: 50, fontSize: 14 }}>{item.label.split(' ')[1]}</div>
            <div 
              style={{ 
                flex: 1, 
                height: 6, 
                backgroundColor: "#333",
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
              textAlign: "right"
            }}>
              {item.value} {unit && <span style={{ fontSize: 12 }}>{unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NutritionSummary: FC<NutritionSummaryProps> = ({ title, value, color, bgColor }) => (
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

export default DashboardScreen;