import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { palette } from "../styling";
import { BASE_URL } from "../config";
import Moment from "moment";
import { Image } from "react-native";

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

  function formatDate(date) {
    Moment.locale("en");
    return Moment(date).format("MMMM Do YYYY, ddd H:mm a");
  }

  function secondsToHHMMSS(seconds) {
    const duration = Moment.duration(seconds, "seconds");

    const formattedDuration =
      duration.hours() +
      ":" +
      duration.minutes().toString().padStart(2, "0") +
      ":" +
      duration.seconds().toString().padStart(2, "0");
    return formattedDuration;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        {sessions.length > 0 &&
          sessions.map((session) => (
            <View style={styles.containerSub} key={session._id}>
              <View>
                <Text style={styles.informationText}>
                  Timing: {secondsToHHMMSS(session.timing)}
                </Text>
                <Text style={styles.informationText}>
                  Distance: {session.distance / 1000} km
                </Text>
                <Text style={styles.informationText}>
                  {formatDate(session.date)}
                </Text>
              </View>
              <View>
                {session.isCycle ? (
                  <Image
                    source={require("../assets/cyclingIcon.png")}
                    style={styles.icon}
                  />
                ) : (
                  <Image
                    source={require("../assets/runningIcon.png")}
                    style={styles.icon}
                  />
                )}
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.dustyRose,
    alignContent: "center",
    width: "100%",
    marginTop: -10,
    paddingHorizontal: 10,
  },
  containerSub: {
    flexDirection: "row",
    borderRadius: 20,
    height: 100,
    width: "100%",
    backgroundColor: "#F1E8DF",
    fontFamily: "serif",
    marginTop: 12,
    justifyContent: "center",
    alignContent: "space-around",
    alignItems: "center",
  },
  informationText: {
    fontSize: 14,
    fontFamily: "serif",
    margin: 3,
  },
  icon: {
    width: 40,
    height: 40,
    marginLeft: 30,
  },
});

export default SessionScreen;
