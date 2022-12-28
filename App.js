import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
  Button,
  FlatList,
  Platform,
} from "react-native";
import NumericInput from "react-native-numeric-input";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import Checkbox from "expo-checkbox";
import FormHeading from "./assets/components/FormHeading";
import FormInput from "./assets/components/FormInput";
import Ionicons from "@expo/vector-icons/Ionicons";
import LoginForm from "./assets/components/LoginForm";
import RegisterForm from "./assets/components/RegisterForm";
import { NavigationContainer, StackRouter, St } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import Lottie from "lottie-react-native";
import jwt_decode from "jwt-decode";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import SvgUri from "react-native-svg-uri";
import { List } from "react-native-paper";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";

const Tab = createMaterialBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Requests"
        component={OrdersScreen}
        options={{
          tabBarLabel: "Requests",
          tabBarColor: "#000",
          tabBarIcon: ({ color }) => (
            <SvgUri
              width="35"
              height="25"
              source={require("./assets/wheat.svg")}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
function OrdersScreen() {
  return (
    <>
      <View style={styles.requests}>
        <FlatList
          data={
            ({
              id: 1,
              name: "John",
            },
            {
              id: 2,
              name: "Jon",
            })
          }
        />
      </View>
    </>
  );
}
async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}
async function IsToken() {
  let result = await SecureStore.getItemAsync("TOKEN");
  if (result) {
    return true;
  } else {
    return false;
  }
}
async function getName() {
  let result = await SecureStore.getItemAsync("TOKEN");
  if (result) {
    return jwt_decode(result).name;
  } else {
    return false;
  }
}
function Home({ navigation }) {
  const [name, setname] = useState("");
  useEffect(() => {
    const ver = async () => {
      var token = await IsToken();
      if (token === false) {
        navigation.replace("Details");
      }
      console.log(token);
      console.log(await getName());
      setname(await getName());
    };
    ver();
  });
  return (
    <>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ fontSize: 35, marginTop: 20, fontWeight: "bold" }}>
          Welcome, {name}
        </Text>
        <TouchableOpacity
          style={{
            borderColor: "rgba(0,0,0,0.2)",
            borderStyle: "solid",
            borderWidth: 5,
            width: "75%",
            height: 200,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
          onPress={() => {
            console.log("moving....");
            navigation.navigate("Sell");
          }}
        >
          <Text style={{ fontSize: 75 }}>Sell</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderColor: "rgba(0,0,0,0.2)",
            borderStyle: "solid",
            borderWidth: 5,
            width: "75%",
            height: 200,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 30,
          }}
        >
          <Text style={{ fontSize: 75 }}>Buy</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

async function fetchData() {
  await axios
    .get(
      "http://www.mapquestapi.com/geocoding/v1/reverse?key=k45WUUjSa68QsQTJdbMJ4DERz2beYjQm&location=30.333472,-81.470448&includeRoadMetadata=true&includeNearestIntersection=true"
    )
    .then((response) => {
      var street = JSON.stringify(response.data.results[0].locations[0].street);
      var coun = JSON.stringify(
        response.data.results[0].locations[0].postalCode
      );
      const address = `${street},${coun}`;
      return address;
    });
}

function SellScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let gotadd = await fetchData();
      console.log(gotadd);
      setAddress(gotadd);
      console.log(address);
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      const getAddress = async () => {
        const datagot = await fetchData();
        setAddress(datagot);
        console.log(datagot);
      };
      getAddress();
    })();
  }, []);
  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{address}</Text>
    </View>
  );
}

