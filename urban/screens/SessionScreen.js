import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { palette } from "../styling";
import { BASE_URL } from "../config";
import Moment from "moment";
import { Image } from "react-native";

const SessionScreen = ({ navigation, UserId }) => {
  console.log(UserId);
  const [sessions, setSessions] = useState([]);
  const [timing, setTiming] = useState(0);
  const [distance, setDistance] = useState(0);

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/sessions/${UserId}`);
      const sessionData = await response.json();
      console.log("start session data")
      console.log(sessionData);
      if(sessionData.length > 0)
        console.log("Attempting to parse sessionData.coordinates", sessionData[0].coordinates);
      
      /*
      try {
        const parsedJson = JSON.parse(sessionData[0].coordinates);
        console.log(parsedJson);
      } catch (error) {
        console.log(error);
      }
      */
      console.log("end session data")
      setSessions(sessionData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Retrieve user attributes from server
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
      <TouchableOpacity onPress={() => fetchSessionData()}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "serif",
            fontStyle: "italic",
            marginTop: 4,
          }}
        >
          Refresh Sessions
        </Text>
      </TouchableOpacity>
      <ScrollView style={{ flex: 1 }}>
        {sessions.length > 0 &&
          sessions.map((session) => (
            <TouchableOpacity
            style={styles.containerSub}
            key={session._id}
            onPress={() => {
              navigation.navigate('SessionView', { session: session });
            }}
          >
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
            </TouchableOpacity>
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
