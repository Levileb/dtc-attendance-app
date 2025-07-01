import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, ActivityIndicator, Button } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from '../FirebaseConfig';
import { ref, get, child } from 'firebase/database';
import { Camera } from 'expo-camera';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [dots, setDots] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [checkingPermission, setCheckingPermission] = useState(true);
  const dotStates = ['', '.', '..', '...'];

  const requestPermission = useCallback(async () => {
    setCheckingPermission(true);
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(status === 'granted');
    setCheckingPermission(false);
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    if (hasCameraPermission === null || hasCameraPermission === false) return;

    const dotInterval = setInterval(() => {
      setDots(prev => {
        const nextIndex = (dotStates.indexOf(prev) + 1) % dotStates.length;
        return dotStates[nextIndex];
      });
    }, 400);

    const checkUserData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

        const stored = await AsyncStorage.getItem('@userData');
        if (!stored) {
          clearInterval(dotInterval);
          router.replace('/starter');
          return;
        }

        const localData = JSON.parse(stored);
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'user'));

        if (snapshot.exists()) {
          const users = snapshot.val();
          const matched = Object.values(users).find(user =>
            user.name === localData.name &&
            user.city === localData.city &&
            user.barangay === localData.barangay &&
            user.birthdate === localData.birthdate
          );

          clearInterval(dotInterval);

          if (matched) {
            router.replace('/qr-scanner');
          } else {
            setDeleting(true); // Show "Deleting user data..."
            await AsyncStorage.removeItem('@userData');
            setTimeout(() => {
              router.replace('/starter');
            }, 1500); // Delay so user sees message
          }
        } else {
          clearInterval(dotInterval);
          router.replace('/starter');
        }
      } catch (error) {
        console.error('Error during user check:', error);
        clearInterval(dotInterval);
        router.replace('/starter');
      }
    };

    checkUserData();

    return () => clearInterval(dotInterval); // Clean up interval
  }, [router, hasCameraPermission]);

  if (checkingPermission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#888" />
        <Text style={styles.checkingText}>Checking camera permission...</Text>
      </View>
    );
  }

  if (hasCameraPermission === false) {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/app-assets/dict1.png')}
          style={{ width: width * 0.5, height: width * 0.5, marginBottom: 20 }}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/app-assets/dtc1.png')}
          style={{ width: width * 0.5, height: width * 0.5 }}
          resizeMode="contain"
        />
        <Text style={styles.checkingText}>
          Camera permission is required to use this app.
        </Text>
        <Button title="Try Again" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/app-assets/dict1.png')}
        style={{ width: width * 0.5, height: width * 0.5, marginBottom: 20 }}
        resizeMode="contain"
      />
      <Image
        source={require('../assets/images/app-assets/dtc1.png')}
        style={{ width: width * 0.5, height: width * 0.5 }}
        resizeMode="contain"
      />
      <Text style={styles.checkingText}>
        {deleting ? 'Deleting user data' + dots : 'Checking user data' + dots}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  checkingText: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
  },
});
