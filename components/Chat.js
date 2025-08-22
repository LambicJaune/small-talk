import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';

const Chat = ({ route, navigation }) => {
    const { name, backgroundColor } = route.params;
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
        setMessages(prev => GiftedChat.append(prev, newMessages));
    }

    useEffect(() => {
        navigation.setOptions({ title: name });
        setMessages([
            {
                _id: 1,
                text: "Hello developer",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: "https://placeimg.com/140/140/any",
                },
            },
            {
                _id: 2,
                text: 'You have entered the chat',
                createdAt: new Date(),
                system: true,
            },
        ]);
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
                user={{ _id: 1 }}
                keyboardShouldPersistTaps="handled"
                keyboardVerticalOffset={Platform.OS === 'android' ? 30 : 0}
                renderBubble={renderBubble}
            />
        </SafeAreaView>
    );
};

export default Chat;
