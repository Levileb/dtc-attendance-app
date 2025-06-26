import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [duration, setDuration] = useState(5); 
  const [navigated, setNavigated] = useState(false);

  useEffect(() => {
    if (duration === 0 && !navigated) {
      setNavigated(true);
      router.replace('/starter');
      return;
    }
    if (!navigated) {
      const timer = setTimeout(() => setDuration(duration - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [duration, router, navigated]);

  const handlePress = () => {
    if (!navigated) {
      setNavigated(true);
      router.replace('/starter');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/app-assets/dict1.png')}
          style={{ width: width * 0.5, height: width * 0.5, marginBottom: 20 }}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/app-assets/dtc1.png')}
          style={{ width: width * 0.5, height: width * 0.5, marginBottom: 20 }}
          resizeMode="contain"
        />
      </View>
    </TouchableWithoutFeedback>
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
});
