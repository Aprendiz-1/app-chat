import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/AntDesign';

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
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      <View style={styles.topContent}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}>
          <AntDesign name="arrowleft" size={25} color="#fff" />
          <Text style={styles.loginText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputsContent}>
        {/* <Image
          source={require('../../assets/logo_chat.png')}
          style={{width: 155, height: 210, marginBottom: 40}}
        /> */}

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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  loginButton: {
    width: 110,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5a1fa7',
    borderRadius: 25,
    marginRight: 8,
  },
  loginText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
  inputsContent: {
    width: '100%',
    height: '88%',
    alignItems: 'center',
    backgroundColor: '#333',
    borderTopRightRadius: 60,
    paddingTop: 160,
  },
  input: {
    width: '89%',
    height: 50,
    fontSize: 15,
    color: '#fff',
    backgroundColor: '#555',
    borderRadius: 25,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  button: {
    width: '89%',
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5a1fa7',
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
