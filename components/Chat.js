import { useState, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
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

    useEffect(() => {
        navigation.setOptions({ title: name });
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(q, (docs) => {
            let newMessages = [];
            docs.forEach(doc => {
                newMessages.push({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: new Date(doc.data().createdAt.toMillis())
                })
            })
            setMessages(newMessages);
        })
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, []);

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
            />
        </SafeAreaView>
    );
};

export default Chat;
