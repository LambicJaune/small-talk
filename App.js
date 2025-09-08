import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import Start from './components/Start';
import Chat from './components/Chat';

const App = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyC3av3eqDj_DaS_j0MwE9UutHK9H1oHqVA",
        authDomain: "small-talk-app-6d1da.firebaseapp.com",
        projectId: "small-talk-app-6d1da",
        storageBucket: "small-talk-app-6d1da.firebasestorage.app",
        messagingSenderId: "926470568475",
        appId: "1:926470568475:web:51b9833262494e949f56be"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Start"
            >
                <Stack.Screen
                    name="Start"
                >
                    {props => <Start db={db} app={app} {...props} />}
                </Stack.Screen>
                <Stack.Screen
                    name="Chat">
                    {props => <Chat db={db} {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default App;