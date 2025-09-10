import { useState, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
    const { name, userID, backgroundColor } = route.params;
    const [messages, setMessages] = useState([]);


    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#ce8551ff"
                },
                left: {
                    backgroundColor: "#fffde8ff"
                }
            }}
        />
    }

    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
    }

    let unsubMessages;

    useEffect(() => {
        navigation.setOptions({ title: name });
        if (isConnected) {
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, async (docs) => {
                let newMessages = [];
                docs.forEach(doc => {
                    newMessages.push({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis())
                    })
                })
                cacheMessages(newMessages);
                setMessages(newMessages);
            })
        } else loadCachedMessages();
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, [isConnected]);

    const loadCachedMessages = async () => {
        try {
            const cachedMessages = await AsyncStorage.getItem('messages');
            if (cachedMessages) {
                setMessages(JSON.parse(cachedMessages));
            }
        } catch (error) {
            console.error('Messages failed to load from AsyncStorage', error);
        }
    };

    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.error('Failed to cache messages', error);
        }
    };

    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}
            accessible={false}
            importantForAccessibility="no"
        >
            {/* SafeAreaView allows for the keyboard to not hide the text input */}

            {/* Chat library allowing messages to come and go */}
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{ _id: userID, name: name }}
                keyboardShouldPersistTaps="handled"
                keyboardVerticalOffset={Platform.OS === 'android' ? 30 : 0}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
            />
        </SafeAreaView>
    );
};

export default Chat;
