import { FC, useState } from "react"
import {
  ViewStyle,
  Image,
  View,
  Text,
  TextStyle,
  ImageStyle,
  TouchableOpacity,
  Linking,
} from "react-native"
import { Screen, TextField, Icon, Button } from "@/components"
import { $styles } from "@/theme"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import theme from "@/theme/theme"
import { ThemeProvider } from "@shopify/restyle"
import { DietLoggerProps } from "@/navigators/types"
import { Api } from "@/services/api/api"

export const DietLoggerScreen: FC<DietLoggerProps> = function DietLoggerScreen(_props) {
  const { themed } = useAppTheme()

  const [fruits_and_veges, set_fruits_and_veges] = useState("")
  const [wholegrains, set_whole_grains] = useState("")
  const [sugar, set_sugar] = useState("")
  const [protein, set_protein] = useState("")
  const [log, set_log] = useState("")
  const openHealthHubLink = () => {
    Linking.openURL(
      "https://www.healthhub.sg/programmes/nutrition-hub/eat-more?utm_source=google&utm_medium=paid-search&utm_campaign=fy24-nl-edsh-ao&utm_content=fy24-nl-edsh-ao_google_paid-search_my-healthy-plate&gad_source=1#my-healthy-plate",
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={[]}>
        <View style={themed($healthyPlateContainer)}>
          <Text style={themed($healthyPlateTitle)}>Healthy Plate Guide</Text>
          <Image
            source={require("../components/healthyplate.png")}
            style={$healthyPlateImage}
            resizeMode="contain"
          />
          <Text style={themed($healthyPlateDescription)}>
            Fill half your plate with fruits and vegetables, one quarter with whole grains, and one
            quarter with proteins for a balanced meal.
          </Text>
          <TouchableOpacity onPress={openHealthHubLink} style={themed($learnMoreButton)}>
            <Text style={themed($learnMoreText)}>Learn more at HealthHub SG</Text>
            <Icon icon="caretRight" size={16} />
          </TouchableOpacity>
        </View>
        <TextField
          value={fruits_and_veges}
          onChangeText={set_fruits_and_veges}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          keyboardType="numeric"
          labelTx="dietLoggerScreen:fruitsAndVegesLabel"
          placeholderTx="dietLoggerScreen:fruitsAndVegesPlaceholder"
        />
        <TextField
          value={wholegrains}
          onChangeText={set_whole_grains}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          keyboardType="numeric"
          labelTx="dietLoggerScreen:wholegrainLabel"
          placeholderTx="dietLoggerScreen:wholegrainPlaceholder"
        />
        <TextField
          value={protein}
          onChangeText={set_protein}
          containerStyle={themed($textField)}
          autoComplete="off"
          autoCorrect={false}
          keyboardType="numeric"
          labelTx="dietLoggerScreen:proteinLabel"
          placeholderTx="dietLoggerScreen:proteinPlaceholder"
        />
        <TextField
          value={sugar}
          onChangeText={set_sugar}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          keyboardType="numeric"
          labelTx="dietLoggerScreen:sugarLabel"
          placeholderTx="dietLoggerScreen:sugarPlaceholder"
        />
        <TextField
          value={log}
          onChangeText={set_log}
          labelTx="dietLoggerScreen:logLabel"
          labelTxOptions={{ prop: "label" }}
          helperTxOptions={{ prop: "helper" }}
          placeholderTx="dietLoggerScreen:logPlaceholder"
          multiline
          containerStyle={themed($textField)}
          autoCapitalize="sentences"
          keyboardType="default"
        />
        <Button preset="filled">{"Add"}</Button>
      </Screen>
    </ThemeProvider>
  )
}

const $textField: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 10,
  // backgroundColor: "#e9e7e3",
  // borderRadius: 10,
  padding: 12,
  // borderWidth: 1,
  // borderColor: "#ddd",
  // shadowColor: "#000",
  // shadowOffset: { width: 0, height: 2 },
  // shadowOpacity: 0.1,
  // shadowRadius: 4,
  // elevation: 3,
})

const $healthyPlateContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.lg,
  alignItems: "center",
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.sm,
  backgroundColor: "#f5f5f5",
  borderRadius: 8,
})

const $healthyPlateImage: ImageStyle = {
  width: "100%" as const,
  height: 250,
  marginVertical: 10,
}

const $healthyPlateTitle: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.medium,
  color: colors.text,
  marginBottom: 8,
})

const $healthyPlateDescription: ThemedStyle<TextStyle> = ({ colors, typography, spacing }) => ({
  fontSize: 14,
  fontFamily: typography.primary.normal,
  color: colors.textDim,
  textAlign: "center",
  marginTop: spacing.xs,
  lineHeight: 20,
})

const $learnMoreButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  marginTop: spacing.md,
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.sm,
  borderRadius: 4,
  backgroundColor: colors.palette.neutral200,
})

const $learnMoreText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.primary.medium,
  color: colors.tint,
  marginRight: 6,
})

// Export the old name for backward compatibility
export const DietLogger = DietLoggerScreen
