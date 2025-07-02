import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, Dimensions,
  TouchableOpacity, ScrollView, SafeAreaView,
  Platform, StatusBar, Modal, Pressable, BackHandler
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, push } from 'firebase/database';
import { database } from '../FirebaseConfig';

const { width, height } = Dimensions.get('window');

export default function Scanner() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [qrData, setQrData] = useState('');
  const [cameraKey, setCameraKey] = useState(0);


useEffect(() => {
  if (!permission) requestPermission();
}, [permission]);

useFocusEffect(
  React.useCallback(() => {
    setScanned(false);
    setCameraKey(prev => prev + 1); // Force re-render of CameraView
  }, [])
);


useFocusEffect(
  React.useCallback(() => {
    const onBackPress = () => {
      BackHandler.exitApp();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => subscription.remove();
  }, [])
);


  const handleQRCodeScanned = async (scanningResult) => {
    const result = scanningResult?.nativeEvent || scanningResult;
    const { type, data } = result || {};

    if (!scanned && type === 'qr' && typeof data === 'string') {
      setScanned(true);

      try {
        const parsed = JSON.parse(data);
        if (parsed && parsed.centerName && parsed.services) {
          const userDataJSON = await AsyncStorage.getItem('@userData');
          const userData = userDataJSON ? JSON.parse(userDataJSON) : null;

          if (!userData) {
            setModalMessage('No user data found');
          } else {
            const lastScanJSON = await AsyncStorage.getItem('@lastScan');
            const lastScan = lastScanJSON ? JSON.parse(lastScanJSON) : null;
            const now = new Date();

            if (
              lastScan &&
              lastScan.qr === data &&
              now - new Date(lastScan.timestamp) < 3 * 60 * 60 * 1000
            ) {
              setModalMessage('You have already scanned this QR');
            } else {
              const logEntry = {
                user: userData,
                scanResult: parsed,
                timestamp: now.toISOString(),
              };

              await push(ref(database, 'logs'), logEntry);

              await AsyncStorage.setItem(
                '@lastScan',
                JSON.stringify({ qr: data, timestamp: now.toISOString() })
              );

              setModalMessage('Scan Successful!');
            }
          }
        } else {
          setModalMessage('❌ Invalid QR Code');
        }
      } catch (error) {
        console.log('Scan error:', error);
        setModalMessage('❌ Invalid QR Code Format');
      }

      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setQrData('');
    setScanned(false);
  };

  if (!permission) return <Text>Requesting camera permission...</Text>;
  if (!permission.granted) return <Text>No access to camera</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image
            source={require('../assets/images/app-assets/dict1.png')}
            style={styles.headerImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.title}>
            <Text style={styles.textT}>DIGITAL TRANSFORMATION CENTER</Text>
            <Text style={styles.textB}>
              The DICT offers free Digital Transformation Centers for freelancers, students, remote workers, and startups.
              This app tracks daily usage to help us enhance our services and sustain the program.
            </Text>
          </View>

          <View style={styles.body}>
            <View style={styles.qr}>
              {!scanned && (
                <CameraView
                  key={cameraKey}
                  style={StyleSheet.absoluteFill}
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                  onBarcodeScanned={handleQRCodeScanned}
                />
              )}
            </View>

            <Text style={styles.note}>
              Note: Your information is securely stored only on your device and used only for attendance monitoring purposes.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('welcome')}
            >
              <Text style={styles.buttonText}>EDIT INFO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scan Result</Text>
            <Text style={styles.modalData}>{modalMessage}</Text>
            {qrData !== '' && <Text style={styles.modalData}>{qrData}</Text>}
            <Pressable style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#027CFF',
    paddingTop: height * 0.02,
    paddingBottom: height * 0.1,
    marginBottom: 20,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  headerImage: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderRadius: 16,
    width: width * 0.92,
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
    marginTop: -height * 0.13,
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },
  textT: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#027CFF',
  },
  textB: {
    fontSize: width * 0.035,
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  body: {
    paddingHorizontal: width * 0.02,
    marginLeft: width * 0.02,
  },
  qr: {
    width: width * 0.6,
    height: width * 0.6,
    borderWidth: 3,
    borderColor: '#027CFF',
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  note: {
    fontSize: width * 0.03,
    color: '#666',
    marginTop: 15,
    textAlign: 'left',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.05,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 4,
    minWidth: 250,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 12,
    color: '#027CFF',
  },
  modalData: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'left',
    fontStyle:'italic',
    color: '#222', 
  },
  closeButton: {
    marginTop: 12,
    alignItems: 'flex-end', 
  },
  closeButtonText: {
    fontSize: 16,
  },
});
