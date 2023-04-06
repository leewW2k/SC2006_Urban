import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { palette } from "../styling";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) != null;
};

const isAlphanumeric = require("is-alphanumeric");

export default function RegisterScreen({ navigation, setUserId }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        navigation.navigate("Main", { param: "Index" });
      }
    })

    return unsubscribe;
  }, [])
  const [user, setUser] = useState(null);

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
  /*
  function validRegister(name, email, password) {
    if (name.length === 0 || email.length === 0 || password.length === 0) {
      Alert.alert("Username/Email/Password cannot be Empty!!!");
      return false;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email!!!");
      return false;
    }
    if (password.length < 8 || password.length > 20) {
      Alert.alert("Password must be between 8-20 characters long!!!");
      return false;
    }
    if (name.length < 4 || name.length > 20) {
      Alert.alert("Username must be between 4-20 characters long!!!");
      return false;
    }
    if (isAlphanumeric(name) == false) {
      Alert.alert("Your username cannot contain invalid characters!!!");
      return false;
    }
    return true;
  }

  const register = async () => {
    if (validRegister(name, email, password)) {
      console.log("Yes");
      handleRegister();
    }
  };
  */

  const handleRegister = async () => {
    // Error Checking
    if(name == "")
    {
      setErrorMessage("Error: Name cannot be empty");
      return;
    }else if(email == "" || password == "")
    {
      setErrorMessage("Error: Email and/or Password cannot be empty");
      return;
    }else if(!validateEmail(email))
    {
      setErrorMessage("Error: Invalid Email");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user.email);
    })
    .catch(error => {
      alert(error.message);
      setErrorMessage("Error: " + error.message);
    });

    /*
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
      Alert.alert("Account successfully registered");
      setUser(data.user);
      console.log(user);
      navigation.navigate("Main", setUserId(user._id));
    } catch (error) {
      console.log(error);
    }
    */
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
          <Text
            style={{
              fontSize: 12,
              fontFamily: "serif",
              fontWeight: "bold",
              marginTop: 4,
              color: "red",
            }}
          >
          {errorMessage}
          </Text>
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
