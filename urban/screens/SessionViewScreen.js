import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { palette } from "../styling";
import Moment from "moment";

const SessionViewScreen = ({ route }) => {
  const [timing, setTiming] = useState(0);
  const [distance, setDistance] = useState(0);
  const [title, setTitle] = useState("");
  console.log("Session View");
  const { session } = route.params;
  const [mapRegion, setMapRegion] = useState({
    latitude: session.coordinates[0].latitude,
    longitude: session.coordinates[0].longitude,
    latitudeDelta: 0.006,
    longitudeDelta: 0.006,
  });

  useEffect(() => {
    setTiming(session.timing);
    setDistance(session.distance);
    setTitle(session.title);
  }, []);

  const routeCoordinates = session.coordinates;

  const secondsToHHMMSS = (seconds) => {
    const duration = Moment.duration(seconds, "seconds");

    const formattedDuration =
      duration.hours() +
      ":" +
      duration.minutes().toString().padStart(2, "0") +
      ":" +
      duration.seconds().toString().padStart(2, "0");
    return formattedDuration;
  };

  return (
    <View style={{ marginTop: -10 }}>
      <MapView style={styles.map} region={mapRegion} provider="google">
        <Marker coordinate={mapRegion} title="Start" pinColor="green" />
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#FF0000"
          strokeWidth={3}
        />
      </MapView>
      <View style={styles.container}>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#F1E8DF",
            borderRadius: 10,
            width: "100%",
            alignContent: "center",
            justifyContent: "space-evenly",
            padding: 20,
          }}
        >
          <Text style={styles.informationText}>
            Distance: {(distance / 1000).toFixed(2)} KM
          </Text>
          <Text style={styles.informationText}>
            Time: {secondsToHHMMSS(timing)}
          </Text>
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
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    height: "40%",
    paddingHorizontal: 10,
  },
  informationText: {
    fontSize: 22,
    color: "black",
    fontFamily: "serif",
    fontStyle: "italic",
    padding: 10,
  },
  titleText: {
    fontSize: 22,
    color: "black",
    fontFamily: "serif",
    fontStyle: "italic",
    fontWeight: "bold",
    marginTop: -5,
    marginBottom: 10,
    paddingRight: 10,
  },
  map: {
    width: "100%",
    height: "60%",
  },
});

export default SessionViewScreen;
