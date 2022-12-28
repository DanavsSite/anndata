import { View, Text, StyleSheet } from "react-native";
import React from "react";

const FormHeading = () => {
  return (
    <View style={{ height: 70 }}>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={styles.text}>Welcome</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    margin: 0,
  },
  text: { fontSize: 40, fontWeight: "bold" },
});

export default FormHeading;
