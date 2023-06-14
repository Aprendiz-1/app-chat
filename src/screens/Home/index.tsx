import {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import GroupModal from '../../components/GroupModal';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import CardGroup from '../../components/CardGroup';

type UserProps = {
  uid: string;
  displayName: string;
};

interface ThreadProps {
  id: string;
  name: string;
  owner: string | null;
  lastMessage: {text: string};
}

interface DeleteProps {
  ownerId: string;
  groupId: string;
}

export default function Home() {
  const [threads, setThreads] = useState<Array<ThreadProps>>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<UserProps | null>();
  const [updateScreen, setUpdateScreen] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const hasUser = auth().currentUser
      ? (auth().currentUser?.toJSON() as UserProps)
      : null;
    setUser(hasUser);
  }, [isFocused]);

  useEffect(() => {
    let isActive = true;

    function loadChats() {
      firestore()
        .collection('MESSAGE_THREADS')
        .orderBy('lastMessage.createdAt', 'desc')
        .limit(10)
        .get()
        .then(snapshot => {
          const thread = snapshot.docs.map(document => {
            return {
              id: document.id,
              name: '',
              lastMessage: {text: ''},
              ...document.data(),
            };
          });

          if (isActive) {
            setThreads(thread);
          }
        });
    }

    loadChats();

    return () => {
      isActive = false;
    };
  }, [isFocused, updateScreen]);

  function handleSignOut() {
    auth()
      .signOut()
      .then(() => {
        setUser(null);
        navigation.navigate('Login');
      })
      .catch(error => {
        console.log(error);
      });
  }

  function deleteGroup({ownerId, groupId}: DeleteProps) {
    if (ownerId !== user?.uid) {
      return;
    }

    Alert.alert('Atenção!', 'Você tem certeza que deseja deletar essa sala?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => handleDeleteGroup(groupId),
      },
    ]);
  }

  async function handleDeleteGroup(groupId: string) {
    await firestore().collection('MESSAGE_THREADS').doc(groupId).delete();
    setUpdateScreen(!updateScreen);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContent}>
        <View style={styles.rowTopContent}>
          {user && (
            <TouchableOpacity onPress={handleSignOut} style={styles.backButton}>
              <SimpleIcon name="logout" size={22} color="#fff" />
            </TouchableOpacity>
          )}

          <Text style={styles.topTitle}>Grupos</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Icon name="search1" size={25} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <FlatList
          data={threads}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          style={{width: '100%', paddingHorizontal: 10}}
          renderItem={({item}) => (
            <CardGroup
              data={item}
              deleteGroup={() => deleteGroup(item.owner, item.id)}
              userStatus={user}
            />
          )}
        />
      </View>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.floatButton}>
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <GroupModal
          update={() => setUpdateScreen(!updateScreen)}
          closeModal={() => setModalVisible(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topContent: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4a06a1',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 22,
  },
  rowTopContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  groupCard: {
    width: '100%',
    height: 90,
    justifyContent: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 17,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  floatButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a06a1',
    borderRadius: 30,
    position: 'absolute',
    bottom: 25,
    right: 25,
    zIndex: 99,
  },
});
