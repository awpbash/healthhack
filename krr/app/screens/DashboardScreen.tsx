import React from "react";
import { useState, FC } from "react";
import { DemoTabScreenProps } from "../navigators/TabNavigator";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Area } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import { Activity, Heart, Scale, Utensils, TrendingUp, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

// Define the component with DemoTabScreenProps but using type assertion to avoid errors
export const DashboardScreen: FC<DemoTabScreenProps<"DashboardScreen">> = function DashboardScreen(_props) {
  const [timeframe, setTimeframe] = useState('week');
  
  // Sample data for visualizations
  const vitalsData = [
    { date: "Feb 22", heartRate: 72, systolic: 122, diastolic: 78, weight: 78.2 },
    { date: 'Feb 23', heartRate: 74, systolic: 124, diastolic: 80, weight: 78.0 },
    { date: 'Feb 24', heartRate: 70, systolic: 120, diastolic: 76, weight: 77.8 },
    { date: 'Feb 25', heartRate: 75, systolic: 126, diastolic: 82, weight: 77.9 },
    { date: 'Feb 26', heartRate: 71, systolic: 118, diastolic: 75, weight: 77.5 },
    { date: 'Feb 27', heartRate: 73, systolic: 121, diastolic: 77, weight: 77.7 },
    { date: 'Feb 28', heartRate: 69, systolic: 119, diastolic: 76, weight: 77.4 },
  ];

  const activityData = [
    { date: 'Feb 22', activity: 'Run', minutes: 30 },
    { date: 'Feb 23', activity: 'Swim', minutes: 45 },
    { date: 'Feb 24', activity: 'Rest', minutes: 0 },
    { date: 'Feb 25', activity: 'Cycle', minutes: 60 },
    { date: 'Feb 26', activity: 'Pilates', minutes: 40 },
    { date: 'Feb 27', activity: 'Gym', minutes: 50 },
    { date: 'Feb 28', activity: 'Run', minutes: 35 },
  ];

  // Transform activity data for the stacked bar chart
  const transformActivityData = () => {
    const dates = [...new Set(activityData.map(item => item.date))];
    const activities = [...new Set(activityData.filter(item => item.activity !== 'Rest').map(item => item.activity))];
    
    return dates.map(date => {
      const dateData: Record<string, any> = { date };
      activities.forEach(activity => {
        const match = activityData.find(item => item.date === date && item.activity === activity);
        dateData[activity] = match ? match.minutes : 0;
      });
      return dateData;
    });
  };

  const nutritionData = [
    { date: 'Feb 22', vegetables: 3, fruits: 2, wholeGrains: 2, sugaryBeverages: 1 },
    { date: 'Feb 23', vegetables: 4, fruits: 1, wholeGrains: 3, sugaryBeverages: 0 },
    { date: 'Feb 24', vegetables: 2, fruits: 3, wholeGrains: 1, sugaryBeverages: 2 },
    { date: 'Feb 25', vegetables: 5, fruits: 2, wholeGrains: 4, sugaryBeverages: 0 },
    { date: 'Feb 26', vegetables: 3, fruits: 4, wholeGrains: 2, sugaryBeverages: 1 },
    { date: 'Feb 27', vegetables: 4, fruits: 2, wholeGrains: 3, sugaryBeverages: 0 },
    { date: 'Feb 28', vegetables: 3, fruits: 3, wholeGrains: 2, sugaryBeverages: 1 },
  ];

  // Aggregated activity minutes by type
  const activitySummary = [
    { name: 'Run', total: 65 },
    { name: 'Swim', total: 45 },
    { name: 'Cycle', total: 60 },
    { name: 'Pilates', total: 40 },
    { name: 'Gym', total: 50 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  type ActivityType = 'Run' | 'Swim' | 'Cycle' | 'Pilates' | 'Gym';
  
  const ACTIVITY_COLORS: Record<ActivityType, string> = {
    'Run': '#FF8042',
    'Swim': '#0088FE',
    'Cycle': '#00C49F',
    'Pilates': '#FFBB28',
    'Gym': '#8884d8'
  };

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
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Health Dashboard</h1>
          <p className="text-gray-500">February 22 - 28, 2025</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button className="p-1 rounded-md hover:bg-gray-200">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="px-2">
              <select 
                className="bg-transparent border-none focus:outline-none text-sm"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
            <button className="p-1 rounded-md hover:bg-gray-200">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-gray-500 text-sm">Heart Rate</p>
              <h3 className="text-2xl font-bold">{avgHeartRate} <span className="text-sm font-normal">bpm</span></h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-gray-500 text-sm">Blood Pressure</p>
              <h3 className="text-2xl font-bold">{avgBloodPressure.systolic}/{avgBloodPressure.diastolic}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Scale className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-gray-500 text-sm">Weight</p>
              <h3 className="text-2xl font-bold">{vitalsData[vitalsData.length - 1].weight} <span className="text-sm font-normal">kg</span></h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Activity className="h-6 w-6 text-orange-500" />
              </div>
              <p className="text-gray-500 text-sm">Activity</p>
              <h3 className="text-2xl font-bold">{totalActivityMinutes} <span className="text-sm font-normal">min</span></h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Utensils className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-gray-500 text-sm">Nutrition</p>
              <h3 className="text-2xl font-bold">{totalVeggies + totalFruits} <span className="text-sm font-normal">servings</span></h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Heart className="mr-2 h-4 w-4 text-red-500" />
              Vitals Tracking
            </CardTitle>
            <CardDescription>Heart rate, blood pressure, weight</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="heartRate">
              <TabsList className="mb-4">
                <TabsTrigger value="heartRate">Heart Rate</TabsTrigger>
                <TabsTrigger value="bloodPressure">Blood Pressure</TabsTrigger>
                <TabsTrigger value="weight">Weight</TabsTrigger>
              </TabsList>
            
              <TabsContent value="heartRate">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={vitalsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="bloodPressure">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={vitalsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} name="Systolic" />
                    <Line type="monotone" dataKey="diastolic" stroke="#93c5fd" strokeWidth={2} name="Diastolic" />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="weight">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={vitalsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#a855f7" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Activity className="mr-2 h-4 w-4 text-orange-500" />
              Activity Breakdown
            </CardTitle>
            <CardDescription>Minutes by activity type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={transformActivityData()} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(ACTIVITY_COLORS).map((activity) => (
                      <Bar key={activity} dataKey={activity} stackId="a" fill={ACTIVITY_COLORS[activity as ActivityType]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Utensils className="mr-2 h-4 w-4 text-green-500" />
              Nutrition Tracking
            </CardTitle>
            <CardDescription>Daily servings of vegetables and fruits</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={nutritionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" domain={[0, 'dataMax + 1']} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="vegetables" fill="#22c55e" name="Vegetables" />
                <Bar yAxisId="left" dataKey="fruits" fill="#eab308" name="Fruits" />
                <Bar yAxisId="left" dataKey="wholeGrains" fill="#8b5cf6" name="Whole Grains" />
                <Line yAxisId="right" type="monotone" dataKey="sugaryBeverages" stroke="#ef4444" name="Sugary Beverages" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2 text-green-700">Vegetables</h4>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-green-600">{totalVeggies}</span>
                    <span className="ml-2 text-sm text-green-700">servings this week</span>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2 text-yellow-700">Fruits</h4>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-yellow-600">{totalFruits}</span>
                    <span className="ml-2 text-sm text-yellow-700">servings this week</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2 text-purple-700">Whole Grains</h4>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-purple-600">{totalWholeGrains}</span>
                    <span className="ml-2 text-sm text-purple-700">servings this week</span>
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2 text-red-700">Sugary Beverages</h4>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-red-600">{totalSugaryBeverages}</span>
                    <span className="ml-2 text-sm text-red-700">servings this week</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Export the component as default
export default DashboardScreen;