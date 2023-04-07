import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { palette } from "../styling";
import { BASE_URL } from "../config";
import Moment from "moment";
import { Image } from "react-native";

const SessionViewScreen = ({ route, UserId }) => {
  const [timing, setTiming] = useState(0);
  const [distance, setDistance] = useState(0);
  console.log("Session View");
  const { session } = route.params;
  const [mapRegion, setMapRegion] = useState({
    latitude: session.coordinates[0].latitude,
    longitude: session.coordinates[0].longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    setTiming(session.timing);
    setDistance(session.distance);
  }, []);

  const routeCoordinates = session.coordinates;

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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };


  return (
    <View style={{ marginTop: -10 }}>
      <MapView style={styles.map} region={mapRegion} provider="google">
        <Marker coordinate={mapRegion} title="MyLocation" />
        <Polyline
        coordinates={routeCoordinates}
        strokeColor="#FF0000"
        strokeWidth={3}
      />
      </MapView>
      <View style={styles.container}>
        <View
            style={{
              backgroundColor: "#F1E8DF",
              marginTop: 10,
              borderRadius: 10,
              width: "100%",
              alignContent: "center",
              justifyContent: "space-evenly",
              padding: 20,
            }}
          >
            <Text style={styles.informationText}>
              Distance: {distance.toFixed(2)} meters
            </Text>
            <Text style={styles.informationText}>Time: {formatTime(timing)}</Text>
            <Text style={styles.informationText}>
              Speed:{" "}
              {distance === 0 || timing === 0
                ? 0.0
                : (distance / timing).toFixed(2)}{" "}
              m/s
            </Text>
        </View>
      </View>  
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.dustyRose,
    alignContent: "center",
    width: "100%",
    height: 500,
    marginTop: -10,
    paddingHorizontal: 10,
  },
  informationText: {
    fontSize: 22,
    color: "black",
    fontFamily: "serif",
    fontStyle: "italic",
    padding: 10,
  },
  map: {
    width: "100%",
    height: "35%",
  },
});

export default SessionViewScreen;
