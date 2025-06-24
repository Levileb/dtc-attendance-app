
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function StarterScreen() {
  return (
    <View style={styles.container}>
        <View style={styles.header}>  
            <Image
                    source={require('../assets/images/app-assets/dict1.png')}
                    style={{ width: width * 0.5, height: width * 0.5, marginBottom: 20 }}
                    resizeMode="contain"
                />
            </View>
        <View style={styles.card}>
            <View style={styles.title}>
                    <Text style={styles.textT}>DIGITAL TRANSFORMATION CENTER</Text>
                     <Text style={styles.textB}>The DICT offers free Digital Transformation Centers for freelancers, students, remote workers, and startups.
                                                 This app tracks daily usage to help us enhance our services and sustain the program.</Text>
                    <Text style={styles.textT}>HOW IT WORKS</Text>
                </View>
             <View style={styles.body}>
                   <View style={styles.icon}>
                         <Image
                            source={require('../assets/images/app-assets/write.png')}
                            style={{ width: width * 0.15, height: width * 0.15, marginLeft: 5, marginBottom: 20 }}
                            resizeMode="contain"
                        />
                         <Text style={styles.textB}>Fill out the form with your basic information.</Text>
                    </View>
                    <View style={styles.icon}>
                         <Image
                            source={require('../assets/images/app-assets/scan.png')}
                            style={{ width: width * 0.15, height: width * 0.15, marginLeft: 5, marginBottom: 20 }}
                            resizeMode="contain"
                        />
                         <Text style={styles.textB}>Fill out the form with your basic information.</Text>
                    </View>
                      <View style={styles.icon}>
                         <Image
                            source={require('../assets/images/app-assets/check.png')}
                            style={{ width: width * 0.15, height: width * 0.15, marginLeft: 5, marginBottom: 20 }}
                            resizeMode="contain"
                        />
                         <Text style={styles.textB}>Fill out the form with your basic information.</Text>
                    </View>
                </View>
                    
            </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'top', 
        alignItems: 'center',
    },
    header:{
        flexDirection:'column',
        width: '100%',
        height: 350,
        alignItems: 'center',
        backgroundColor: '#027CFF',
        paddingTop: 50,
        paddingBottom: 50,
        marginBottom: 20,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
    },
    card: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderRadius: 16,
        width: width * 0.9,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 6,
        marginTop: -130,
    },
    title:{
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        gap: 7,
    },
    textB: {
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
        paddingHorizontal: 5,
    },

    icon:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    textT: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#027CFF',
    },
});
