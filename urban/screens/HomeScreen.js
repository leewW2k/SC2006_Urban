import { View, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "../config";
import { useIsFocused } from "@react-navigation/native";

const HomeScreen = ({ UserId }) => {
  //coords pointing to Singapore
  console.log(UserId);
  const isFocused = useIsFocused();
  const [mapRegion, setMapRegion] = useState({
    latitude: 1.29027,
    longitude: 103.851959,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  //use this to establish markers
  const [selectedRegion, setSelectedRegion] = useState(null);

  //request for permission
  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  let mapViewRef = useRef(null);
  useEffect(() => {
    if (mapRegion && selectedRegion) {
      let northeast = {
        latitude: Math.max(mapRegion.latitude, selectedRegion.latitude),
        longitude: Math.max(mapRegion.longitude, selectedRegion.longitude),
      };
      let southwest = {
        latitude: Math.min(mapRegion.latitude, selectedRegion.latitude),
        longitude: Math.min(mapRegion.longitude, selectedRegion.longitude),
      };
      let edgePadding = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      };
      mapViewRef.current.fitToCoordinates([northeast, southwest], {
        edgePadding,
      });
    }
  }, [selectedRegion]);

  useEffect(() => {
    userLocation();
  }, [isFocused]);

  return (
    <View style={{ flex: 1 }}>
      <GooglePlacesAutocomplete
        placeholder="Destination"
        fetchDetails={true}
        GooglePlacesSearchQuery={{
          rankby: "distance",
        }}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
          setSelectedRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: "en",
          components: "country:sg",
          types: "park",
          radius: 30000,
        }}
        styles={{
          container: {
            flex: 0,
            position: "absolute",
            width: "100%",
            zIndex: 1,
          },
          listView: { backgroundColor: "white" },
        }}
      />
      <MapView
        style={styles.map}
        region={mapRegion}
        provider="google"
        ref={mapViewRef}
      >
        <Marker coordinate={mapRegion} title="MyLocation" />
        {selectedRegion && (
          <>
            <Marker
              coordinate={{
                latitude: selectedRegion.latitude,
                longitude: selectedRegion.longitude,
              }}
              title="SearchedLocation"
            />
            <MapViewDirections
              origin={mapRegion}
              destination={selectedRegion}
              apikey={GOOGLE_MAPS_APIKEY}
              mode="WALKING"
              strokeWidth={4}
              strokeColor="green"
            />
          </>
        )}
      </MapView>
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
  map: {
    width: "100%",
    height: "100%",
  },
});
export default HomeScreen;
