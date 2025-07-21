import React, { useState } from 'react';
import {
  View, Text, Image, StyleSheet, Dimensions, TouchableOpacity,
  ScrollView, SafeAreaView, Platform, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { MaterialIcons, FontAwesome5} from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from '../FirebaseConfig';
import { ref, push, set } from 'firebase/database';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import CheckBox from 'expo-checkbox';
import TermsAndPrivacyModal from './TermsAndPrivacyModal';
const { width, height } = Dimensions.get('window');

export default function Register() {
  const [fontsLoaded] = useFonts({
    'BebasNeue': require('../assets/fonts/BebasNeue-Regular.ttf'),
    'Roboto': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto Italic': require('../assets/fonts/Roboto-LightItalic.ttf'),
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');
  const [sector, setSector] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');

  const sectorOptions = ['NGA', 'LGU', 'Student/SUC', 'PWDs', 'PDLs', 'Indigenous People',
                         'Senior Citizens', 'OSY', 'Farmers/Fisherfolks', 'MSME/Enrepreneurs', 'DICT', 'Others'];
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split('T')[0];
      setBirthdate(isoDate);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateContactNumber = (number) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(number.replace(/\s/g, ''));
  };

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType('');
  };

  const handleSave = async () => {
    if (!name || !city || !barangay || !sector || !gender || !birthdate || !contactNumber || !email) {
      Alert.alert("Missing Fields", "Please fill out all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!validateContactNumber(contactNumber)) {
      Alert.alert("Invalid Contact Number", "Please enter a valid 10-11 digit contact number.");
      return;
    }

    if (!agreeToTerms) {
      Alert.alert("Terms and Conditions", "Please agree to the terms and conditions to proceed.");
      return;
    }

    setLoading(true);

    try { 
      const userData = {
        name,
        city,
        barangay,
        sector,
        gender,
        birthdate,
        contactNumber,
        email,
        timestamp: new Date().toISOString(),
      };

      // Save to Firebase Realtime DB
      const usersRef = ref(database, 'user');
      const newUserRef = push(usersRef);
      await set(newUserRef, userData);

      // Save locally using AsyncStorage
      await AsyncStorage.setItem('@userData', JSON.stringify(userData));

      setLoading(false);
      Alert.alert("Success", "Registration successful!", [
        {
          text: "OK",
          onPress: () => router.replace('/qr-scanner')
        }
      ]);

      // Clear form
      setName('');
      setCity('');
      setBarangay('');
      setSector('');
      setGender('');
      setBirthdate('');
      setContactNumber('');
      setEmail('');
      setAgreeToTerms(false);
    } catch (error) {
      console.error("Save Error:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to save user data. Please try again.");
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

            {/* Text Input Fields */}
            {[
              { placeholder: 'Full Name *', icon: <MaterialIcons name="person" size={22} color="#888" />, value: name, setter: setName },
              { placeholder: 'City/Municipality *', icon: <FontAwesome5 name="city" size={20} color="#888" />, value: city, setter: setCity },
              { placeholder: 'Barangay *', icon: <MaterialIcons name="location-on" size={22} color="#888" />, value: barangay, setter: setBarangay },
              { placeholder: 'Contact Number *', icon: <MaterialIcons name="phone" size={22} color="#888" />, value: contactNumber, setter: setContactNumber, keyboardType: 'phone-pad' },
              { placeholder: 'Email Address *', icon: <MaterialIcons name="email" size={22} color="#888" />, value: email, setter: setEmail, keyboardType: 'email-address' }
            ].map((input, index) => (
              <View style={styles.inputContainer} key={index}>
                {input.icon}
                <TextInput
                  style={styles.input}
                  placeholder={input.placeholder}
                  value={input.value}
                  onChangeText={input.setter}
                  placeholderTextColor="#888"
                  keyboardType={input.keyboardType || 'default'}
                  autoCapitalize={input.keyboardType === 'email-address' ? 'none' : 'words'}
                />
              </View>
            ))}

            {/* Sector Picker */}
            <View style={styles.pickerContainer}>
              <View style={[styles.inputContainer, { paddingHorizontal: 10 }]}>
                <MaterialIcons name="work" size={22} color="#888" />
                <View style={[styles.pickerWrapper, { flex: 1 }]}>
                  <Picker selectedValue={sector} onValueChange={setSector}>
                    {sector === '' && <Picker.Item label="Sector *" value="" color="#888" enabled={true} />}
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
                    {gender === '' && <Picker.Item label="Gender *" value="" color="#888" enabled={true} />}
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
                placeholder="Birthdate *"
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
                maximumDate={new Date()}
              />
            )}

            {/* Terms and Conditions Checkbox with Clickable Links */}
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={agreeToTerms}
                onValueChange={setAgreeToTerms}
                style={styles.checkbox}
                color={agreeToTerms ? '#027CFF' : undefined}
              />
              <View style={styles.checkboxTextContainer}>
                <Text style={styles.checkboxText}>I agree to the </Text>
                <TouchableOpacity onPress={() => openModal('terms')}>
                  <Text style={styles.linkText}>Terms and Conditions</Text>
                </TouchableOpacity>
                <Text style={styles.checkboxText}> and </Text>
                <TouchableOpacity onPress={() => openModal('privacy')}>
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.note}>
              Note: Your information is securely stored and used only for attendance monitoring purposes. Fields marked with * are required.
            </Text>

           <TouchableOpacity
                style={[styles.button, (loading || !agreeToTerms) && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={loading || !agreeToTerms}
                >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>REGISTER</Text>
                )}
                </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Terms and Privacy Modal */}
      <TermsAndPrivacyModal 
        visible={modalVisible} 
        onClose={closeModal} 
        type={modalType}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ...existing styles...
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#027CFF',
    paddingTop: height * 0.05,
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
    marginTop: -height * 0.15,
  },
  title: {
    alignItems: 'center',
    marginBottom: 10,
  },
  textT: {
    fontSize: width * 0.075,
    color: '#027CFF',
    fontFamily: 'BebasNeue',
    textAlign: 'center',
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 15,
    paddingHorizontal: 5,
  },
  checkbox: {
    marginRight: 10,
    marginTop: 2,
  },
  checkboxTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: width * 0.035,
    color: '#333',
    fontFamily: 'Roboto',
  },
  linkText: {
    color: '#027CFF',
    textDecorationLine: 'underline',
    fontSize: width * 0.035,
    fontFamily: 'Roboto',
    fontWeight: '600',
  },
  note: {
    fontSize: width * 0.03,
    color: '#666',
    marginTop: 15,
    fontFamily: 'Roboto Italic',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    borderRadius: 24,
    paddingVertical: 12,
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
    fontWeight: 'bold',
  },
  body: {
    marginTop: 10,
  },
});