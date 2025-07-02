import React, { useState } from 'react';
import {
  View, Text, Image, StyleSheet, Dimensions, TouchableOpacity,
  ScrollView, SafeAreaView, Platform, StatusBar, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from '../FirebaseConfig';
import { ref, push, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function Register() {
  const [fontsLoaded] = useFonts({
    'BebasNeue': require('../assets/fonts/BebasNeue-Regular.ttf'),
    'Roboto': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto Italic': require('../assets/fonts/Roboto-LightItalic.ttf'),
  });

  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);


  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');
  const [sector, setSector] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const sectorOptions = ['Student', 'Teacher', 'Government Employee', 'Private Employee', 'Entrepreneur', 'Unemployed', 'Others'];
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split('T')[0];
      setBirthdate(isoDate);
    }
  };

  const handleSave = async () => {
    if (!name || !city || !barangay || !sector || !gender || !birthdate) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    setLoading(true);

    const userData = {
      name,
      city,
      barangay,
      sector,
      gender,
      birthdate,
      timestamp: new Date().toISOString(),
    };

    try {
      // Save to Firebase Realtime DB
      const usersRef = ref(database, 'user');
      const newUserRef = push(usersRef);
      await set(newUserRef, userData);

      // Save locally using AsyncStorage
      await AsyncStorage.setItem('@userData', JSON.stringify(userData));

      setLoading(false);
      navigation.navigate('qr-scanner');

      Alert.alert("Success", "User data saved successfully!");
      setName('');
      setCity('');
      setBarangay('');
      setSector('');
      setGender('');
      setBirthdate('');
    } catch (error) {
      console.error("Save Error:", error);
      Alert.alert("Error", "Failed to save user data.");
    }
  };

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
          <Image source={require('../assets/images/app-assets/dict1.png')} style={styles.headerImage} resizeMode="contain" />
        </View>

        <View style={styles.card}>
          <View style={styles.title}>
            <Text style={styles.textT}>DIGITAL TRANSFORMATION CENTER</Text>
            <Text style={styles.textB}>
              This tool is developed by the DICT to monitor daily usage of its Digital Transformation Centers...
            </Text>
          </View>

          <View style={styles.body}>
            {[
              { placeholder: 'Name', icon: <MaterialIcons name="person" size={22} color="#888" />, value: name, setter: setName },
              { placeholder: 'City/Municipality', icon: <FontAwesome5 name="city" size={20} color="#888" />, value: city, setter: setCity },
              { placeholder: 'Barangay', icon: <MaterialIcons name="location-on" size={22} color="#888" />, value: barangay, setter: setBarangay }
            ].map((input, index) => (
              <View style={styles.inputContainer} key={index}>
                {input.icon}
                <TextInput
                  style={styles.input}
                  placeholder={input.placeholder}
                  value={input.value}
                  onChangeText={input.setter}
                  placeholderTextColor="#888"
                />
              </View>
            ))}

            {/* Sector Picker */}
            <View style={styles.pickerContainer}>
              <View style={[styles.inputContainer, { paddingHorizontal: 10 }]}>
                <MaterialIcons name="work" size={22} color="#888" />
                <View style={[styles.pickerWrapper, { flex: 1 }]}>
                  <Picker selectedValue={sector} onValueChange={setSector}>
                    {sector === '' && <Picker.Item label="Sector" value="" color="#888" enabled={true} />}
                    {sectorOptions.map(opt => (
                      <Picker.Item key={opt} label={opt} value={opt} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Gender Picker */}
            <View style={styles.pickerContainer}>
              <View style={[styles.inputContainer, { paddingHorizontal: 10 }]}>
                <MaterialIcons name="wc" size={22} color="#888" />
                <View style={[styles.pickerWrapper, { flex: 1 }]}>
                  <Picker selectedValue={gender} onValueChange={setGender}>
                    {gender === '' && <Picker.Item label="Gender" value="" color="#888" enabled={true} />}
                    {genderOptions.map(opt => (
                      <Picker.Item key={opt} label={opt} value={opt} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Birthdate Picker */}
            <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
              <MaterialIcons name="calendar-today" size={22} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="Birthdate"
                placeholderTextColor="#888"
                value={birthdate}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthdate ? new Date(birthdate) : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <Text style={styles.note}>
              Note: Your information is securely stored only on your device and used only for attendance monitoring purposes.
            </Text>

           <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={loading}
                >
                {loading ? (
                    <Text style={styles.buttonText}>Saving...</Text>
                ) : (
                    <Text style={styles.buttonText}>SAVE</Text>
                )}
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
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
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
    alignItems: 'center',
    marginBottom: 15,
  },
  textT: {
    fontSize: width * 0.075,
    color: '#027CFF',
    fontFamily: 'BebasNeue',
  },
  textB: {
    fontSize: width * 0.035,
    color: '#000',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Roboto',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 6,
    fontFamily: 'Roboto',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: width * 0.04,
    color: '#000',
    fontFamily: 'Roboto',
  },
  pickerContainer: {
    marginTop: 3,
  },
  pickerWrapper: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 5,
  },
  note: {
    fontSize: width * 0.03,
    color: '#666',
    marginTop: 15,
    fontFamily: 'Roboto Italic',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 45,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.049,
    fontFamily: 'Roboto',
  },
  body: {
    marginTop: 10,
  },
});
