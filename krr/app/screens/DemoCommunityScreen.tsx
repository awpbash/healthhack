import { FC, useState } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { ListItem, Screen, Text, TextField } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { $styles } from "../theme"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"
import { isRTL } from "@/i18n"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"

import theme, { Theme } from "@/theme/theme"
import { ThemeProvider, createText, useTheme } from "@shopify/restyle"

const chainReactLogo = require("../../assets/images/demo/cr-logo.png")
const reactNativeLiveLogo = require("../../assets/images/demo/rnl-logo.png")
const reactNativeRadioLogo = require("../../assets/images/demo/rnr-logo.png")
const reactNativeNewsletterLogo = require("../../assets/images/demo/rnn-logo.png")

export const DemoCommunityScreen: FC<DemoTabScreenProps<"DemoCommunity">> =
  function DemoCommunityScreen(_props) {
    const Shopify_text = createText<Theme>()
    const { themed } = useAppTheme()

    const options = ["Activity", "Vitals", "Diet"]
    // <Shopify_text variant="try">{option}</Shopify_text>
    const [heart_rate, set_heart_rate] = useState("-1")

    return (
      <ThemeProvider theme={theme}>
        <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={["top"]}>
          <TextField
            value={heart_rate}
            onChangeText={set_heart_rate}
            containerStyle={themed($textField)}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            labelTx="loginScreen:emailFieldLabel"
            placeholderTx="loginScreen:emailFieldPlaceholder"
            helper={"lol"}
            // status={"lol" ? "error" : undefined}
            // onSubmitEditing={() => authPasswordInput.current?.focus()}
          />
          <View style={themed($whiteContainer)}>
            {options.map((option, index) => (
              <View key={index}>
                <Shopify_text variant="try">{option}</Shopify_text>
                {index < options.length - 1 && <View style={themed($separator)} />}
              </View>
            ))}
          </View>

          <Text preset="heading" tx="demoCommunityScreen:title" style={themed($title)} />
          <Text tx="demoCommunityScreen:tagLine" style={themed($tagline)} />

          <Text preset="subheading" tx="demoCommunityScreen:joinUsOnSlackTitle" />
          <Text tx="demoCommunityScreen:joinUsOnSlack" style={themed($description)} />
          <ListItem
            tx="demoCommunityScreen:joinSlackLink"
            leftIcon="slack"
            rightIcon={isRTL ? "caretLeft" : "caretRight"}
            onPress={() => openLinkInBrowser("https://community.infinite.red/")}
          />
          <Text
            preset="subheading"
            tx="demoCommunityScreen:makeIgniteEvenBetterTitle"
            style={themed($sectionTitle)}
          />
          <Text tx="demoCommunityScreen:makeIgniteEvenBetter" style={themed($description)} />
          <ListItem
            tx="demoCommunityScreen:contributeToIgniteLink"
            leftIcon="github"
            rightIcon={isRTL ? "caretLeft" : "caretRight"}
            onPress={() => openLinkInBrowser("https://github.com/infinitered/ignite")}
          />

          <Text
            preset="subheading"
            tx="demoCommunityScreen:theLatestInReactNativeTitle"
            style={themed($sectionTitle)}
          />
          <Text tx="demoCommunityScreen:theLatestInReactNative" style={themed($description)} />
          <ListItem
            tx="demoCommunityScreen:reactNativeRadioLink"
            bottomSeparator
            rightIcon={isRTL ? "caretLeft" : "caretRight"}
            LeftComponent={
              <View style={[$styles.row, themed($logoContainer)]}>
                <Image source={reactNativeRadioLogo} style={$logo} />
              </View>
            }
            onPress={() => openLinkInBrowser("https://reactnativeradio.com/")}
          />
          <ListItem
            tx="demoCommunityScreen:reactNativeNewsletterLink"
            bottomSeparator
            rightIcon={isRTL ? "caretLeft" : "caretRight"}
            LeftComponent={
              <View style={[$styles.row, themed($logoContainer)]}>
                <Image source={reactNativeNewsletterLogo} style={$logo} />
              </View>
            }
            onPress={() => openLinkInBrowser("https://reactnativenewsletter.com/")}
          />
          <ListItem
            tx="demoCommunityScreen:reactNativeLiveLink"
            bottomSeparator
            rightIcon={isRTL ? "caretLeft" : "caretRight"}
            LeftComponent={
              <View style={[$styles.row, themed($logoContainer)]}>
                <Image source={reactNativeLiveLogo} style={$logo} />
              </View>
            }
            onPress={() => openLinkInBrowser("https://rn.live/")}
          />
          <ListItem
            tx="demoCommunityScreen:chainReactConferenceLink"
            rightIcon={isRTL ? "caretLeft" : "caretRight"}
            LeftComponent={
              <View style={[$styles.row, themed($logoContainer)]}>
                <Image source={chainReactLogo} style={$logo} />
              </View>
            }
            onPress={() => openLinkInBrowser("https://cr.infinite.red/")}
          />
          <Text
            preset="subheading"
            tx="demoCommunityScreen:hireUsTitle"
            style={themed($sectionTitle)}
          />
          <Text tx="demoCommunityScreen:hireUs" style={themed($description)} />
          <ListItem
            tx="demoCommunityScreen:hireUsLink"
            leftIcon="clap"
            rightIcon={isRTL ? "caretLeft" : "caretRight"}
            onPress={() => openLinkInBrowser("https://infinite.red/contact")}
          />
        </Screen>
      </ThemeProvider>
    )
  }

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $tagline: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxl,
})

const $description: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.xxl,
})

const $logoContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginEnd: spacing.md,
  flexWrap: "wrap",
  alignContent: "center",
  alignSelf: "stretch",
})

const $logo: ImageStyle = {
  height: 38,
  width: 38,
}

const $whiteContainer: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#F4F2F1",
  borderRadius: 20,
  width: "100%",
})

const $separator: ThemedStyle<ViewStyle> = () => ({
  height: 1,
  backgroundColor: "black",
  width: "100%",
})

const $textField: ThemedStyle<ViewStyle> = () => ({
  marginBottom: 10,
})
