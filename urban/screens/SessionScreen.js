import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "@react-navigation/native";
import { palette } from "../styling";
import { BASE_URL } from "../config";

const SessionScreen = ({ UserId }) => {
  console.log(UserId);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // Retrieve user attributes from server
    const fetchSessionData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/sessions/${UserId}`);
        const sessionData = await response.json();
        console.log(sessionData);
        setSessions(sessionData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSessionData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {sessions.length > 0 ? (
        sessions.map((session) => {
          return (
            <View style={styles.containerSub}>
              <Text>{session.date}</Text>
              <Text>{session.distance}</Text>
              <Text>{session.timing}</Text>
            </View>
          );
        })
      ) : (
        <Text>empty</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.dustyRose,
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
    marginTop: 15,
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
  informationText: {
    fontSize: 14,
    fontFamily: "serif",
    padding: 5,
    margin: 5,
  },
});

export default SessionScreen;
