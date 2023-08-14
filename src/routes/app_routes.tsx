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
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Cadastro" component={SignUp} />
      <Stack.Screen name="Login" component={SignIn} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Messages" component={Messages} />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  );
}
