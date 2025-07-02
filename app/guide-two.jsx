import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions,
         TouchableOpacity, ScrollView, SafeAreaView, 
         Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function GuideTwo() {
    
    const [fontsLoaded] = useFonts({
        'BebasNeue': require('../assets/fonts/BebasNeue-Regular.ttf'),
        'Roboto': require('../assets/fonts/Roboto-Light.ttf'),
      });
    const navigation = useNavigation();

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
                        <Text style={styles.textT}>GENERAL USER GUIDELINES AND POLICIES</Text>
                    </View>
                    <View style={styles.body}>
                         <Image
                        source={require('../assets/images/app-assets/rule2.png')}
                        style={styles.rules}
                        resizeMode="contain"
                         />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('qr-scanner')}
                        >
                            <Text style={styles.buttonText}>THANK YOU</Text>
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
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
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
        width: width * 0.5,
        height: width * 0.5,
        marginBottom: 10,
    },
     rules: {
        width: width * 1.05,
        height: width * 1.05,
        marginBottom: 10,
        alignSelf: 'center',
        marginVertical: 20,
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
    body: {
        paddingHorizontal: width * 0.02,
        marginLeft: width * 0.02,
    },
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 7,
    },
    textB: {
        fontSize: width * 0.035,
        color: '#000',
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    textsB: {
        fontSize: width * 0.035,
        color: '#000',
        textAlign: 'left',
        marginLeft: 10,
        flex: 1,
        flexWrap: 'wrap',
    },
    icon: {
        flexDirection: 'row',
        alignItems: 'top',
        justifyContent: 'flex-start',
        marginVertical: 9,
        width: '100%',
    },
    iconImage: {
        width: width * 0.13,
        height: width * 0.13,
        marginLeft: 5,
        marginBottom: 10,
    },
    textsT: {
        marginTop: 30,
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#027CFF',
    },
    textT: {
        fontSize: width * 0.07,
        color: '#027CFF',
        fontFamily: 'BebasNeue',
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
         fontFamily: 'Roboto',
    },
});
