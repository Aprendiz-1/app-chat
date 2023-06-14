import {useEffect, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import CardMessage from '../../components/CardMessage';
import {RouteProp} from '@react-navigation/native';

type UserProps = {
  uid: string;
  displayName: string;
};

type ThreadProps = {
  Home: {
    thread: {
      id: string;
      name: string;
      lastMessage: {text: string};
    };
  };
};

type ThreadRouteProps = RouteProp<ThreadProps, 'Home'>;

interface ScreenProps {
  route: ThreadRouteProps;
}

interface MessagesProps {
  id: string;
  text: string;
  createdAt: FirebaseFirestoreTypes.FieldValue;
}

export default function Messages({route}: ScreenProps) {
  const {thread} = route.params;
  const [messages, setMessages] = useState<Array<MessagesProps>>([]);
  const [messageText, setMessageText] = useState('');
  const user = auth().currentUser?.toJSON() as UserProps;

  useEffect(() => {
    function loadMessages() {
      firestore()
        .collection('MESSAGE_THREADS')
        .doc(thread.id)
        .collection('MESSAGES')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          const messagesList = snapshot.docs.map(doc => {
            const firebaseData = doc.data();

            const data = {
              id: doc.id,
              text: '',
              createdAt: firestore.FieldValue.serverTimestamp(),
              ...firebaseData,
            };

            if (!firebaseData.system) {
              data.user = {
                ...firebaseData.user,
              };
            }

            return data;
          });

          setMessages(messagesList);
        });
    }

    loadMessages();
  }, [thread.id]);

  async function handleSend() {
    if (messageText === '') {
      return;
    }

    await firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread.id)
      .collection('MESSAGES')
      .add({
        text: messageText,
        createdAt: firestore.FieldValue.serverTimestamp(),
        user: {
          id: user.uid,
          displayName: user.displayName,
        },
      });

    await firestore()
      .collection('MESSAGE_THREADS')
      .doc(thread.id)
      .set(
        {
          lastMessage: {
            text: messageText,
            createdAt: firestore.FieldValue.serverTimestamp(),
          },
        },
        {merge: true},
      );

    setMessageText('');
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{width: '100%'}}
        data={messages}
        keyExtractor={item => item.id}
        inverted={true}
        renderItem={({item}) => <CardMessage data={item} />}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{width: '100%', padding: 10}}>
        <View style={styles.inputContent}>
          <TextInput
            placeholder="Digite aqui"
            value={messageText}
            onChangeText={e => setMessageText(e)}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Icon name="send" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  inputContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 30,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sendButton: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a06a1',
    borderRadius: 30,
  },
});
