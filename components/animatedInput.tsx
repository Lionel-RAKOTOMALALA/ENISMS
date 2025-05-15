"use client"

import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View, Animated, Text, type TextInputProps, type ViewStyle } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import correct
import { z } from "zod";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

// Fonction pour déterminer l'opérateur
export function getOperator(phone: string): string {
  const cleanedPhone = phone.replace(/\s+/g, ""); // Supprimer les espaces
  if (/^(\+261|0)(34|38)/.test(cleanedPhone)) {
    return "YAS";
  } else if (/^(\+261|0)33/.test(cleanedPhone)) {
    return "Airtel";
  } else if (/^(\+261|0)(32|37)/.test(cleanedPhone)) {
    return "Orange";
  } else {
    return "Inconnu"; // Si le numéro ne correspond à aucun opérateur
  }
}

// Schéma Zod pour valider les numéros de téléphone
const phoneSchema = z
  .string()
  .refine((value) => getOperator(value) !== "Inconnu", { message: "Numéro invalide ! Opérateur inconnu." })
  .refine((value) => value.length <= 10, { message: "Le numéro ne doit pas dépasser 10 caractères." });

interface AnimatedInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
  isDropdown?: boolean; // Ajouté pour différencier les champs classiques et les listes déroulantes
  options?: string[]; // Liste des options pour la liste déroulante
  isPhoneNumberField?: boolean; // Indique si le champ est un champ de numéro de téléphone
}

export const AnimatedInput = ({
  label,
  error,
  containerStyle,
  style,
  icon,
  isDropdown = false,
  options = [],
  isPhoneNumberField = false,
  ...props
}: AnimatedInputProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [isFocused, setIsFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string>(options[0] || ""); // Valeur par défaut pour les listes déroulantes

  const labelPosition = useRef(new Animated.Value(props.value || selectedValue ? 1 : 0)).current;
  const borderAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(labelPosition, {
      toValue: isFocused || props.value || selectedValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(borderAnimation, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, props.value, selectedValue]);

  const validateInput = (value: string) => {
    try {
      if (isPhoneNumberField) {
        phoneSchema.parse(value); // Valide uniquement les numéros de téléphone
      }
      setErrorMessage(null); // Aucun problème
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrorMessage(e.errors[0].message); // Récupère le premier message d'erreur
      }
    }
  };

  const labelStyle = {
    position: "absolute",
    left: icon ? 40 : 12,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [17, -10],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.inactive, colors.primary],
    }),
    backgroundColor: isFocused || props.value || selectedValue ? colors.background : "transparent",
    paddingHorizontal: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 8],
    }),
    zIndex: 1,
  } as any;

  const borderColor = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Animated Label */}
      <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>

      {/* Input Container */}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor: colors.background,
          },
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        {/* Si isDropdown est vrai, afficher un Picker (liste déroulante) */}
        {isDropdown ? (
          <Picker
            selectedValue={selectedValue}
            style={[styles.input, { color: colors.text }, style]}
            onValueChange={(itemValue: string) => {
              setSelectedValue(itemValue);
              setErrorMessage(null); // Pas de validation pour les listes déroulantes
            }}
          >
            {options.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        ) : (
          <TextInput
            style={[styles.input, { color: colors.text }, style]}
            placeholder={isFocused ? props.placeholder : ""}
            placeholderTextColor={colors.inactive}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              if (props.value) {
                validateInput(props.value.toString()); // Valide uniquement les numéros de téléphone
              }
            }}
            {...props}
          />
        )}
      </Animated.View>

      {/* Error Message */}
      {(errorMessage || error) && (
        <Text style={[styles.errorText, { color: colors.error || "#ff3b30" }]}>
          {errorMessage || error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    height: 56,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    height: "100%",
  },
  iconContainer: {
    paddingLeft: 12,
    paddingRight: 8,
  },
  label: {
    fontWeight: "500",
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    marginLeft: 12,
  },
});