function Login({ navigation }) {
  const width = Dimensions.get("window").width;
  const animation = useRef(new Animated.Value(0)).current;
  const loginColorInterpolator = animation.interpolate({
    inputRange: [0, Dimensions.get("window").width],
    outputRange: ["blue", "red"],
  });
  const [verifyStage, setVerifyStage] = useState(false);
  const [loginPass, setloginPass] = useState("");
  const [loginName, setloginName] = useState("");
  const [registerName, setregisterName] = useState("");
  const [registerPass, setregisterPass] = useState("");
  const [registerMail, setregMail] = useState("");
  const [otp, setotp] = useState("");
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    const get = async () => {
      var token = await IsToken();
      if (token === true) {
        navigation.replace("DashBoard");
      }
    };
    get();
  });
  return (
    <>
      <KeyboardAvoidingView hide style={styles.container}>
        {!verifyStage ? (
          <View>
            <FormHeading />
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableWithoutFeedback>
                <Animated.View
                  style={{
                    height: 45,
                    backgroundColor: "blue",
                    color: "white",
                    borderRadius: 10,
                    width: "45%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                >
                  <Text style={[styles.text, { color: "white" }]}>Login</Text>
                </Animated.View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback>
                <Animated.View style={styles.btnRegister}>
                  <Text style={styles.text}>Register</Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
            <ScrollView
              onScroll={({ nativeEvent }) => {
                Animated.event(
                  [
                    {
                      nativeEvent: { contentOffset: { x: animation } },
                    },
                  ],
                  { useNativeDriver: false }
                );
                if (nativeEvent.contentOffset >= width) {
                  console.log("yep");
                }
              }}
              horizontal
              pagingEnabled
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
            >
              <LoginForm
                getName={(e) => {
                  setloginName(e);
                  console.log(`${loginName}`);
                }}
                getPass={(e) => {
                  setloginPass(e);
                  console.log(loginPass);
                }}
                onSubmit={async () => {
                  console.log("log");
                  console.log(`${loginName}`);
                  console.log(loginPass);
                  setLoader(true);
                  await axios
                    .post(
                      "https://dzdd.onrender.com/api/login",
                      { name: loginName, password: loginPass },
                      {
                        headers: { "Content-Type": "application/json" },
                      }
                    )
                    .then(async (res) => {
                      console.log(res);
                      var Token = JSON.stringify(res.data);
                      save("TOKEN", Token.toString());
                      setLoader(false);
                      navigation.replace("DashBoard");
                    })
                    .catch((err) => {
                      console.log(err);
                      setLoader(false);
                    });
                }}
              />
              <ScrollView>
                <RegisterForm
                  getName={(e) => {
                    setregisterName(e);
                    console.log(`${registerName}`);
                  }}
                  getMail={(e) => {
                    setregMail(e);
                    console.log(`${registerMail}`);
                  }}
                  getPass={(e) => {
                    setregisterPass(e);
                    console.log(registerPass);
                  }}
                  onSubmit={async () => {
                    console.log("reg");
                    console.log(`${registerName}`);
                    console.log(registerMail);
                    console.log(registerPass);
                    setLoader(true);

                    await axios
                      .post(
                        "https://dzdd.onrender.com/api/register",
                        {
                          name: registerName,
                          password: registerPass,
                          email: registerMail,
                        },
                        {
                          headers: { "Content-Type": "application/json" },
                        }
                      )
                      .then((res) => {
                        console.log(res.data);
                        setLoader(false);

                        setVerifyStage(true);
                      })
                      .catch((err) => {
                        console.log(err);
                        setLoader(false);
                      });
                  }}
                />
              </ScrollView>
            </ScrollView>
            <StatusBar style="auto" />
          </View>
        ) : null}
        {verifyStage ? (
          <View style={{ alignItems: "center" }}>
            <NumericInput
              totalHeight={85}
              totalWidth={350}
              onChange={(value) => setotp(value.toString())}
            />
            <TouchableOpacity
              onPress={async () => {
                await axios
                  .post(
                    "https://dzdd.onrender.com/api/verifyOTP",
                    { email: registerMail, otp: otp },
                    {
                      headers: { "Content-Type": "application/json" },
                    }
                  )
                  .then((res) => {
                    save("TOKEN", res.data);
                    console.log(res.data);
                    navigation.replace("DashBoard");
                    console.log(sto);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              style={{
                backgroundColor: "#111",
                width: 290,
                borderRadius: 10,
                height: 45,
                alignSelf: "center",
                alignContent: "center",
                justifyContent: "center",
                marginTop: 20,
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
                Verify OTP
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </KeyboardAvoidingView>
      {loader ? (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Lottie
            source={require("./assets/loader.json")}
            autoPlay
            loop
            style={{ width: 300 }}
          />
        </View>
      ) : null}
    </>
  );
}
const Stack = createNativeStackNavigator();
export default function App({ navigator }) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Details" component={Login} />
        <Stack.Screen
          name="DashBoard"
          component={HomeTabs}
          options={{
            title: "Anndata",
            headerTitleStyle: {
              fontWeight: "bold",
              textAlign: "center",
            },
            headerStyle: {
              backgroundColor: "#f4511e",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            },
          }}
        />
        <Stack.Screen
          name="Sell"
          component={SellScreen}
          options={{
            title: "Sell",
            headerTitleStyle: {
              fontWeight: "bold",
              textAlign: "center",
            },
            headerStyle: {
              backgroundColor: "#f4511e",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "white",
  },
  text: {
    fontSize: 22,
  },
  requests: {},
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
