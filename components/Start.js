import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity } from 'react-native';

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);

    return (
        <View style={styles.container}>
            {/* Fullscreen background image */}
            <ImageBackground
                source={require('../assets/Background_Image.png')}
                style={styles.backgroundBox}
                resizeMode="cover"
            >
                <Text style={styles.welcomeText}>Small-Talk</Text>
            </ImageBackground>

            <View style={styles.foreGroundBox}>
                {/* Foreground box, with text color similar to #757083 with 50% opacity, as Android doesn't seem to support opacity on text inputs */}
                <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
                    placeholderTextColor="#BDBAC1"
                />
                <View style={styles.colorContainer}>
                    <Text style={styles.colorLabel}>Choose Background Color:</Text>
                    <View style={styles.colorOptions}>
                        {['#090C08', '#474056', '#8A95A5', '#B9C6AE'].map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorCircle,
                                    { backgroundColor: color },
                                    selectedColor === color ? styles.selectedCircle : null
                                ]}
                                onPress={() => setSelectedColor(color)}
                            />
                        ))}
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => navigation.navigate('Chat', { name, backgroundColor: selectedColor })}
                >
                    <Text style={styles.customButtonText}>Start Chatting</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    backgroundBox: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcomeText: {
        color: 'white',
        fontSize: 45,
        fontWeight: 'bold',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: 450
    },
    foreGroundBox: {
        position: 'absolute',
        bottom: 55,
        width: '90%',
        height: '40%', // lower third
        backgroundColor: 'white',
        justifyContent: 'center',
        alignSelf: 'center',
        padding: 20,
        elevation: 5 // adds shadow on Android
    },
    textInput: {
        width: "100%",
        padding: 15,
        borderWidth: 1,
        borderColor: "#757083",
        fontSize: 16,
        fontWeight: '300',
        color: "#757083",
        marginTop: 0,
        marginBottom: 10, // set up the distance in between the input and other elements below
        alignSelf: 'center'
    },
    colorContainer: {
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center'
    },
    colorLabel: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        marginBottom: 10
    },
    colorOptions: {
        flexDirection: 'row',
        justifyContent: 'center',   // center them horizontally
        alignItems: 'center',
        marginHorizontal: 10,
        marginTop: 10
    },
    colorCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginHorizontal: 10
    },
    selectedCircle: {
        borderWidth: 3,
        borderColor: '#757083'
    },
    customButton: {
        backgroundColor: '#757083', // works on both iOS & Android
        paddingVertical: 17,
        paddingHorizontal: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    customButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }

});

export default Start;