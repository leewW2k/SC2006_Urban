import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { BASE_URL } from "../config";
import * as TaskManager from "expo-task-manager";
import { palette } from "../styling";

const TrackingScreen = ({ UserId }) => {
  const navigation = useNavigation();
  const [mapRegion, setMapRegion] = useState({
    latitude: 1.29027,
    longitude: 103.851959,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [started, setStarted] = useState(false);
  const [timing, setTiming] = useState(0);
  const [distance, setDistance] = useState(0);
  const intervalIdRef = useRef(null);
  const locationArrayRef = useRef([]);
  const [prevLocation, setPrevLocation] = useState(null);
  const [paused, setPaused] = useState(false);
  const [isCycle, setIsCycle] = useState(true);
  const [goalProgress, setGoalProgress] = useState(0);
  const [title, setTitle] = useState("Urban Adventure");

  const LOCATION_TASK_NAME = "background-location-task";
  // manages location tracking on hardware device
  TaskManager.defineTask(
    "background-location-task",
    async ({ data, error }) => {
      if (error) {
        console.log(error);
        return;
      }
      if (data) {
        const { locations } = data;
        console.log("Locations:", locations);
        locations.forEach((location) => handleLocationUpdate(location));
      }
    }
  );

  // Executes when user enters page, requests background location and get current location
  // Fetches progress of user as well
  useEffect(() => {
    const userLocation = async () => {
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
      }
      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      });
    };
    const fetchProgress = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/${UserId}`);
        const userData = await response.json();
        setGoalProgress(userData.goalProgress);
      } catch (error) {
        console.error(error);
      }
    };
    userLocation();
    fetchProgress();
  }, []);

  // Handles the background location tracking
  const startBackgroundLocation = async () => {
    try {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 2,
        foregroundService: {
          notificationTitle: "Background location enabled",
          notificationBody: "This app is using background location",
        },
      });
      console.log("Background location started");
    } catch (error) {
      console.log(error);
    }
  };

  // handles background location tracking when tracking is paused
  const pauseBackgroundLocation = async () => {
    try {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log("Background location paused");
      setPaused(true);
    } catch (error) {
      console.log(error);
    }
  };

  // handles background location tracking when session is resumed
  const resumeBackgroundLocation = async () => {
    try {
      TaskManager.defineTask(
        "background-location-task",
        async ({ data, error }) => {
          if (error) {
            console.log(error);
            return;
          }
          if (data) {
            const { locations } = data;
            console.log("Locations:", locations);
            locations.forEach((location) => handleLocationUpdate(location));
          }
        }
      );
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 2000,
        distanceInterval: 1,
        foregroundService: {
          notificationTitle: "Background location enabled",
          notificationBody: "This app is using background location",
        },
      });
      console.log("Background location resumed");
      setPaused(false);
    } catch (error) {
      console.log(error);
    }
  };

  // handles background location tracking when session is stopped
  const stopBackgroundLocation = async () => {
    try {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log("Background location stopped");
      await TaskManager.unregisterAllTasksAsync();
      console.log("All tasks unregistered");
    } catch (error) {
      console.log(error);
    }
  };

  // handles location update when session is running
  // saves the coord and accumulates the distance
  const handleLocationUpdate = async (location) => {
    console.log("New location:", location);
    locationArrayRef.current.push({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    if (prevLocation) {
      let coords = {
        latitude: prevLocation.coords.latitude,
        longitude: prevLocation.coords.longitude,
      };
      const newDistance = getDistance(
        {
          latitude: prevLocation.coords.latitude,
          longitude: prevLocation.coords.longitude,
        },
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        1, // accuracy (1 = high)
        1 // precision (1 = degrees)
      );
      setDistance(distance + newDistance);
    }
    setPrevLocation(location);
  };

  // handle the session when start is pressed
  const handleStart = () => {
    locationArrayRef.current = [];
    setTiming((time) => 0);
    setDistance((dist) => 0);
    intervalIdRef.current = setInterval(() => {
      setTiming((time) => time + 1);
    }, 1000);
    startBackgroundLocation();
    setStarted(true);
  };

  // handle the session when pause is pressed
  // stop the timing and background location
  const handlePause = async () => {
    clearInterval(intervalIdRef.current);
    await pauseBackgroundLocation();
  };

  // handle the session when resume is pressed
  // continues timing and starts background location
  const handleResume = async () => {
    intervalIdRef.current = setInterval(() => {
      setTiming((time) => time + 1);
    }, 1000);
    await resumeBackgroundLocation();
  };

  // updates goal when goalProgress is changed
  useEffect(() => {
    updateGoal();
  }, [goalProgress]);

  // accumulates distance to the goal progress
  // save to DB
  const updateGoal = async () => {
    try {
      console.log(goalProgress);
      const response = await fetch(
        `${BASE_URL}/api/users/${UserId}/goal-progress`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goalProgress,
          }),
        }
      );
      const data = await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  // handles the system when stop is pressed
  // saves the session and goal progress when stop is pressed
  const handleStop = async () => {
    setGoalProgress((prevGoalProgress) => prevGoalProgress + distance);
    updateGoal();
    try {
      console.log("STOP");
      const response = await fetch(`${BASE_URL}/api/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: UserId,
          distance,
          timing,
          coordinates: locationArrayRef.current,
          isCycle,
          title,
        }),
      });
      const data = await response.json();
      Alert.alert("Session successfully saved");
      navigation.navigate("Main");
    } catch (error) {
      console.log(error);
    }
    clearInterval(intervalIdRef.current);
    stopBackgroundLocation();
    setDistance((d) => 0);
    setTiming((t) => 0);
    locationArrayRef.current = [];
    setStarted(false);
  };

  // set context to cycling session
  const handleCycle = () => {
    setIsCycle(true);
  };

  // set context to running session
  const handleRun = () => {
    setIsCycle(false);
  };

  // format time to hh:mm:ss
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
      </MapView>
      <View style={styles.container}>
        <View style={{ marginBottom: -15 }}>
          <TextInput
            style={styles.cycleRunText}
            value={title}
            onChangeText={setTitle}
            editable={!started}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <TouchableOpacity
            style={[
              styles.cycleRun,
              isCycle ? styles.conditionTrue : styles.cycleRun,
            ]}
            onPress={handleCycle}
          >
            <Image
              source={require("../assets/cyclingIcon.png")}
              style={styles.icon}
            />
            <Text style={styles.cycleRunText}>Cycle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.cycleRun,
              !isCycle ? styles.conditionTrue : styles.cycleRun,
            ]}
            onPress={handleRun}
          >
            <Image
              source={require("../assets/runningIcon.png")}
              style={styles.icon}
            />
            <Text style={styles.cycleRunText}>Run</Text>
          </TouchableOpacity>
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
            Distance: {(distance / 1000).toFixed(2)} km
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
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {!started ? (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleStart}
              >
                <Text style={styles.controlText}>Start</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <View>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleStop}
                >
                  <Text style={styles.controlText}>Stop</Text>
                </TouchableOpacity>
              </View>
              {paused ? (
                <View>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleResume}
                  >
                    <Text style={styles.controlText}>Resume</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handlePause}
                  >
                    <Text style={styles.controlText}>Pause</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.pastelBlue,
    alignContent: "center",
    width: "100%",
    height: 500,
    paddingHorizontal: 10,
  },
  cycleRunText: {
    fontSize: 14,
    color: "black",
    fontFamily: "serif",
    fontStyle: "italic",
    fontWeight: "bold",
  },
  controlText: {
    fontSize: 18,
    color: "black",
    fontFamily: "serif",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  map: {
    width: "100%",
    height: "35%",
  },
  icon: {
    width: 20,
    height: 20,
    padding: 0,
    marginRight: 10,
  },
  cycleRun: {
    flexDirection: "row",
    backgroundColor: palette.peach,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 17,
  },
  controlButton: {
    //flexDirection: "row",
    backgroundColor: palette.peach,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 100,
    borderRadius: 20,
    margin: 10,
    marginTop: 10,
    textAlign: "center",
  },
  informationText: {
    fontSize: 22,
    color: "black",
    fontFamily: "serif",
    fontStyle: "italic",
    padding: 10,
  },
  conditionTrue: {
    backgroundColor: "#F1E8DF",
    flexDirection: "row",
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 17,
  },
});

export default TrackingScreen;
