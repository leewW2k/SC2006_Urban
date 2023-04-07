import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { palette } from "../styling";
import { BASE_URL } from "../config";
import { ImageBackgroundComponent } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = ({ UserId }) => {
  console.log("Profile Page ", UserId);
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result.assets[0].uri);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const toggleEditable = async () => {
    console.log(ImageBackgroundComponent);
    setIsEditable(!isEditable);
    console.log(isEditable);
    if (isEditable === true) {
      try {
        const response = await fetch(`${BASE_URL}/api/users/${UserId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image,
            name,
            goal,
          }),
        });
        const data = await response.json();
        setName(name);
        setGoal(goal);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    // Retrieve user attributes from server
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/${UserId}`);
        const userData = await response.json();
        console.log(userData);
        setName(userData.name);
        setEmail(userData.email);
        setGoal(userData.goal);
        setImage(userData.image);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [UserId]);

  return (
    <View style={styles.container}>
      <View style={styles.containerSub}>
        <View
          style={{
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity onPress={pickImage} disabled={!isEditable}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 80,
                  marginTop: -10,
                  marginBottom: 10,
                }}
              />
            ) : (
              <Image
                source={require("../assets/userIcon.png")}
                style={{ width: 80, height: 80, borderRadius: 80 }}
              />
            )}
          </TouchableOpacity>
          <Text>Logged in as:</Text>
          <Text>{email}</Text>
        </View>
        <View>
          <Text style={styles.informationText}>Name:</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            editable={isEditable}
          />
          <Text style={(styles.informationText, { padding: 10 })}>Goal:</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text style={styles.informationText}> /</Text>
            <TextInput
              keyboardType="numeric"
              value={goal.toString()}
              onChangeText={(text) => setGoal(parseFloat(text))}
              editable={isEditable}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={toggleEditable}>
          {!isEditable ? (
            <Text style={styles.buttonText}>Edit</Text>
          ) : (
            <Text style={styles.buttonText}>Save</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("Index");
          }}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    height: 500,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "serif",
    paddingTop: 40,
    paddingBottom: 20,
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
    marginTop: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "serif",
  },
  informationText: {
    fontSize: 14,
    fontFamily: "serif",
    padding: 5,
    margin: 5,
  },
});

export default ProfileScreen;
