import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { palette } from "../styling";

const Index = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/urbanLogo.png")}
        style={{ width: 100, height: 100 }}
      />
      <Text style={styles.title}>Urban</Text>
      <TouchableOpacity
        title="Login"
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        title="Register"
        style={styles.button}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "80%",
    height: 50,
    backgroundColor: palette.pastelBlue,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    marginTop: 5,
  },
  buttonText: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontFamily: "serif",
  },
  container: {
    backgroundColor: palette.dustyRose,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: -15,
  },
  title: {
    fontSize: 48,
    fontFamily: "serif",
    fontStyle: "italic",
    fontWeight: "bold",
  },
});

export default Index;
