const tintColorLight = "#128C7E" // WhatsApp primary green
const tintColorDark = "#25D366" // WhatsApp lighter green for dark mode

// Définir le type pour le thème
type Theme = {
  text: string
  background: string
  cardBackground: string
  tint: string
  tabIconDefault: string
  tabIconSelected: string
  primary: string
  secondary: string
  inactive: string
  border: string
  error: string
}

// Définir le type pour l'objet Colors
type ColorScheme = {
  light: Theme
  dark: Theme
}

const Colors: ColorScheme = {
  light: {
    text: "#222222",
    background: "#FFFFFF",
    cardBackground: "#FFFFFF",
    tint: tintColorLight,
    tabIconDefault: "#74787E",
    tabIconSelected: tintColorLight,
    primary: "#128C7E", // WhatsApp primary green
    secondary: "#34B7F1", // WhatsApp blue accent
    inactive: "#8696A0", // WhatsApp gray
    border: "#E2E2E2",
    error: "#FF3B30",
  },
  dark: {
    text: "#FFFFFF",
    background: "#111B21", // WhatsApp dark background
    cardBackground: "#1F2C34", // WhatsApp dark card background
    tint: tintColorDark,
    tabIconDefault: "#8696A0",
    tabIconSelected: tintColorDark,
    primary: "#25D366", // WhatsApp lighter green for dark mode
    secondary: "#34B7F1", // WhatsApp blue accent
    inactive: "#8696A0", // WhatsApp gray
    border: "#2A3942", // WhatsApp dark border
    error: "#FF453A",
  },
}

export default Colors
