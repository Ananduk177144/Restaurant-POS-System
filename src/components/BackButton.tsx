import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

import { Colors } from "../theme/colors";

type Props = {
  navigation: any;
};

export default function BackButton({ navigation }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.goBack()}
      style={styles.button}
    >
      <Text style={styles.arrow}>‹</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    left: 0,

    width: 38,
    height: 38,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: 19,
    backgroundColor: Colors.card,

    borderWidth: 1,
    borderColor: Colors.border,

    elevation: 2,
    zIndex: 10,
  },

  arrow: {
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "400",
    color: Colors.heading,

    marginTop: -3,
  },
});
