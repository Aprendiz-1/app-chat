import {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CardGroup from '../../components/CardGroup';

type UserProps = {
  uid: string;
  displayName: string;
};

type ThreadProps = {
  id: string;
  name: string;
  owner: string | null;
  lastMessage: {text: string};
};

export default function Search() {
  const [groupName, setGroupName] = useState('');
  const [user, setUser] = useState<UserProps | null>();
  const [groups, setGroups] = useState<Array<ThreadProps>>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const hasUser = auth().currentUser
      ? (auth().currentUser?.toJSON() as UserProps)
      : null;
    setUser(hasUser);
  }, [isFocused]);

  async function search() {
    if (groupName === '') {
      return;
    }

    await firestore()
      .collection('MESSAGE_THREADS')
      .where('name', '>=', groupName)
      .where('name', '<=', groupName + '/uf8ff')
      .get()
      .then(snapshot => {
        const threads = snapshot.docs.map(docSnapshot => {
          return {
            id: docSnapshot.id,
            name: '',
            lastMessage: {text: ''},
            ...docSnapshot.data(),
          };
        });

        setGroups(threads);
        setGroupName('');
        Keyboard.dismiss();
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContent}>
        <TextInput
          placeholder="Digite aqui"
          value={groupName}
          onChangeText={e => setGroupName(e)}
          style={styles.input}
        />

        <TouchableOpacity onPress={search} style={styles.searchButton}>
          <Icon name="search1" size={25} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        style={{width: '100%', paddingHorizontal: 10}}
        renderItem={({item}) => <CardGroup data={item} userStatus={user} />}
      />
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
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: '100%',
    backgroundColor: '#333',
    paddingHorizontal: 10,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  searchButton: {
    width: 54,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a06a1',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
});
