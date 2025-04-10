import { createTheme } from "@shopify/restyle"

const palette = {
    primary: "#49c5b1",
    secondary: "#34C759",
    background: "#F4F2F1",
    text: "#333333",
    white: "#FFFFFF",

    status_good: "#2ECC71",
    status_avg: "#F1C40F",
    status_error: "#E74C3C",
}

const theme = createTheme({
    colors: {
        primary: palette.primary,
        secondary: palette.secondary,
        background: palette.background,
        text: palette.text,
        white: palette.white,

        status_good: palette.status_good,
        status_avg: palette.status_avg,
        status_error: palette.status_error,
    },
    spacing: {
        xxxs: 2,
        xxs: 4,
        xs: 8,
        sm: 12,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
        xxxl: 64,

        padding_small: 10,
        padding_normal: 20,
    },
    textVariants: {
        heading: {
            fontSize: 24,
            fontWeight: "bold",
            color: "text",
        },
        body: {
            fontSize: 16,
            color: "text",
        },
        try: {
            fontSize: "l",
            fontWeight: 800,
            color: "text",
            paddingBottom: "padding_small",
            paddingTop: "padding_small",
            textAlign: "center",
        },
    },
})

export type Theme = typeof theme
export default theme
