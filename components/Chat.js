import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Chat = ({ route, navigation }) => {

    const { name, backgroundColor } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, [name]);

    {/* takes on the name and background color set in the Start screen */}
    return (
        <View style={[styles.container, { backgroundColor }]}> 
            <Text style={styles.chatText}>Welcome {name}!</Text> 
        </View> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    chatText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center'
    }
});

export default Chat;