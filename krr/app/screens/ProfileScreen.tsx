import { FC, useState } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, TouchableOpacity, Modal, ScrollView } from "react-native"
import { ListItem, Screen, Text, TextField } from "../components"
import { DemoTabScreenProps } from "../navigators/TabNavigator"
import { $styles } from "../theme"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"
import { isRTL } from "@/i18n"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"

import theme, { Theme } from "@/theme/theme"
import { ThemeProvider, createText, useTheme } from "@shopify/restyle"

export const ProfileScreen: FC<DemoTabScreenProps<"Profile">> =
function ProfileScreen(_props) {
  const Shopify_text = createText<Theme>()
  const { themed } = useAppTheme()

  // Profile state
  const [name, setName] = useState("")
  const [yearOfBirth, setYearOfBirth] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [gender, setGender] = useState("")
  const [race, setRace] = useState("Race")
  const [smoke, setSmoke] = useState(false)
  const [familyConditions, setFamilyConditions] = useState({
    cancer: false,
    diabetes: false,
    earlyHeartAttack: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isEditing, setIsEditing] = useState(true)
  const [showRacePicker, setShowRacePicker] = useState(false)

  // Available races
  const races = ["Chinese", "Malay", "Indian", "Others"]

  // Handle gender selection
  const handleGenderSelect = (selectedGender: string) => {
    if (!isEditing) return
    setGender(selectedGender)
  }

  // Handle smoking status
  const handleSmokeSelect = (status: boolean) => {
    if (!isEditing) return
    setSmoke(status)
  }

  // Handle family condition changes
  const handleFamilyConditionChange = (condition: string, value: boolean) => {
    if (!isEditing) return
    setFamilyConditions(prev => ({
      ...prev,
      [condition]: value
    }))
  }

  // Handle race selection
  const handleRaceSelect = (selectedRace: string) => {
    if (!isEditing) return
    setRace(selectedRace)
    setShowRacePicker(false)
  }

  // Handle submit
  const handleSubmit = () => {
    // Basic validation
    if (!name.trim()) {
      alert("Please enter your name")
      return
    }
    
    if (!yearOfBirth.trim()) {
      alert("Please enter your year of birth")
      return
    }
    
    // Submit the form
    setIsSubmitted(true)
    setIsEditing(false)
    
    // Here you would typically save the data to your backend
    console.log("Profile submitted:", {
      name,
      yearOfBirth,
      gender,
      height,
      weight,
      race,
      smoke,
      familyConditions
    })
  }

  // Handle edit button press
  const handleEditPress = () => {
    setIsEditing(true)
  }

  // Toggle race dropdown
  const toggleRaceDropdown = () => {
    if (!isEditing) return
    setShowRacePicker(!showRacePicker)
  }

  return (
    <ThemeProvider theme={theme}>
      <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={["top"]}>
        {/* Header */}
        <View style={$styles.row}>
          <Text preset="heading" text="Profile" style={{ flex: 1 }} />
        </View>

        {/* Health Profile */}
        {/* <View style={themed($profileHeader)}>
          <Text preset="heading" text="Main Health Profile" style={themed($headerText)} />
        </View> */}

        {/* Name */}
        <Text preset="subheading" text="Name" style={themed($labelText)} />
        <TextField
          value={name}
          onChangeText={isEditing ? setName : undefined}
          containerStyle={themed($textField)}
          placeholder="Full name"
          editable={isEditing}
        />

        {/* Year of Birth */}
        <Text preset="subheading" text="Year of Birth" style={themed($labelText)} />
        <TextField
          value={yearOfBirth}
          onChangeText={isEditing ? setYearOfBirth : undefined}
          containerStyle={themed($textField)}
          placeholder="Year"
          keyboardType="number-pad"
          editable={isEditing}
        />

        {/* Gender */}
        <Text preset="subheading" text="Gender" style={themed($labelText)} />
        <View style={themed($rowButtons)}>
          <TouchableOpacity 
            style={themed(gender === "Male" ? $selectedButton : $button)}
            onPress={() => handleGenderSelect("Male")}
          >
            <Text 
              text="Male" 
              style={gender === "Male" ? themed($selectedText) : themed($buttonText)}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={themed(gender === "Female" ? $selectedButton : $button)}
            onPress={() => handleGenderSelect("Female")}
          >
            <Text 
              text="Female" 
              style={gender === "Female" ? themed($selectedText) : themed($buttonText)}
            />
          </TouchableOpacity>
        </View>

        {/* Height and Weight */}
        <View style={themed($rowFields)}>
          <View style={themed($halfField)}>
            <Text preset="subheading" text="Height" style={themed($labelText)} />
            <View style={themed($unitField)}>
              <TextField
                value={height}
                onChangeText={isEditing ? setHeight : undefined}
                containerStyle={{ flex: 1 }}
                keyboardType="numeric"
                editable={isEditing}
              />
              <Text text="cm" style={themed($unitText)} />
            </View>
          </View>
          <View style={themed($halfField)}>
            <Text preset="subheading" text="Weight" style={themed($labelText)} />
            <View style={themed($unitField)}>
              <TextField
                value={weight}
                onChangeText={isEditing ? setWeight : undefined}
                containerStyle={{ flex: 1 }}
                keyboardType="numeric"
                editable={isEditing}
              />
              <Text text="kg" style={themed($unitText)} />
            </View>
          </View>
        </View>

        {/* Race */}
        <Text preset="subheading" text="Race" style={themed($labelText)} />
        
        {/* Race Dropdown Button */}
        <TouchableOpacity 
          style={themed($dropdownButton)} 
          onPress={toggleRaceDropdown}
          disabled={!isEditing}
        >
          <Text text={race} style={themed($dropdownButtonText)} />
          <Text style={themed($dropdownArrow)}>▼</Text>
        </TouchableOpacity>
        
        {/* Race Dropdown Modal */}
        <Modal
          visible={showRacePicker}
          transparent
          animationType="none"
          onRequestClose={() => setShowRacePicker(false)}
        >
          <TouchableOpacity 
            style={themed($modalOverlay)} 
            activeOpacity={1} 
            onPress={() => setShowRacePicker(false)}
          >
            <View style={themed($dropdownContainer)}>
              <ScrollView>
                {races.map((item) => (
                  <TouchableOpacity 
                    key={item} 
                    style={[
                      themed($dropdownItem),
                      races.indexOf(item) < races.length - 1 && themed($borderBottom)
                    ]}
                    onPress={() => handleRaceSelect(item)}
                  >
                    <Text 
                      text={item} 
                      style={race === item ? themed($selectedDropdownText) : themed($dropdownText)} 
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Smoke */}
        <Text preset="subheading" text="Do you Smoke?" style={themed($labelText)} />
        <View style={themed($rowButtons)}>
          <TouchableOpacity 
            style={themed(smoke ? $selectedButton : $button)}
            onPress={() => handleSmokeSelect(true)}
          >
            <Text 
              text="Yes" 
              style={smoke ? themed($selectedText) : themed($buttonText)}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={themed(!smoke ? $selectedButton : $button)}
            onPress={() => handleSmokeSelect(false)}
          >
            <Text 
              text="No" 
              style={!smoke ? themed($selectedText) : themed($buttonText)}
            />
          </TouchableOpacity>
        </View>

        {/* Family Conditions */}
        <Text 
          preset="subheading" 
          text="Does anyone in your family have/had the following condition?" 
          style={themed($conditionHeading)} 
        />

        {/* Cancer */}
        <View style={themed($conditionRow)}>
          <Text text="Cancer" style={themed($conditionText)} />
          <View style={themed($conditionButtons)}>
            <TouchableOpacity 
              style={themed(familyConditions.cancer ? $selectedButton : $button)}
              onPress={() => handleFamilyConditionChange("cancer", true)}
            >
              <Text 
                text="Yes" 
                style={familyConditions.cancer ? themed($selectedText) : themed($buttonText)}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={themed(!familyConditions.cancer ? $selectedButton : $button)}
              onPress={() => handleFamilyConditionChange("cancer", false)}
            >
              <Text 
                text="No" 
                style={!familyConditions.cancer ? themed($selectedText) : themed($buttonText)}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Diabetes */}
        <View style={themed($conditionRow)}>
          <Text text="Diabetes" style={themed($conditionText)} />
          <View style={themed($conditionButtons)}>
            <TouchableOpacity 
              style={themed(familyConditions.diabetes ? $selectedButton : $button)}
              onPress={() => handleFamilyConditionChange("diabetes", true)}
            >
              <Text 
                text="Yes" 
                style={familyConditions.diabetes ? themed($selectedText) : themed($buttonText)}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={themed(!familyConditions.diabetes ? $selectedButton : $button)}
              onPress={() => handleFamilyConditionChange("diabetes", false)}
            >
              <Text 
                text="No" 
                style={!familyConditions.diabetes ? themed($selectedText) : themed($buttonText)}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Early Heart Attack */}
        <View style={themed($conditionRow)}>
          <View>
            <Text text="Early*" style={themed($conditionText)} />
            <Text text="Heart Attack" style={themed($conditionText)} />
          </View>
          <View style={themed($conditionButtons)}>
            <TouchableOpacity 
              style={themed(familyConditions.earlyHeartAttack ? $selectedButton : $button)}
              onPress={() => handleFamilyConditionChange("earlyHeartAttack", true)}
            >
              <Text 
                text="Yes" 
                style={familyConditions.earlyHeartAttack ? themed($selectedText) : themed($buttonText)}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={themed(!familyConditions.earlyHeartAttack ? $selectedButton : $button)}
              onPress={() => handleFamilyConditionChange("earlyHeartAttack", false)}
            >
              <Text 
                text="No" 
                style={!familyConditions.earlyHeartAttack ? themed($selectedText) : themed($buttonText)}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text text="*If occurred to Male 55 years and below;" style={themed($noteText)} />
        <Text text="Female 65 years and below" style={themed($noteText)} />

        {/* Submit or Edit Button */}
        {!isSubmitted ? (
          <TouchableOpacity style={themed($submitContainer)} onPress={handleSubmit}>
            <Text text="SUBMIT" style={themed($submitText)} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={themed(isEditing ? $editActiveContainer : $editContainer)} 
            onPress={isEditing ? handleSubmit : handleEditPress}
          >
            <Text text={isEditing ? "SAVE" : "EDIT"} style={themed($editText)} />
          </TouchableOpacity>
        )}
      </Screen>
    </ThemeProvider>
  )
}

// Styles
const $profileHeader: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: '#333333',  // Dark gray/almost black
  padding: 16,
  marginVertical: 16,
  width: '100%',
})

