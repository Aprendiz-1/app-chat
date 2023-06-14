import {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

type UserProps = {
  uid: string;
  displayName: string;
};

type MessageProps = {
  id: string;
  text: string;
  createdAt: FirebaseFirestoreTypes.FieldValue;
  system: boolean | null;
  user: {
    id: string;
    displayName: string;
  };
};

interface CardProps {
  data: MessageProps;
}

export default function CardMessage({data}: CardProps) {
  const user = auth().currentUser?.toJSON() as UserProps;

  const isMyMessage = useMemo(() => {
    return data?.user?.id === user.uid;
  }, [data?.user?.id, user.uid]);

  return (
    <View style={styles.cardContainer}>
      <View
        style={[
          styles.cardContent,
          {
            backgroundColor: isMyMessage ? '#513c6b' : '#444',
            marginLeft: isMyMessage ? 50 : 0,
            marginRight: isMyMessage ? 0 : 50,
          },
        ]}>
        {!isMyMessage && !data.system && (
          <Text style={styles.cardTitle}>{data?.user?.displayName}</Text>
        )}
        <Text style={styles.messageText}>{data.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  cardContent: {
    padding: 10,
    borderRadius: 5,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#9145f5',
  },
  messageText: {
    color: '#fff',
  },
});
