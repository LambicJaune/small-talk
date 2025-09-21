import React from 'react';
import { useState, useEffect } from 'react';
import { Platform, Modal, Image, TouchableOpacity } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
import ImageViewer from 'react-native-image-zoom-viewer';

const Chat = ({ route, navigation, db, storage, isConnected }) => {
    const { name, userID, backgroundColor } = route.params;
    const [messages, setMessages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

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
    };

    const onSend = (newMessages) => {
        const message = {
            ...newMessages[0],
            createdAt: serverTimestamp(),
        };
        addDoc(collection(db, "messages"), message);
    };

    let unsubMessages;

    useEffect(() => {
        navigation.setOptions({ title: name });
        if (isConnected) {
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, async (docs) => {
                let newMessages = [];
                docs.forEach(doc => {
                    newMessages.push({
                        _id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate()
                            ? doc.data().createdAt.toDate()
                            : new Date(),
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

    const renderCustomActions = (props) => {
        return <CustomActions storage={storage} userID={userID} userName={name} onSend={messages => onSend(messages)} {...props} />;
    };

    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    // Render message image with modal for full-screen view on tap
    const renderMessageImage = (props) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setSelectedImage(props.currentMessage.image);
                    setModalVisible(true);
                }}
            >
                <Image
                    source={{ uri: props.currentMessage.image }}
                    style={{ width: 200, height: 200, borderRadius: 10, margin: 3 }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        );
    };

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
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                renderMessageImage={renderMessageImage}
            />
            {/* Fullscreen Image Viewer Modal */}
            <Modal visible={modalVisible} transparent={true}>
                <ImageViewer
                    imageUrls={[{ url: selectedImage }]}
                    onClick={() => setModalVisible(false)}
                    enableSwipeDown
                    onSwipeDown={() => setModalVisible(false)}
                />
            </Modal>
        </SafeAreaView>
    );
};

export default Chat;
