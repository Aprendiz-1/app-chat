import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  async function register() {
    if (name === '' || email === '' || password === '') {
      return;
    }

    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        user.user
          .updateProfile({
            displayName: name,
          })
          .then(() => {
            navigation.navigate('Home');
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('Email já em uso!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('Email inválido!');
        }
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContent}>
        <Image
          source={require('../../assets/chat_logo.png')}
          style={{width: 180, height: 160}}
        />
      </View>

      <View style={styles.inputsContent}>
        <TextInput
          placeholder="Digite seu nome"
          keyboardType="email-address"
          value={name}
          onChangeText={e => setName(e)}
          style={styles.input}
        />

        <TextInput
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          value={email}
          onChangeText={e => setEmail(e)}
          style={styles.input}
        />

        <TextInput
          placeholder="Digite sua senha"
          secureTextEntry={true}
          value={password}
          onChangeText={e => setPassword(e)}
          style={styles.input}
        />

        <TouchableOpacity onPress={register} style={styles.button}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.linkButton}>
          <Text style={styles.linkText}>Já possui conta? Faça login!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputsContent: {
    flex: 1.2,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#333',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 40,
  },
  input: {
    width: '92%',
    height: 50,
    fontSize: 15,
    color: '#fff',
    backgroundColor: '#555',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: '92%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5a1fa7',
    borderRadius: 8,
    marginTop: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  linkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  linkText: {
    fontSize: 14,
    color: '#fff',
  },
});
