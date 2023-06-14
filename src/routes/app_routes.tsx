import {createStackNavigator} from '@react-navigation/stack';
import SignUp from '../screens/SignUp';
import SignIn from '../screens/SignIn';
import Home from '../screens/Home';
import Messages from '../screens/Messages';
import Search from '../screens/Search';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          height: 65,
          backgroundColor: '#4a06a1',
        },
        headerTintColor: '#fff',
      }}>
      <Stack.Screen name="Cadastro" component={SignUp} />
      <Stack.Screen name="Login" component={SignIn} />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={({route}) => ({
          title: route.params.thread.name,
        })}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{title: 'Procurar grupos'}}
      />
    </Stack.Navigator>
  );
}
