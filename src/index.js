import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';

const ChatGPT = () => {
  const [conversations, setConversations] = useState([{ id: 1, data: [] }]);
  const [activeConversationId, setActiveConversationId] = useState(1);
  const apiKey = 'APIKEY';
  const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-002/completions';
  const [textInput, setTextInput] = useState('');

  const handleSend = async () => {
    const prompt = textInput;
    const response = await axios.post(apiUrl, {
      prompt: prompt,
      max_tokens: 1024,
      temperature: 0.5
    }, {
      headers: {
        "Content-Type": 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    const text = response.data.choices[0].text;
    const updatedConversations = [...conversations];
    const activeConversationIndex = updatedConversations.findIndex(conversation => conversation.id === activeConversationId);
    updatedConversations[activeConversationIndex].data = [...updatedConversations[activeConversationIndex].data, { type: 'user', 'text': textInput }, { type: 'bot', 'text': text }];
    setConversations(updatedConversations);
    setTextInput('');
  };

  const handleClear = () => {
    const updatedConversations = [...conversations];
    const activeConversationIndex = updatedConversations.findIndex(conversation => conversation.id === activeConversationId);
    updatedConversations[activeConversationIndex].data = [];
    setConversations(updatedConversations);
  };

  const handleConversationChange = (conversationId) => {
    setActiveConversationId(conversationId);
  };

  const handleNewConversation = () => {
    const newConversation = {
      id: conversations.length + 1,
      data: []
    };
    setConversations([...conversations, newConversation]);
    setActiveConversationId(newConversation.id);
  };

  const activeConversation = conversations.find(conversation => conversation.id === activeConversationId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={{ uri: 'https://cdn-images-1.medium.com/max/1200/1*Q2e-7V4iN4wN7sR8RyoB_w.png' }}
        />
        <Text style={styles.title}>AI Chatbot</Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.conversationsContainer}>
        <ScrollView style={styles.conversationsList}>
          {conversations.map(conversation => (
            <TouchableOpacity key={conversation.id} style={[styles.conversationButton, activeConversationId === conversation.id && styles.activeConversationButton]} onPress={() => handleConversationChange(conversation.id)}>
              <Text style={[styles.conversationButtonText, activeConversationId === conversation.id && styles.activeConversationButtonText]}>Conversation {conversation.id}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.newConversationButton} onPress={handleNewConversation}>
            <Text style={styles.newConversationButtonText}>New Conversation</Text>
        </TouchableOpacity>
            </ScrollView>

        </View>
  <View style={styles.chatContainer}>
    <FlatList
      data={activeConversation.data}
      renderItem={({ item }) => (
        <View style={[styles.chatBubble, item.type === 'user' ? styles.userChatBubble : styles.botChatBubble]}>
          <Text style={[styles.chatText, item.type === 'user' ? styles.userChatText : styles.botChatText]}>{item.text}</Text>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      inverted
    />
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Type your message here..."
        value={textInput}
        onChangeText={(text) => setTextInput(text)}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#F5FCFF',
},
header: {
height: 80,
paddingTop: 30,
backgroundColor: '#4E9BCD',
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
paddingHorizontal: 20,
},
title: {
color: 'white',
fontSize: 20,
fontWeight: 'bold',
},
logo: {
width: 50,
height: 50,
},
conversationsContainer: {
flex: 1,
backgroundColor: '#E5E5E5',
paddingHorizontal: 20,
paddingVertical: 10,
},
conversationButton: {
backgroundColor: 'white',
borderRadius: 20,
paddingVertical: 10,
paddingHorizontal: 20,
marginBottom: 10,
},
conversationButtonText: {
fontWeight: 'bold',
},
activeConversationButton: {
backgroundColor: '#4E9BCD',
},
activeConversationButtonText: {
color: 'white',
},
newConversationButton: {
backgroundColor: '#4E9BCD',
borderRadius: 20,
paddingVertical: 10,
paddingHorizontal: 20,
alignItems: 'center',
justifyContent: 'center',
marginTop: 10,
},
newConversationButtonText: {
color: 'white',
fontWeight: 'bold',
},
chatContainer: {
flex: 5,
paddingHorizontal: 20,
paddingVertical: 10,
},
chatBubble: {
borderRadius: 10,
padding: 10,
maxWidth: '80%',
marginBottom: 10,
},
userChatBubble: {
backgroundColor: '#4E9BCD',
alignSelf: 'flex-end',
},
botChatBubble: {
backgroundColor: '#E5E5E5',
alignSelf: 'flex-start',
},
chatText: {
fontSize: 16,
color: 'white',
},
userChatText: {
color: 'white',
},
botChatText: {
color: 'black',
},
inputContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
backgroundColor: '#E5E5E5',
paddingVertical: 10,
paddingHorizontal: 20,
},
textInput: {flex: 1,
fontSize: 16,
paddingVertical: 8,
paddingHorizontal: 12,
backgroundColor: 'white',
borderRadius: 20,
marginRight: 10,
},
sendButton: {
backgroundColor: '#4E9BCD',
paddingVertical: 10,
paddingHorizontal: 20,
borderRadius: 20,
},
sendButtonText: {
color: 'white',
fontWeight: 'bold',
},
clearButton: {
backgroundColor: '#E5E5E5',
paddingVertical: 10,
paddingHorizontal: 20,
borderRadius: 20,
},
clearButtonText: {
color: '#4E9BCD',
fontWeight: 'bold',
},
});
export default ChatGPT;
