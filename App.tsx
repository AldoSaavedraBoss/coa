import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper'
import Login from './app/screens/Login';
import Home from './app/screens/cliente/Home';
import GardenDetail from './app/screens/cliente/GardenDetail';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Main } from './components/Main';

type RootStackParamList = {
  Login: undefined;
  ClientLayout: { screen?: string } | undefined;
};

// const Stack = createNativeStackNavigator()
// const StackClient = createNativeStackNavigator()

// const ClientLayout = ({ route }: NativeStackScreenProps<RootStackParamList, 'ClientLayout'>) => {
//   return (
//     <StackClient.Navigator initialRouteName='Inicio'>
//       <StackClient.Screen name='Inicio' component={Home} options={{ headerShown: false }} />
//       <StackClient.Screen name='Detalles' component={GardenDetail} />
//     </StackClient.Navigator>
//   )
// }

export default function App() {
  return (
    <SafeAreaProvider>
      <Main/>
    </SafeAreaProvider>
  );
}

