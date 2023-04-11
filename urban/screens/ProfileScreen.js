import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { palette } from "../styling";
import { BASE_URL } from "../config";
import { ImageBackgroundComponent } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from "@react-navigation/native";

const ProfileScreen = ({ UserId }) => {
  console.log("Profile Page ", UserId);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const [image, setImage] = useState(null);
  const [goalProgress, setGoalProgress] = useState(0);
  const [goalCompleteDate, setGoalCompleteDate] = useState(null);

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
      if (name.length === "") {
        Alert.alert("Username cannot be empty");
        return;
      }
      if (name.length < 4 || name.length > 20) {
        Alert.alert("Username must be between 4 to 20 characters");
        return;
      }
      if (goal < 10 || goal > 999) {
        Alert.alert("Goal must be between 10-999 km");
        return;
      }
      if(goal < goalProgress / 1000)
      {
        Alert.alert("Goal must be between " + (goalProgress / 1000) + "-999 km");
        return;
      }
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
            goalProgress,
          }),
        });
        const data = await response.json();
        setName(name);
        setGoal(goal);
        setGoalProgress(goalProgress);
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
        console.log("[Profile Screen] Fetch data:");
        console.log(userData);
        setName(userData.name);
        setEmail(userData.email);
        setGoal(userData.goal);
        setImage(userData.image);
        setGoalProgress(userData.goalProgress);
        setGoalCompleteDate(userData.goalCompleteDate);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [UserId, isEditable, isFocused]);

  const checkValueIsNumberOrNot = (inputValue) => {
    if (isNaN(parseFloat(inputValue))) {
      return 0;
    }
    return parseFloat(inputValue);
  };

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
          <Text style={styles.titleName}>Logged in as:</Text>
          <Text style={{ fontSize: 14, fontFamily: "serif", marginTop: 5 }}>
            {email}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "space-evenly",
            alignItems: "baseline",
            borderWidth: 5,
            width: "100%",
            margin: 5,
          }}
        >
          <View style={{ flexDirection: "row", borderWidth: 1 }}>
            <Text style={styles.title}>Name: </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              editable={isEditable}
              style={styles.editText}
            />
          </View>
          <View style={{ flexDirection: "row", alignContent: "space-between" }}>
            <View>
              <Text style={styles.title}>Goal Progress (km):</Text>
              <Text style={styles.informationText}>
                {(goal ? (goalProgress / 1000) : 0).toFixed(2)}
                {"    ("}
                {goal
                  ? ((((goalProgress / 1000)) / goal) * 100).toFixed(3)
                  : 0}
                {"%)"}
                {goalCompleteDate ? " Goal Reached!" : ""}
              </Text>
              <Text style={styles.title}>Goal (km):</Text>
              <TextInput
                keyboardType="numeric"
                value={goal.toString()}
                onChangeText={(text) => setGoal(checkValueIsNumberOrNot(text))}
                editable={isEditable}
                style={styles.editGoalText}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={toggleEditable}>
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
    justifyContent: "space-around",
    fontFamily: "serif",
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    alignContent: "center",
    justifyContent: "center",
    fontFamily: "serif",
    fontStyle: "italic",
    marginTop: 5,
    paddingLeft: 5,
  },
  titleName: {
    fontSize: 14,
    fontWeight: "bold",
    alignContent: "center",
    justifyContent: "center",
    fontFamily: "serif",
    fontStyle: "italic",
    marginTop: 5,
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
    marginTop: 15,
  },
  editButton: {
    width: "60%",
    height: 40,
    backgroundColor: palette.pastelBlue,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "serif",
  },
  informationText: {
    fontSize: 14,
    fontFamily: "serif",
    marginTop: 5,
    paddingLeft: 5,
  },
  editText: {
    fontSize: 14,
    fontFamily: "serif",
  },
  editGoalText: {
    fontSize: 14,
    fontFamily: "serif",
    marginTop: 0,
    paddingLeft: 5,
  },
});

export default ProfileScreen;
