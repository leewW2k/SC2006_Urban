import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getDistance } from "geolib";

const TrackingScreen = () => {
  //To get my CurrentLocation
  const route = useRoute();
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 1.29027,
    longitude: 103.851959,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  // route.params.mapRegion

  //for distance and time
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalIdRef = useRef(null);
  const locationArrayRef = useRef([]);

  async function handleStart() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }
    console.log("Passed Check 1");

    locationArrayRef.current = [];
    setIsRunning(true);
    intervalIdRef.current = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 0.5,
      },
      (location) => {
        let coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        locationArrayRef.current.push(coords);
        console.log("Passed Check 2");

        if (locationArrayRef.current.length > 1) {
          let newDistance =
            distance +
            getDistance(
              locationArrayRef.current[locationArrayRef.current.length - 2],
              locationArrayRef.current[locationArrayRef.current.length - 1]
            );
          console.log(newDistance);
          setDistance(newDistance);
        }
      }
    );
  }

  function handlePause() {
    clearInterval(intervalIdRef.current);
    Location.stopLocationUpdatesAsync();
    setIsRunning(false);
  }

  function handleResume() {
    intervalIdRef.current = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
    setIsRunning(true);
  }

  function handleStop() {
    clearInterval(intervalIdRef.current);
    Location.stopLocationUpdatesAsync();
    setIsRunning(false);
    setDistance(0);
    setTime(0);
    locationArrayRef.current = [];
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <View>
      <MapView style={styles.map} region={currentLocation} provider="google">
        <Marker coordinate={currentLocation} title="MyLocation" />
      </MapView>
      <Text>Distance: {distance.toFixed(2)} meters</Text>
      <Text>Time: {formatTime(time)}</Text>
      {isRunning ? (
        <Button title="Pause" onPress={handlePause} />
      ) : (
        <Button title="Start" onPress={handleStart} />
      )}
      {isRunning && <Button title="Stop" onPress={handleStop} />}
      {!isRunning && time > 0 && (
        <Button title="Resume" onPress={handleResume} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 400,
    height: 50,
    backgroundColor: "#3498db",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    marginTop: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
  map: {
    width: "100%",
    height: "80%",
  },
});

export default TrackingScreen;
