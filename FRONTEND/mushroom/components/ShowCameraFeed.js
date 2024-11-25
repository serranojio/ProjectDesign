import { StyleSheet, Text, Image, View, Pressable, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Inter_100Thin, Inter_800ExtraBold, Inter_700Bold, Inter_900Black, Inter_500Medium } from '@expo-google-fonts/inter';
import { Quicksand_300Light, Quicksand_700Bold } from "@expo-google-fonts/quicksand";
import axios from "axios";

function ShowCameraFeed() {
  const [fontsLoaded] = useFonts({
    Inter_800ExtraBold,
    Inter_700Bold,
    Inter_900Black,
    Inter_100Thin,
    Inter_500Medium,
    Quicksand_300Light,
    Quicksand_700Bold,
  });

  const [imageData, setImageData] = useState('');
  const [loading, setLoading] = useState(false);

  const [showFeed, setShowFeed] = useState(false); 
  const [currentTime, setCurrentTime] = useState(new Date());

  const takePhoto = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://192.168.0.104:3000/takePhoto'); // ip address of local
      if (response.status === 200) {
        console.log('Photo taken successfully');
        setImageData(response.data.image);
      } else {
        console.error('Failed to take photo');
      }
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setLoading(false);
    }
  }; 

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer); 
  }, []);

  function pressUserHandler() {
    setShowFeed(prevState => !prevState); 
  }

  const formattedDate = currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cameraFeedPressable} onPress={takePhoto}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.ShowCameraFeedText}>Capture Photo</Text>
        )}
      </TouchableOpacity>
      {imageData ? (
        <View style={styles.cameraFeedContainer}>
          <Image source={{ uri: `data:image/jpeg;base64,${imageData}` }} style={styles.image} />
        </View>
      ) : (
        <View style={styles.squareContainer}></View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },

  cameraFeedPressable: {
    backgroundColor: '#15412D',
    borderRadius: 25,
    alignContent: 'center',
    width: '90%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ShowCameraFeedText: {
    fontFamily: 'Inter_500Medium',
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },

  image: {
    width: '90%',
    height: 200,
    borderRadius: 15,
    padding: 10,
  },

  cameraFeedContainer: {
    width: '90%',
    height: 200,
    borderRadius: 15,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, 
  },

  cameraFeedText: {
    fontFamily: 'Inter_700Bold',
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },

  cameraFeedImage: {
    marginTop: 15,
    width: '100%',
    height: 200,
    borderRadius: 0,
    resizeMode: 'contain', 
  },
});

export default ShowCameraFeed;
