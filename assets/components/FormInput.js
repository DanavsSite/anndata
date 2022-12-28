import { View, Text, TextInput } from "react-native";
import { useState } from "react";
const FormInput = ({ name, placeholder, type, icon, onChange, defValue }) => {
  let pass = false;
  if (type === "password") {
    pass = true;
  }
  const [data, setData] = useState(0);
  return (
    <>
      <Text
        style={{
          margin: 30,
          marginTop: 10,
          fontSize: 16,
          marginBottom: 4,
          marginLeft: 21,
        }}
      >
        {name}:
      </Text>
      <TextInput
        secureTextEntry={pass}
        placeholder={placeholder}
        onChangeText={(value) => {
          onChange(value);
        }}
        style={{
          width: "90%",
          height: 40,
          borderWidth: 2,
          borderRadius: 5,
          backgroundColor: "rgba(0,0,0,0.02)",
          margin: "auto",
          alignSelf: "center",
          paddingLeft: 10,
        }}
        value={defValue ? defValue : ""}
      ></TextInput>
    </>
  );
};

export default FormInput;
