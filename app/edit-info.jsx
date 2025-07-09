import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, StyleSheet, Dimensions, TouchableOpacity,
    ScrollView, SafeAreaView, Platform, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from '../FirebaseConfig';
import { ref, get, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function EditInfo() {
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
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [userKey, setUserKey] = useState(null);

    const sectorOptions = ['NGA', 'LGU', 'Student/SUC', 'PWDs', 'PDLs', 'Indigenous People',
                         'Senior Citizens', 'OSY', 'Farmers/Fisherfolks', 'MSME/Enrepreneurs', 'DICT', 'Others'];
    const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

    // Load user data from AsyncStorage and Firebase
    useEffect(() => {
        const fetchData = async () => {
            try {
            const localUserData = await AsyncStorage.getItem('@userData');
            if (!localUserData) return;

            const localData = JSON.parse(localUserData);

            // Search for user in Firebase by matching all fields (except timestamp)
            const usersRef = ref(database, 'user');
            const snapshot = await get(usersRef);

            if (snapshot.exists()) {
                const users = snapshot.val();
                let foundKey = null;
                let dbData = null;

                for (const [key, value] of Object.entries(users)) {
                if (
                    value.name === localData.name &&
                    value.city === localData.city &&
                    value.barangay === localData.barangay &&
                    value.sector === localData.sector &&
                    value.gender === localData.gender &&
                    value.birthdate === localData.birthdate
                ) {
                    foundKey = key;
                    dbData = value;
                    break;
                }
                }

                if (foundKey && dbData) {
                setUserKey(foundKey);
                setName(dbData.name);
                setCity(dbData.city);
                setBarangay(dbData.barangay);
                setSector(dbData.sector);
                setGender(dbData.gender);
                setBirthdate(dbData.birthdate);
                setContactNumber(dbData.contactNumber || '');
                setEmail(dbData.email || '');
                setProfileImageUrl(dbData.profileImageUrl || '');
                } else {
                Alert.alert('Not Found', 'User data not found in database.');
                }
            } else {
                Alert.alert('Not Found', 'No users found in database.');
            }
            } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load user data.');
            }
        };
        fetchData();
    }, []);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const isoDate = selectedDate.toISOString().split('T')[0];
            setBirthdate(isoDate);
        }
    };

    const pickImage = async () => {
        try {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission denied', 'Camera roll permission is required to select an image.');
            return;
          }
    
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // 1x1 format
            quality: 0.8,
          });
    
          if (!result.canceled && result.assets[0]) {
            setLoading(true);
            
            // Resize image to reduce file size
            const manipulatedImage = await ImageManipulator.manipulateAsync(
              result.assets[0].uri,
              [{ resize: { width: 300, height: 300 } }], // Reduce to 300x300
              { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );
    
            setProfileImage(manipulatedImage.uri);
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          console.error('Error picking image:', error);
          Alert.alert('Error', 'Failed to pick image.');
        }
      };
    
      const uploadImageToFirebase = async (imageUri) => {
        try {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          
          const storage = getStorage();
          const imageRef = storageRef(storage, `profile_images/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`);
          
          await uploadBytes(imageRef, blob);
          const downloadURL = await getDownloadURL(imageRef);
          
          return downloadURL;
        } catch (error) {
          console.error('Error uploading image:', error);
          throw error;
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

        if (!userKey) {
            Alert.alert("Error", "User key not found.");
            return;
        }

        setLoading(true);

        try {
            let imageUrl = profileImageUrl; // Keep existing URL if no new image
            
            // Upload new image if selected
            if (profileImage) {
              imageUrl = await uploadImageToFirebase(profileImage);
            }

            const userData = {
                name,
                city,
                barangay,
                sector,
                gender,
                birthdate,
                contactNumber,
                email,
                profileImageUrl: imageUrl,
                timestamp: new Date().toISOString(),
            };

            // Update Firebase
            const userRef = ref(database, `user/${userKey}`);
            await update(userRef, userData);

            // Update AsyncStorage
            await AsyncStorage.setItem('@userData', JSON.stringify(userData));

            setLoading(false);
            Alert.alert("Success", "User data updated successfully!", [
                {
                  text: "OK",
                  onPress: () => router.back()
                }
              ]);
        } catch (error) {
            console.error("Save Error:", error);
            setLoading(false);
            Alert.alert("Error", "Failed to update user data.");
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
                        <Text style={styles.textT}>EDIT YOUR INFORMATION</Text>
                        <Text style={styles.textB}>
                            Update your details below. Your information is securely stored.
                        </Text>
                    </View>

                    <View style={styles.body}>
                        {/* Profile Image Upload */}
                        <View style={styles.imageUploadContainer}>
                            <Text style={styles.imageLabel}>Profile Photo (1x1 format)</Text>
                            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                                {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.profileImagePreview} />
                                ) : profileImageUrl ? (
                                <Image source={{ uri: profileImageUrl }} style={styles.profileImagePreview} />
                                ) : (
                                <View style={styles.imagePlaceholder}>
                                    <Ionicons name="camera" size={40} color="#888" />
                                    <Text style={styles.imagePlaceholderText}>Tap to select photo</Text>
                                </View>
                                )}
                            </TouchableOpacity>
                        </View>

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
                                    <Picker
                                        selectedValue={sector}
                                        onValueChange={setSector}
                                        style={{ fontFamily: 'Roboto', color: '#000' }}
                                        itemStyle={{ fontFamily: 'Roboto', color: '#000' }}
                                    >
                                        {sector === '' && <Picker.Item label="Sector *" value="" color="#888" enabled={false} style={{ fontFamily: 'Roboto' }} />}
                                        {sectorOptions.map(opt => (
                                            <Picker.Item key={opt} label={opt} value={opt} style={{ fontFamily: 'Roboto' }} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </View>

                        <View style={styles.pickerContainer}>
                            <View style={[styles.inputContainer, { paddingHorizontal: 10 }]}>
                                <MaterialIcons name="wc" size={22} color="#888" />
                                <View style={[styles.pickerWrapper, { flex: 1 }]}>
                                    <Picker
                                        selectedValue={gender}
                                        onValueChange={setGender}
                                        style={{ fontFamily: 'Roboto', color: '#000' }}
                                        itemStyle={{ fontFamily: 'Roboto', color: '#000' }}
                                    >
                                        {gender === '' && <Picker.Item label="Gender *" value="" color="#888" enabled={false} style={{ fontFamily: 'Roboto' }} />}
                                        {genderOptions.map(opt => (
                                            <Picker.Item key={opt} label={opt} value={opt} style={{ fontFamily: 'Roboto' }} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </View>
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

                        <Text style={styles.note}>
                            Note: Your information is securely stored and used only for attendance monitoring purposes. Fields marked with * are required.
                        </Text>

                        <TouchableOpacity
                            style={[styles.button, loading && { opacity: 0.7 }]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>SAVE CHANGES</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
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
    marginTop: -height * 0.15,
  },
  title: {
    alignItems: 'center',
    marginBottom: 15,
  },
  textT: {
    fontSize: width * 0.09,
    fontFamily: 'BebasNeue',
    color: '#027CFF',
    textAlign: 'center',
  },
  textB: {
    fontSize: width * 0.035,
    fontFamily: 'Roboto',
    color: '#000',
    textAlign: 'center',
    marginTop: 5,
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  imageLabel: {
    fontSize: width * 0.04,
    fontFamily: 'Roboto',
    color: '#333',
    marginBottom: 10,
  },
  imagePickerButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#027CFF',
    borderStyle: 'dashed',
  },
  profileImagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 58,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 6,
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
    textAlign: 'center',
    fontFamily: 'Roboto Italic',
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