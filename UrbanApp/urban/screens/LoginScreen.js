import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import jwtDecode from "jwt-decode";
import { palette } from "../styling";
import { BASE_URL } from "../config";
import { Alert } from "react-native";

export default function LoginScreen({ navigation, setUserId }) {
  // State of the user login details (email, password)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State of the error messages
  const [errorMessage, setErrorMessage] = useState("");
  console.log(`${BASE_URL}/api/users/login`);

  // executes when user presses Login button
  // returns userID to DB when valid
  // returns invalid error when invalid
  const handleLogin = async () => {
    // Error Checking
    if (email == "" || password == "") {
      Alert.alert("Email/Password cannot be Empty!!!");
      setErrorMessage("Email/Password cannot be Empty");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      console.log("login");
      const data = await response.json();
      if (!data.token) {
        Alert.alert(data.message);
        setErrorMessage(data.message);
      }
      console.log(errorMessage);
      const decodedToken = jwtDecode(data.token);
      const userId = decodedToken.userId;
      console.log(userId);
      setUserId(userId);
      navigation.navigate("Main", { param: "Index" });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerSub}>
        <Text style={styles.title}>Login</Text>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "serif",
              fontWeight: "bold",
              marginBottom: 4,
              color: "red",
            }}
          >
            {errorMessage}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          {/* Goes to Registration Page upon pressing */}
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "serif",
                fontStyle: "italic",
                marginTop: 4,
              }}
            >
              Don't have an account?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.dustyRose,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "serif",
    marginTop: -15,
  },
  containerSub: {
    borderRadius: 20,
    width: "80%",
    height: "70%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
    fontFamily: "serif",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    alignContent: "center",
    justifyContent: "center",
    fontFamily: "serif",
    fontStyle: "italic",
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: palette.lavender,
    borderRadius: 5,
    marginBottom: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: palette.pastelBlue,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    marginTop: 12,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "serif",
  },
});
