import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, StyleSheet, Dimensions,
  TouchableOpacity, ScrollView, SafeAreaView,
  Platform, Modal, Pressable, BackHandler,
  ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {query, orderByChild, limitToLast, get, ref, push  } from 'firebase/database';
import { database } from '../FirebaseConfig';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function Scanner() {

  const [fontsLoaded] = useFonts({
      'BebasNeue': require('../assets/fonts/BebasNeue-Regular.ttf'),
      'Roboto': require('../assets/fonts/Roboto-Light.ttf'),
      'Roboto Italic': require('../assets/fonts/Roboto-LightItalic.ttf'),
    });

  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [qrData, setQrData] = useState('');
  const [cameraKey, setCameraKey] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const timeoutRef = useRef(null);
  const navigationRef = useRef(false);
  const isloggedin = true;

useEffect(() => {
  if (!permission) requestPermission();
}, [permission]);

useFocusEffect(
  React.useCallback(() => {
    // Reset all scanner states when screen gains focus
    setScanned(false);
    setModalVisible(false);
    setModalMessage('');
    setQrData('');
    setIsProcessing(false);
    setCameraKey(prev => prev + 1);
    navigationRef.current = false;
    
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [])
);

// Cleanup timeout when component unmounts
useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);

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

  // Prevent multiple scans and navigation
  if (isProcessing || scanned || navigationRef.current || !type || type !== 'qr' || typeof data !== 'string') {
    return;
  }

  setIsProcessing(true);
  setScanned(true);

  try {
    const parsed = JSON.parse(data);
    if (parsed && parsed.centerName && parsed.services) {
      const userDataJSON = await AsyncStorage.getItem('@userData');
      const userData = userDataJSON ? JSON.parse(userDataJSON) : null;

      if (!userData) {
        setModalMessage('No user data found');
        setModalVisible(true);
        setIsProcessing(false);
        return;
      }

      const now = new Date();

      // Fetch the latest 10 logs from Firebase
      const logsRef = query(ref(database, 'logs'), orderByChild('timestamp'), limitToLast(10));
      const snapshot = await get(logsRef);
      const logs = snapshot.exists() ? Object.values(snapshot.val()) : [];

      const alreadyScanned = logs.some((log) => {
        const isSameUser =
          log.user?.name === userData.name &&
          log.user?.barangay === userData.barangay &&
          log.user?.city === userData.city &&
          log.user?.birthdate === userData.birthdate;

        const isSameQR = JSON.stringify(log.scanResult) === JSON.stringify(parsed);

        const isWithin3Hours =
          now - new Date(log.timestamp) < 3 * 60 * 60 * 1000;

        return isSameUser && isSameQR && isWithin3Hours;
      });

      if (alreadyScanned) {
        setModalMessage('You have already scanned \n the QR code.');
        setModalVisible(true);
        setIsProcessing(false);
        return;
      }

      // Save scan result
      const logEntry = {
        user: userData,
        scanResult: parsed,
        login: isloggedin,
        timestamp: now.toISOString(),
      };

      await push(ref(database, 'logs'), logEntry);

      setModalMessage('Scan Successful!');
      setModalVisible(true);

      // Prevent multiple navigation attempts
      navigationRef.current = true;

      // Use ref to track timeout
      timeoutRef.current = setTimeout(() => {
        setModalVisible(false);
        setIsProcessing(false);
        router.push('/welcome');
      }, 1200);
      
    } else {
      setModalMessage('Invalid QR Code');
      setModalVisible(true);
      setIsProcessing(false);
    }
  } catch (error) {
    console.log('Scan error:', error);
    setModalMessage('Invalid QR Code Format');
    setModalVisible(true);
    setIsProcessing(false);
  }
};  

const handleCloseModal = () => {
  setModalVisible(false);
  setQrData('');
  setScanned(false);
  setIsProcessing(false);
  
  // Clear timeout if modal is closed manually
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
};

  if (!permission) return <Text>Requesting camera permission...</Text>;
  if (!permission.granted) return <Text>No access to camera</Text>;

if (!fontsLoaded) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#027CFF" />
      <Text style={{ fontFamily: Platform.OS === 'android' ? 'sans-serif' : 'System' }}>
        Loading fonts...
      </Text>
    </View>
  );
}

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
              {!scanned && !isProcessing && (
                <CameraView
                  key={cameraKey}
                  style={StyleSheet.absoluteFill}
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                  onBarcodeScanned={handleQRCodeScanned}
                />
              )}
              {isProcessing && (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="large" color="#027CFF" />
                  <Text style={styles.processingText}>Processing...</Text>
                </View>
              )}
            </View>
             <Text style={styles.scanText}>SCAN QR CODE</Text>
            <Text style={styles.note}>
              Note: Your information is securely stored only on your device and used only for attendance monitoring purposes.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/edit-info')}
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // safeArea: {
  //   flex: 1,
  //   backgroundColor: '#027CFF',
  //   paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  // },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 30,
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
    fontSize: width * 0.078,
    color: '#027CFF',
    fontFamily: 'BebasNeue',
    textAlign: 'center',
  },
  textB: {
    fontSize: width * 0.035,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Roboto',
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
  scanText: {
    fontSize: width * 0.06,
    color: '#027CFF',
    fontFamily: 'BebasNeue',
    textAlign: 'center',
    marginBottom: 10,
  },
  processingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  processingText: {
    color: '#fff',
    marginTop: 10,
    fontFamily: 'Roboto',
  },
  note: {
    fontSize: width * 0.03,
    color: '#666',
    marginTop: 15,
    textAlign: 'left',
    fontFamily: 'Roboto',
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
    fontFamily: 'Roboto',
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
    fontSize: 29,
    fontFamily: 'BebasNeue',
    textAlign: 'left',
    marginBottom: 12,
    color: '#027CFF',
  },
  modalData: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'left',
    fontFamily: 'Roboto Italic',
    color: '#666', 
  },
  closeButton: {
    marginTop: 12,
    alignItems: 'flex-end', 
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#999',
  },
});
