import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { palette } from "../styling";
import { BASE_URL } from "../config";

export default function RegisterScreen({ navigation, setUserId }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const handleRegister = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const data = await response.json();
      setUser(data.user);
      console.log(user);
      //setUserId(data)
      navigation.navigate("Main", setUserId(user._id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerSub}>
        <Text style={styles.title}>Register</Text>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text) => setName(text)}
            value={name}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "serif",
                fontStyle: "italic",
                marginTop: 4,
              }}
            >
              Already have an account?
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
    height: "75%",
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
