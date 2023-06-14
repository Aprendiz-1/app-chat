import {useNavigation} from '@react-navigation/native';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

type ThreadProps = {
  id: string;
  name: string;
  owner: string;
  lastMessage: {text: string};
};

type UserProps = {
  uid: string;
  displayName: string;
};

interface CardProps {
  data: ThreadProps;
  deleteGroup: () => void;
  userStatus: UserProps;
}

export default function CardGroup({data, deleteGroup, userStatus}: CardProps) {
  const navigation = useNavigation();

  function handleNavigate() {
    if (userStatus) {
      navigation.navigate('Messages', {thread: data});
    } else {
      navigation.navigate('Login');
    }
  }

  return (
    <TouchableOpacity
      onLongPress={() => deleteGroup()}
      onPress={handleNavigate}>
      <View style={styles.groupCard}>
        <Text style={styles.groupName}>{data.name}</Text>
        <Text>{data.lastMessage.text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
