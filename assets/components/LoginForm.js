import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import Checkbox from "expo-checkbox";
import FormInput from "./FormInput";
const RegisterForm = ({ onSubmit, getPass, getName }) => {
  const width = Dimensions.get("window").width;
  const [isChecked, setChecked] = useState(false);
  const bool = isChecked ? "" : "password";
  const [Name, setName] = useState("");
  const [pass, setpass] = useState("");

  return (
    <View style={{ width: width }}>
      <FormInput
        name={"Username"}
        placeholder={"Your Name"}
        onChange={(e) => {
          setName(e);
          getName(e);
        }}
      />
      <FormInput
        name={"Password"}
        placeholder={"example@email.com"}
        type={bool}
        onChange={(e) => {
          setpass(e);
          getPass(e);
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 15,
        }}
      >
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? "#4630EB" : undefined}
        />
        <Text style={{ fontSize: 16 }}>Show Password</Text>
      </View>
      <TouchableOpacity
        onPress={onSubmit}
        style={{
          backgroundColor: "#111",
          width: 290,
          borderRadius: 10,
          height: 45,
          alignSelf: "center",
          alignContent: "center",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: "#eee",
            alignSelf: "center",
            fontSize: 25,
            fontWeight: "bold",
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
  },
  text: {
    fontSize: 22,
  },
  btnLogin: {
    height: 45,
    backgroundColor: "rgba(10,10,10,0.8)",
    color: "white",
    borderRadius: 10,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  btnRegister: {
    height: 45,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    margin: 8,
    width: 16,
    height: 16,
  },
});

export default RegisterForm;
