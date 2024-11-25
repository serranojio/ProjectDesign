import { StyleSheet, Text, Image, View, Pressable, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Inter_500Medium } from '@expo-google-fonts/inter';
import axios from "axios";

function ShowCameraFeed({ onInferenceResults }) {
  const [imageData, setImageData] = useState('');
  const [loading, setLoading] = useState(false);
  const [inferenceData, setInferenceData] = useState(null);
  const [showFeed, setShowFeed] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const takePhoto = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://192.168.0.104:3000/takePhoto');
      if (response.status === 200) {
        setImageData(response.data.image);
        setInferenceData(response.data.inferenceResults);
        onInferenceResults(response.data.inferenceResults);
      } else {
        console.error('Failed to take photo');
      }
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate scaled coordinates
  const scaleCoordinates = (prediction, containerWidth, containerHeight, originalWidth, originalHeight) => {
    const scaleX = containerWidth / originalWidth;
    const scaleY = containerHeight / originalHeight;

    return {
      x: prediction.x * scaleX - (prediction.width * scaleX) / 2,
      y: prediction.y * scaleY - (prediction.height * scaleY) / 2,
      width: prediction.width * scaleX,
      height: prediction.height * scaleY,
    };
  };

  const onImageLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setImageSize({ width, height });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cameraFeedPressable} onPress={takePhoto}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.ShowCameraFeedText}>Scan</Text>
        )}
      </TouchableOpacity>
      
      {imageData ? (
        <View style={styles.cameraFeedContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${imageData}` }}
              style={styles.image}
              onLayout={onImageLayout}
            />
            
            {/* Prediction Overlays */}
            {inferenceData && inferenceData.predictions && inferenceData.predictions.map((prediction, index) => {
              const scaled = scaleCoordinates(
                prediction,
                imageSize.width,
                imageSize.height,
                inferenceData.image.width,
                inferenceData.image.height
              );

              return (
                <View
                  key={prediction.detection_id}
                  style={[
                    styles.predictionBox,
                    {
                      left: scaled.x,
                      top: scaled.y,
                      width: scaled.width,
                      height: scaled.height,
                      borderColor: prediction.class === 'Ready' ? '#48D38A' : '#FFCC00',
                    },
                  ]}
                >
                  <View style={[
                    styles.predictionLabel,
                    {
                      backgroundColor: prediction.class === 'Ready' ? '#48D38A' : '#FFCC00',
                    }
                  ]}>
                    <Text style={styles.predictionText}>
                      {`${prediction.class} ${(prediction.confidence * 100).toFixed(0)}%`}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
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

  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },

  cameraFeedContainer: {
    width: '90%',
    height: 200,
    borderRadius: 15,
    marginTop: 10,
    overflow: 'hidden', // This ensures boxes don't extend outside the container
  },

  predictionBox: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'solid',
  },

  predictionLabel: {
    position: 'absolute',
    top: -25,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },

  predictionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  squareContainer: {
    width: '90%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    marginTop: 10,
  },
});

export default ShowCameraFeed;