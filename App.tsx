import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import Routes from './src/routes/app_routes';

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#4a06a1" barStyle="light-content" />
      <Routes />
    </NavigationContainer>
  );
}
