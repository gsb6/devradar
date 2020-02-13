import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import { connect, disconnect, subscribeToNewDevs } from '../services/socket';

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#fff',
  },

  callout: {
    width: 260,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  bio: {
    marginTop: 5,
    color: '#666',
  },

  techs: {
    marginTop: 5,
  },

  searchForm: {
    position: 'absolute',
    flexDirection: 'row',
    top: 20,
    right: 20,
    left: 20,
    zIndex: 5,
  },

  searchInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 2,
    fontSize: 16,
    color: '#333',
  },

  searchButton: {
    width: 50,
    height: 50,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#8e4dff',
  }
})

export default function Main({ navigation }) {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [devs, setDevs] = useState([]);
  const [techs, setTechs] = useState('');

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (!granted) return;

      const { coords } = await getCurrentPositionAsync({
        enableHighAccuracy: true,
      });

      const { latitude, longitude } = coords;

      setCurrentRegion({
        latitude,
        longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      });
    }

    loadInitialPosition();
  }, []);

  useEffect(() => {
    subscribeToNewDevs(dev => setDevs([...devs, dev]));
  }, [devs]);

  function setupWebsocket() {
    const { latitude, longitude } = currentRegion;

    disconnect();

    connect(latitude, longitude, techs);
  }

  async function searchDevs() {
    const { latitude, longitude } = currentRegion;

    const response = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs,
      }
    });

    setDevs(response.data.devs);
    setupWebsocket();
  }

  function handleRegionChangeComplete(region) {
    setCurrentRegion(region);
  }

  if (!currentRegion) return null;

  return (
    <>
      <MapView
        initialRegion={currentRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
        style={styles.map}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              longitude: dev.location.coordinates[0],
              latitude: dev.location.coordinates[1]
            }}
          >
            <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />
            <Callout onPress={() => navigation.navigate('Profile', { github_username: dev.github_username })}>
              <View style={styles.callout}>
                <Text style={styles.name}>{ dev.name }</Text>
                <Text style={styles.bio}>{ dev.bio }</Text>
                <Text style={styles.techs}>{ dev.techs.join(', ') }</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.searchForm}>
        <TextInput
          autoCapitalize="words"
          autoCorrect={false}
          onChangeText={setTechs}
          placeholder="Buscar devs por techs..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />

        <TouchableOpacity activeOpacity={0.7} onPress={searchDevs} style={styles.searchButton}>
          <MaterialIcons name="my-location" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
}