const $headerText: ThemedStyle<TextStyle> = () => ({
  color: 'white',
})

const $labelText: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
  marginBottom: spacing.xs,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $checkboxRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: 'center',
  marginBottom: spacing.md,
})

const $checkbox: ThemedStyle<ViewStyle> = () => ({
  width: 24,
  height: 24,
  borderWidth: 1,
  borderColor: 'black',
  marginRight: 8,
})

const $checkboxChecked: ThemedStyle<ViewStyle> = () => ({
  width: 24,
  height: 24,
  borderWidth: 1,
  borderColor: 'black',
  backgroundColor: 'black',
  marginRight: 8,
})

const $italicText: ThemedStyle<TextStyle> = () => ({
  fontStyle: 'italic',
})

const $rowButtons: ThemedStyle<ViewStyle> = () => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 16,
})

const $button: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 20,
  padding: 12,
  alignItems: 'center',
  marginHorizontal: 4,
})

const $selectedButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.tint, // Dark gray/almost black
  borderRadius: 20,
  padding: 12,
  alignItems: 'center',
  marginHorizontal: 4,
})

const $selectedText: ThemedStyle<TextStyle> = () => ({
  color: 'white',
})

const $buttonText: ThemedStyle<TextStyle> = () => ({
  color: 'gray',
})

