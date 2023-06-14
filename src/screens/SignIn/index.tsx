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

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  async function login() {
    if (email === '' || password === '') {
      return;
    }

    await auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.navigate('Home');
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContent}>
        <Image
          source={require('../../assets/chat_logo.png')}
          style={{width: 200, height: 180}}
        />
      </View>

      <View style={styles.inputsContent}>
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

        <TouchableOpacity onPress={login} style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Cadastro')}
          style={styles.linkButton}>
          <Text style={styles.linkText}>
            Não possui uma conta? Cadastre-se!
          </Text>
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
    flex: 1,
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
