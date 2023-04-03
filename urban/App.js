import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Index from "./screens/Index";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RegisterScreen from "./screens/RegistrationScreen";
import HomeScreen from "./screens/HomeScreen";
import SessionScreen from "./screens/SessionScreen";
import React, { useState } from "react";
import TrackingScreen from "./screens/TrackingScreen";
import { palette } from "./styling";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [userId, setUserId] = useState(null);
  const [mapRegion, setmapRegion] = useState(null);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Index"
          component={Index}
          options={{
            title: "Welcome to Urban",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Login"
          options={{
            title: "Login",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTintColor: "#fff",
          }}
        >
          {(props) => <LoginScreen {...props} setUserId={setUserId} />}
        </Stack.Screen>
        <Stack.Screen
          name="Register"
          options={{
            title: "Register",
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTintColor: "#fff",
          }}
        >
          {(props) => <RegisterScreen {...props} setUserId={setUserId} />}
        </Stack.Screen>
        <Stack.Screen name="Main" options={{ headerShown: false }}>
          {(props) => (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarActiveTintColor: "black",
                tabBarInactiveTintColor: "white",
                tabBarStyle: {
                  backgroundColor: palette.pastelBlue,
                },
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === "Home") {
                    iconName = focused ? "home" : "home-outline";
                  } else if (route.name === "Profile") {
                    iconName = focused ? "person" : "person-outline";
                  } else if (route.name === "Session") {
                    iconName = focused ? "albums" : "albums-outline";
                  } else if (route.name === "Track") {
                    iconName = focused ? "bicycle" : "bicycle-outline";
                  }

                  const iconColor = focused
                    ? palette.dustyRose
                    : palette.lavender;

                  // return the appropriate icon component
                  return (
                    <Ionicons name={iconName} size={size} color={iconColor} />
                  );
                },
              })}
            >
              <Tab.Screen
                name="Home"
                options={{
                  title: "Home",
                  headerStyle: styles.headerStyle,
                  headerTitleStyle: styles.headerTitleStyle,
                  headerTintColor: "#fff",
                }}
              >
                {(props) => <HomeScreen {...props} UserId={userId} />}
              </Tab.Screen>
              <Tab.Screen
                name="Track"
                options={{
                  title: "Track",
                  headerStyle: styles.headerStyle,
                  headerTitleStyle: styles.headerTitleStyle,
                  headerTintColor: "#fff",
                }}
              >
                {(props) => (
                  <TrackingScreen
                    {...props}
                    UserId={userId}
                    mapRegion={mapRegion}
                  />
                )}
              </Tab.Screen>
              <Tab.Screen
                name="Session"
                options={{
                  title: "Session",
                  headerStyle: styles.headerStyle,
                  headerTitleStyle: styles.headerTitleStyle,
                  headerTintColor: "#fff",
                }}
              >
                {(props) => <SessionScreen {...props} UserId={userId} />}
              </Tab.Screen>
              <Tab.Screen
                name="Profile"
                options={{
                  title: "Profile",
                  headerStyle: styles.headerStyle,
                  headerTitleStyle: styles.headerTitleStyle,
                  headerTintColor: "#fff",
                }}
              >
                {(props) => <ProfileScreen {...props} UserId={userId} />}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="Track" component={TrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: palette.pastelBlue, // set header background color
    borderRadius: 5,
  },
  headerTitleStyle: {
    fontWeight: "bold", // set header title font weight
    color: "#fff", // set header title color
    fontFamily: "serif",
    fontStyle: "italic",
    textShadowRadius: 2,
  },
});

export default App;
