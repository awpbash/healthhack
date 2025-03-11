/* eslint-disable react-native/no-color-literals */
import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import Svg, { Circle, Path, G, Line } from "react-native-svg"

const HealthyPlateComponent = ({ nutritionData, onSectionSelect }) => {
  const [selectedSection, setSelectedSection] = useState(null)

  // Default nutrition data if none is provided
  const data = nutritionData || {
    vegetables: 3,
    fruits: 3,
    wholegrains: 2,
    proteins: 1,
  }

  // Calculate fill percentages based on recommended values
  const getFillPercentage = (type) => {
    const recommended = {
      vegetables: 3,
      fruits: 2,
      wholegrains: 3,
      proteins: 2,
    }

    const actual = data[type] || 0
    return Math.min(100, (actual / recommended[type]) * 100)
  }

  // Handle section taps
  const handleSectionPress = (section) => {
    const newSelection = section === selectedSection ? null : section
    setSelectedSection(newSelection)
    if (onSectionSelect) {
      onSectionSelect(newSelection)
    }
  }

  // Colors for each section
  const sectionColors = {
    vegetables: "#90BE6D", // Green
    fruits: "#F9C74F", // Yellow
    wholegrains: "#F8961E", // Orange
    proteins: "#D1495B", // Red
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Healthy Plate</Text>

      <View style={styles.plateContainer}>
        <Svg width={300} height={300} viewBox="0 0 300 300">
          {/* Plate circle */}
          <Circle cx={150} cy={150} r={145} fill="white" stroke="#ddd" strokeWidth={2} />

          {/* Vegetables - 1/2 of plate (bottom half) */}
          <Path
            d={`M 30 150 A 145 145 0 0 0 270 150 L 150 150 Z`}
            fill={
              selectedSection === "vegetables"
                ? sectionColors.vegetables
                : `url(#vegGradient${getFillPercentage("vegetables")})`
            }
            stroke="white"
            strokeWidth={1}
            opacity={selectedSection && selectedSection !== "vegetables" ? 0.5 : 1}
            onPress={() => handleSectionPress("vegetables")}
          />

          {/* Proteins - 1/4 of plate (top left) */}
          <Path
            d={`M 30 150 A 145 145 0 0 1 150 5 L 150 150 Z`}
            fill={
              selectedSection === "proteins"
                ? sectionColors.proteins
                : `url(#proteinGradient${getFillPercentage("proteins")})`
            }
            stroke="white"
            strokeWidth={1}
            opacity={selectedSection && selectedSection !== "proteins" ? 0.5 : 1}
            onPress={() => handleSectionPress("proteins")}
          />

          {/* Whole Grains - 1/4 of plate (top right) */}
          <Path
            d={`M 150 5 A 145 145 0 0 1 270 150 L 150 150 Z`}
            fill={
              selectedSection === "wholegrains"
                ? sectionColors.wholegrains
                : `url(#grainGradient${getFillPercentage("wholegrains")})`
            }
            stroke="white"
            strokeWidth={1}
            opacity={selectedSection && selectedSection !== "wholegrains" ? 0.5 : 1}
            onPress={() => handleSectionPress("wholegrains")}
          />

          {/* Fruits - Small circle on the side */}
          <Circle
            cx={275}
            cy={150}
            r={40}
            fill={
              selectedSection === "fruits"
                ? sectionColors.fruits
                : `url(#fruitGradient${getFillPercentage("fruits")})`
            }
            stroke="white"
            strokeWidth={1}
            opacity={selectedSection && selectedSection !== "fruits" ? 0.5 : 1}
            onPress={() => handleSectionPress("fruits")}
          />

          {/* Section labels */}
          <G opacity={0.9}>
            <Text x={150} y={85} fill="#333" fontSize={12} fontWeight="bold" textAnchor="middle">
              Whole Grains
            </Text>
            <Text x={75} y={85} fill="#333" fontSize={12} fontWeight="bold" textAnchor="middle">
              Proteins
            </Text>
            <Text x={150} y={200} fill="#333" fontSize={14} fontWeight="bold" textAnchor="middle">
              Vegetables
            </Text>
            <Text x={275} y={150} fill="#333" fontSize={12} fontWeight="bold" textAnchor="middle">
              Fruits
            </Text>
          </G>

          {/* Divider lines */}
          <Line x1={150} y1={5} x2={150} y2={150} stroke="#ddd" strokeWidth={1} />
          <Line x1={30} y1={150} x2={270} y2={150} stroke="#ddd" strokeWidth={1} />

          {/* Center dot */}
          <Circle cx={150} cy={150} r={3} fill="#333" />

          {/* Gradients for fill levels */}
          <defs>
            {/* Vegetables gradient */}
            <linearGradient
              id={`vegGradient${getFillPercentage("vegetables")}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset={`${100 - getFillPercentage("vegetables")}%`} stopColor="#e9e9e9" />
              <stop
                offset={`${100 - getFillPercentage("vegetables")}%`}
                stopColor={sectionColors.vegetables}
              />
            </linearGradient>

            {/* Proteins gradient */}
            <linearGradient
              id={`proteinGradient${getFillPercentage("proteins")}`}
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
            >
              <stop offset={`${100 - getFillPercentage("proteins")}%`} stopColor="#e9e9e9" />
              <stop
                offset={`${100 - getFillPercentage("proteins")}%`}
                stopColor={sectionColors.proteins}
              />
            </linearGradient>

            {/* Whole grains gradient */}
            <linearGradient
              id={`grainGradient${getFillPercentage("wholegrains")}`}
              x1="100%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset={`${100 - getFillPercentage("wholegrains")}%`} stopColor="#e9e9e9" />
              <stop
                offset={`${100 - getFillPercentage("wholegrains")}%`}
                stopColor={sectionColors.wholegrains}
              />
            </linearGradient>

            {/* Fruits gradient (radial) */}
            <radialGradient
              id={`fruitGradient${getFillPercentage("fruits")}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset={`${getFillPercentage("fruits")}%`} stopColor={sectionColors.fruits} />
              <stop offset={`${getFillPercentage("fruits")}%`} stopColor="#e9e9e9" />
            </radialGradient>
          </defs>
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {Object.entries({
          vegetables: "Vegetables (½ plate)",
          proteins: "Proteins (¼ plate)",
          wholegrains: "Whole Grains (¼ plate)",
          fruits: "Fruits (1-2 servings)",
        }).map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.legendItem,
              { opacity: selectedSection && selectedSection !== key ? 0.5 : 1 },
            ]}
            onPress={() => handleSectionPress(key)}
          >
            <View style={[styles.legendColor, { backgroundColor: sectionColors[key] }]} />
            <Text style={styles.legendText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginVertical: 10,
    padding: 16,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#333",
  },
  plateContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    color: "#333",
  },
})

// Example of how to use this component in the DashboardScreen
/*
// In your DashboardScreen.tsx file:
import HealthyPlateComponent from './HealthyPlateComponent';

// Inside your DashboardScreen component:
const [filteredNutritionType, setFilteredNutritionType] = useState(null);

// Your nutrition data from API or state
const nutritionData = {
  vegetables: 3,
  fruits: 3,
  wholegrains: 2,
  proteins: 1
};

// Handle section selection
const handleSectionSelect = (section) => {
  setFilteredNutritionType(section);
  // You could update your UI to highlight the selected category
};

// Render the component
<HealthyPlateComponent 
  nutritionData={nutritionData}
  onSectionSelect={handleSectionSelect}
/>

// Then in your nutrition section display, check filteredNutritionType to highlight sections
<View style={{ 
  opacity: !filteredNutritionType || filteredNutritionType === 'vegetables' ? 1 : 0.5 
}}>
  {/* Your vegetables nutrition display */ /*}
</View>
*/

export default HealthyPlateComponent
