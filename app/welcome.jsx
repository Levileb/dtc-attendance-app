import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
    const navigation = useNavigation();

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
                          Your visit has been successfully logged.
                                Thank you for using our facility. We are glad to have you here today!
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('')}
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
        fontSize: width * 0.068,
        fontWeight: 'bold',
        color: '#027CFF',
    },
    note: {
        fontSize: width * 0.04,
        color: '#666',
        textAlign: 'center',
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
});