const $rowFields: ThemedStyle<ViewStyle> = () => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const $halfField: ThemedStyle<ViewStyle> = () => ({
  width: '48%',
})

const $unitField: ThemedStyle<ViewStyle> = () => ({
  flexDirection: 'row',
  alignItems: 'center',
})

const $unitText: ThemedStyle<TextStyle> = () => ({
  marginLeft: 8,
})

const $listItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

// New dropdown styles
const $dropdownButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  backgroundColor: colors.background,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 4,
  marginBottom: spacing.md,
})

const $dropdownButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.text,
})

const $dropdownArrow: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  color: colors.textDim,
})

const $modalOverlay: ThemedStyle<ViewStyle> = () => ({
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
})

const $dropdownContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: 'absolute',
  width: '92%',
  backgroundColor: colors.background,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 4,
  maxHeight: 250,
  top: 50,
  marginHorizontal: '4%',
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 5,
})

const $dropdownItem: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  backgroundColor: colors.background,
})

const $borderBottom: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
})

const $dropdownText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.text,
})

const $selectedDropdownText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  fontWeight: 'bold',
  color: colors.tint,
})

// Old picker styles (can be removed)
const $pickerContainer: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: 'white',
  borderWidth: 1,
  borderColor: 'lightgray',
  borderRadius: 8,
  marginBottom: 16,
  padding: 8,
})

const $pickerItem: ThemedStyle<ViewStyle> = () => ({
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: 'lightgray',
})

const $pickerText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
})

const $selectedPickerText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: '#000000',  // Black
  fontWeight: 'bold',
})

const $conditionHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.lg,
  marginBottom: spacing.sm,
})

const $conditionRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginVertical: 8,
})

const $conditionText: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
})

const $conditionButtons: ThemedStyle<ViewStyle> = () => ({
  flexDirection: 'row',
  width: '48%',
})

const $noteText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontStyle: 'italic',
  color: 'gray',
  marginBottom: 4,
})

const $divider: ThemedStyle<ViewStyle> = () => ({
  height: 1,
  backgroundColor: 'lightgray',
  marginVertical: 20,
})

const $bpIcon: ThemedStyle<ViewStyle> = () => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#EEEEEE',  // Light gray
  marginRight: 8,
})

const $bpText: ThemedStyle<TextStyle> = () => ({
  alignSelf: 'center',
})

const $arrowText: ThemedStyle<TextStyle> = () => ({
  fontSize: 18,
})

const $submitContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral300,
  padding: 16,
  alignItems: 'center',
  borderRadius: 8,
  marginTop: 20,
})

const $submitText: ThemedStyle<TextStyle> = () => ({
  color: '#FFFFFF',  // White
  fontWeight: 'bold',
})

const $editContainer: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: '#EEEEEE',  // Light gray
  padding: 16,
  alignItems: 'center',
  borderRadius: 8,
  marginTop: 20,
})

const $editActiveContainer: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: '#2196F3',  // Blue
  padding: 16,
  alignItems: 'center',
  borderRadius: 8,
  marginTop: 20,
})

const $editText: ThemedStyle<TextStyle> = () => ({
  color: '#000000',  // Black
  fontWeight: 'bold',
})

// Export the component in exactly the same way as your other screens