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
      <StatusBar backgroundColor="#333" barStyle="light-content" />
      <KeyboardAvoidingView behavior="height" style={{flex: 1}}>
        <View style={styles.inputsContent}>
          <Image
            source={require('../../assets/logo_chat.png')}
            style={{width: 180, height: 235, marginBottom: 50}}
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

          <TouchableOpacity onPress={login} style={styles.button}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContent}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Cadastro')}
            style={styles.registerButton}>
            <Text style={styles.registerText}>Cadastrar</Text>
            <AntDesign name="arrowright" size={25} color="#fff" />
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
  inputsContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingVertical: 80,
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
  bottomContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButton: {
    width: 152,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5a1fa7',
    borderRadius: 25,
  },
  registerText: {
    fontSize: 16,
    color: '#fff',
    marginRight: 5,
  },
});
