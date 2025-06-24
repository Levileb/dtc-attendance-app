import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [duration, setDuration] = useState(5); 

  useEffect(() => {
    if (duration === 0) {
      router.replace('/starter');
      return;
    }
    const timer = setTimeout(() => setDuration(duration - 1), 1000);
    return () => clearTimeout(timer);
  }, [duration, router]);

  return (
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
