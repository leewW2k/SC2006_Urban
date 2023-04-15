import { View, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "../config";
import { useIsFocused } from "@react-navigation/native";

const HomeScreen = ({ UserId }) => {
  console.log(UserId);
  //used to ensure the page is always rendered when entered
  const isFocused = useIsFocused();
  //coords pointing to Singapore (our default location)
  const [mapRegion, setMapRegion] = useState({
    latitude: 1.29027,
    longitude: 103.851959,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  //coords pointing to destination selected by user
  const [selectedRegion, setSelectedRegion] = useState(null);

  //request for foreground location permissions
  //sets mapRegion to current location once accepted
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

  //requests permission if not accepted
  //triggers once user enters the page
  useEffect(() => {
    userLocation();
  }, [isFocused]);

  //used to zoom out the map accordingly when there is a mapRegion and selectedRegion
  let mapViewRef = useRef(null);
  //triggers once user selected a destination
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

  return (
    <View style={{ flex: 1 }}>
      {/*Search Bar, use of Google Places API*/}
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
      {/* View of the map, Google Maps API */}
      <MapView
        style={styles.map}
        region={mapRegion}
        provider="google"
        ref={mapViewRef}
      >
        {/* Marker pointing to your location (if permission accepted) */}
        <Marker coordinate={mapRegion} title="MyLocation" />
        {/* Marker pointing to selected destination
        and shows a route between your current location 
        and searched location (if searched) */}
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
