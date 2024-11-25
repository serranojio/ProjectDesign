import { StyleSheet, Text, Image, View, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState } from 'react';
import axios from "axios";

function ShowCameraFeed({ onInferenceResults }) {
  // State to hold the base64 image data
  const [imageData, setImageData] = useState('');

  // State to indicate loading state during API call
  const [loading, setLoading] = useState(false);

  // State to hold the inference data (predictions, classes, and confidence)
  const [inferenceData, setInferenceData] = useState(null);

  // State to hold the displayed image's dimensions
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Function to trigger the photo-taking process via API
  const takePhoto = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://192.168.0.104:3000/takePhoto'); // Replace with your API endpoint
      if (response.status === 200) {
        setImageData(response.data.image); // Base64 image data
        setInferenceData(response.data.inferenceResults); // Inference results
        onInferenceResults(response.data.inferenceResults); // Pass results to parent component
      } else {
        console.error('Failed to take photo');
      }
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to scale coordinates to match displayed image size
  const scaleCoordinates = (prediction, containerWidth, containerHeight, originalWidth, originalHeight) => {
    const scaleX = containerWidth / originalWidth; // Scale factor for width
    const scaleY = containerHeight / originalHeight; // Scale factor for height

    return {
      x: prediction.x * scaleX - (prediction.width * scaleX) / 2, // Adjusted x
      y: prediction.y * scaleY - (prediction.height * scaleY) / 2, // Adjusted y
      width: prediction.width * scaleX, // Adjusted width
      height: prediction.height * scaleY, // Adjusted height
    };
  };

  // Function to capture the layout dimensions of the image container
  const onImageLayout = (event) => {
    const { width, height } = event.nativeEvent.layout; // Get layout width and height
    setImageSize({ width, height }); // Update state with dimensions
  };

  // Function to get styles for each prediction class
  const getClassStyles = (predictionClass) => {
    switch (predictionClass) {
      case 'Ready':
        return {
          borderColor: '#48D38A', // Green
          backgroundColor: '#48D38A',
        };
      case 'Not Ready':
        return {
          borderColor: '#FFD700', // Yellow
          backgroundColor: '#FFD700',
        };
      case 'Overdue':
        return {
          borderColor: '#FF0000', // Red
          backgroundColor: '#FF0000',
        };
      default:
        return {
          borderColor: '#000000', // Black for unknown classes
          backgroundColor: '#000000',
        };
    }
  };

  return (
    <View style={styles.container}>
      {/* Button to trigger photo capture */}
      <TouchableOpacity style={styles.cameraFeedPressable} onPress={takePhoto}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.ShowCameraFeedText}>Scan</Text>
        )}
      </TouchableOpacity>

      {/* Display the image and predictions */}
      {imageData ? (
        <View style={styles.cameraFeedContainer}>
          <View style={styles.imageWrapper}>
            {/* Display the captured image */}
            <Image
              source={{ uri: `data:image/jpeg;base64,${imageData}` }}
              style={styles.image}
              onLayout={onImageLayout} // Capture layout dimensions
            />

            {/* Overlay predictions */}
            {inferenceData && inferenceData.predictions && inferenceData.predictions.map((prediction, index) => {
              // Scale the bounding box coordinates to match the displayed image size
              const scaled = scaleCoordinates(
                prediction,
                imageSize.width,
                imageSize.height,
                inferenceData.image.width,
                inferenceData.image.height
              );

              // Get styles for the current class
              const stylesForClass = getClassStyles(prediction.class);

              return (
                <View
                  key={prediction.detection_id}
                  style={[
                    styles.predictionBox,
                    {
                      left: scaled.x, // Position x
                      top: scaled.y, // Position y
                      width: scaled.width, // Scaled width
                      height: scaled.height, // Scaled height
                      borderColor: stylesForClass.borderColor, // Dynamic border color
                    },
                  ]}
                >
                  {/* Display label for prediction */}
                  <View style={[
                    styles.predictionLabel,
                    { backgroundColor: stylesForClass.backgroundColor }
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
        <View style={styles.squareContainer}></View> // Placeholder if no image is captured
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
    width: '90%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ShowCameraFeedText: {
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
    overflow: 'hidden',
  },

  predictionBox: {
    position: 'absolute',
    borderWidth: 2,
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