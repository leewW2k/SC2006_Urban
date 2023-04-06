import React, { useEffect,useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import jwtDecode from "jwt-decode";
import { palette } from "../styling";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from '../firebase'

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) != null;
};


export default function LoginScreen({ navigation, setUserId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  //console.log(`${BASE_URL}/api/users/login`);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        navigation.navigate("Main", { param: "Index" });
      }
    })

    return unsubscribe;
  }, [])

  const handleLogin = async () => {
    // Error Checking
    if(email == "" || password == "")
    {
      setErrorMessage("Error: Email and/or Password cannot be empty");
      return;
    }else if(!validateEmail(email))
    {
      setErrorMessage("Error: Invalid Email");
      return;
    }

    // Login Code
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials => {
      // Signed in
      const user = userCredentials.user;
      console.log('Logged in with: ', user.email);
    }))
    .catch(error => {
      setErrorMessage("Error: " + error.message)
      alert(error.message)
    })

    /*
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
      console.log(data);
      const decodedToken = jwtDecode(data.token);
      const userId = decodedToken.userId;
      console.log(userId);
      setUserId(userId);
      navigation.navigate("Main", { param: "Index" });
    } catch (error) {
      console.log(error);
    }
    */
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
              marginTop: 4,
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
