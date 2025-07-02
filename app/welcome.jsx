import React, { useCallback } from 'react';
import {
  View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView,
  SafeAreaView, Platform, StatusBar, ActivityIndicator, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';


const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const [fontsLoaded] = useFonts({
    'BebasNeue': require('../assets/fonts/BebasNeue-Regular.ttf'),
    'Roboto': require('../assets/fonts/Roboto-Light.ttf'),
  });

  const navigation = useNavigation();

  useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      BackHandler.exitApp();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [])
);


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
        <View style={styles.card}>
          <View style={styles.title}>
            <Text style={styles.textT}>WELCOME TO THE DIGITAL</Text>
            <Text style={styles.textT}>TRANSFORMATION CENTER</Text>
            <Image
              source={require('../assets/images/app-assets/dict1.png')}
              style={styles.headerImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.body}>
            <Text style={styles.note}>
              Your visit has been successfully logged. Thank you for using our facility.
              We are glad to have you here today!
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('guide-one')}
            >
              <Text style={styles.buttonText}>PROCEED</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#027CFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 30,
    backgroundColor: '#027CFF',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: width * 1,
    height: width * 1,
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
    marginTop: 50,
  },
  body: {
    paddingHorizontal: width * 0.02,
    marginLeft: width * 0.02,
  },
  title: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textT: {
    fontSize: width * 0.1,
    fontFamily: 'BebasNeue',
    color: '#027CFF',
  },
  note: {
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'center',
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
});
