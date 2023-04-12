import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { palette } from "../styling";
import { BASE_URL } from "../config";
import Moment from "moment";
import { Image } from "react-native";
import { useIsFocused } from "@react-navigation/native";

const SessionScreen = ({ navigation, UserId }) => {
  const [sessions, setSessions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const onRefresh = () => {
    setRefreshing(true);
    fetchSessionData();
  };

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/sessions/${UserId}`);
      const sessionData = await response.json();
      if (sessionData.length > 0) setSessions(sessionData);
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Retrieve user attributes from server
    fetchSessionData();
  }, [isFocused]);

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
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {sessions.length > 0 &&
          sessions.map((session) => (
            <TouchableOpacity
              style={styles.containerSub}
              key={session._id}
              onPress={() => {
                navigation.navigate("SessionView", { session: session });
              }}
            >
              <View style={styles.containerSub} key={session._id}>
                <View style={{ marginTop: -10 }}>
                  <Text style={styles.titleText}>{session.title}</Text>
                  <Text style={styles.informationText}>
                    Timing: {secondsToHHMMSS(session.timing)}
                  </Text>
                  <Text style={styles.informationText}>
                    Distance: {(session.distance / 1000).toFixed(2)} km
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
    marginTop: -5,
    paddingHorizontal: 10,
  },
  containerSub: {
    flexDirection: "row",
    borderRadius: 20,
    height: 100,
    width: "100%",
    marginTop: 10,
    backgroundColor: "#F1E8DF",
    fontFamily: "serif",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  informationText: {
    fontSize: 14,
    fontFamily: "serif",
    marginLeft: 3,
    marginTop: 3,
  },
  titleText: {
    fontSize: 14,
    fontFamily: "serif",
    marginLeft: 3,
    marginTop: 3,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  icon: {
    width: 40,
    height: 40,
    marginLeft: 30,
  },
});

export default SessionScreen;
