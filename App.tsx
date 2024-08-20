import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import Home from './app/screens/cliente/Home';
import GardenDetail from './app/screens/cliente/GardenDetail';

type RootStackParamList = {
  Login: undefined;
  ClientLayout: { screen?: string } | undefined;
};

const Stack = createNativeStackNavigator()
const StackClient = createNativeStackNavigator()

const ClientLayout = ({ route }: NativeStackScreenProps<RootStackParamList, 'ClientLayout'>) => {
  return (
    <StackClient.Navigator initialRouteName='Inicio'>
      <StackClient.Screen name='Inicio' component={Home}/>
      <StackClient.Screen name='Detalles' component={GardenDetail}/>
    </StackClient.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
        <Stack.Screen name='ClientLayout' component={ClientLayout} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

