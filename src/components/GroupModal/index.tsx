import {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

type UserProps = {
  uid: string;
  displayName: string;
};

interface ModalProps {
  update: () => void;
  closeModal: () => void;
}

export default function GroupModal({update, closeModal}: ModalProps) {
  const user = auth().currentUser?.toJSON() as UserProps;
  const [name, setName] = useState('');

  async function createGroup() {
    if (name === '') {
      return;
    }

    await firestore()
      .collection('MESSAGE_THREADS')
      .add({
        name: name,
        owner: user?.uid,
        lastMessage: {
          text: `Grupo ${name} criado. Bem vindo(a)!`,
          createdAt: firestore.FieldValue.serverTimestamp(),
        },
      })
      .then(docRef => {
        docRef
          .collection('MESSAGES')
          .add({
            text: `Grupo ${name} criado. Bem vindo(a)!`,
            createdAt: firestore.FieldValue.serverTimestamp(),
            system: true,
          })
          .then(() => {
            closeModal();
            update();
          });
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <View style={styles.modalContainer}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.closeArea} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <Text style={styles.title}>Nome do Grupo</Text>
        <TextInput
          placeholder="Digite aqui"
          value={name}
          onChangeText={e => setName(e)}
          style={styles.input}
        />
        <TouchableOpacity onPress={createGroup} style={styles.button}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeArea: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#333',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '92%',
    height: 50,
    fontSize: 15,
    color: '#fff',
    backgroundColor: '#555',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: '92%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a06a1',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
