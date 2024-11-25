import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View, Pressable, ImageBackground, FlatList, Modal } from "react-native";
import { Inter_800ExtraBold, Inter_500Medium } from '@expo-google-fonts/inter';

function Summary({ inferenceResults }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMushroom, setSelectedMushroom] = useState(null);
  const [showMushroomList, setShowMushroomList] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    Ready: 0,
    "Not Ready": 0,
    Overdue: 0
  });
  const [totalMushrooms, setTotalMushrooms] = useState(0);

  useEffect(() => {
    if (inferenceResults) {
      console.log('Received inference results:', inferenceResults);
      console.log('Received Points: ', inferenceResults.points);
      const counts = {
        Ready: 0,
        "Not Ready": 0,
        Overdue: 0
      };

      if (inferenceResults.predictions && Array.isArray(inferenceResults.predictions)) {
        inferenceResults.predictions.forEach(prediction => {
          if(prediction.class === "Ready") {
            counts.Ready += 1;
          } else if (prediction.class === "Not-Ready") {
            counts['Not Ready'] += 1;
          } else if (prediction.class === "Overdue") {
            counts.Overdue += 1;
          }
        });

        setTotalMushrooms(inferenceResults.predictions.length);
      } else {
        setTotalMushrooms(0);
      }

      setStatusCounts(counts);
    }
  }, [inferenceResults]);

  const [fontsLoaded] = useFonts({
    Inter_800ExtraBold,
    Inter_500Medium,
  });

  function openModal(mushroom) {
    setSelectedMushroom(mushroom);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }
  
  function toggleMushroomList() {
    setShowMushroomList(prevState => !prevState);
  }

  function collapseMushroomList() {
    setShowMushroomList(false);
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/Asset 2.png')}
        resizeMode='cover'
        style={styles.summaryBox}>
        <View style={styles.summaryContainer}>
            <Pressable onPress={toggleMushroomList} style={[styles.detectedMushroomsContainer, styles.collapsed]}>
              <Text style={styles.detectedMushroomsCount}>{totalMushrooms}</Text>
              <Text style={styles.detectedMushroomsLabel}>Captured</Text>
              <Text style={styles.detectedMushroomsLabel}>Mushrooms</Text>
            </Pressable>

          <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <View style={styles.summaryItem}>
                <Text style={[styles.circle, styles.readyCircle]}>{statusCounts.Ready}</Text>
                <Text style={styles.summaryText}>Ready to Harvest</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.circle, styles.notReadyCircle]}>{statusCounts['Not Ready']}</Text>
                <Text style={styles.summaryText}>Not Ready</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.circle, styles.overdueCircle]}>{statusCounts.Overdue}</Text>
                <Text style={styles.summaryText}>Overdue</Text>
              </View>
            </View>
        </View>
      </ ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  summaryBox: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  
  summaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: '65%',
    width: '90%',
    borderRadius: 15,
    marginBottom: 13,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    padding: 23,
    flexDirection: 'row',
  },

  detectedMushroomsContainer: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  collapsed: {
    width: '40%',
    alignItems: 'center',
    padding: 10,
  },

  detectedMushroomsCount: {
    fontSize: 72,
    fontFamily: 'Inter_800ExtraBold',
    color: 'white',
  },

  detectedMushroomsLabel: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Inter_500Medium',
  },

  summaryTextContainer: {
    flex: 2,
    padding: 10,
    paddingLeft: 15,
  },

  summaryTitle: {
    fontSize: 24,
    color: '#C8E5D1',
    fontFamily: 'Inter_700Bold',
    marginBottom: 5,
    textAlign: 'center',
  },

  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  circle: {
    width: 30,
    height: 30,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    marginRight: 10,
    paddingVertical: 5,
  },

  readyCircle: {
    backgroundColor: '#48D38A',
  },

  notReadyCircle: {
    backgroundColor: '#FFCC00',
  },

  overdueCircle: {
    backgroundColor: '#FF5757',
  },

  summaryText: {
    fontSize: 18,
    color: '#C8E5D1',
  },

  mushroomItem: {
    marginBottom: 10,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  mushroomText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Inter_500Medium',
  },

  mushroomStatus: {
    fontSize: 12,
    color: '#C8E5D1',
    marginLeft: 8,
    alignSelf: 'center',  
  },

  scrollableList: {
    maxHeight: 250,
    width: '97%',
  },

  collapseButton: {
    marginTop: 5,
    backgroundColor: '#C8E5D1',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },

  collapseButtonText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Inter_500Medium',
  },

  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },

  modalImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter_800ExtraBold',
    color: '#000',
    marginBottom: 5,
  },

  modalStatus: {
    fontSize: 18,
    fontFamily: 'Inter_500Medium',
    color: '#555',
    marginBottom: 15,
  },

  closeButton: {
    backgroundColor: '#C8E5D1',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },

  closeButtonText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Inter_500Medium',
  },
});

export default Summary;
