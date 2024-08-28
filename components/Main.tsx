import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper'
import Login from '../app/screens/Login'
import Home from '../app/screens/cliente/Home';
import HomeAgronomo from '../app/screens/agronomo/Home';
import GardenDetail from '../app/screens/cliente/GardenDetail';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import ClientDetail from '../app/screens/agronomo/ClientDetail';

type RootStackParamList = {
    Login: undefined;
    ClientLayout: { screen?: string } | undefined;
};

const Stack = createNativeStackNavigator()
const StackClient = createNativeStackNavigator()
const StackTecnic = createNativeStackNavigator()

const ClientLayout = ({ route }: NativeStackScreenProps<RootStackParamList, 'ClientLayout'>) => {
    return (
        <StackClient.Navigator initialRouteName='Inicio'>
            <StackClient.Screen name='Inicio' component={Home} options={{ headerShown: false }} />
            <StackClient.Screen name='Detalles' component={GardenDetail} />
        </StackClient.Navigator>
    )
}

const TecnicLayout = ({route}) => {
    return (
        <StackTecnic.Navigator initialRouteName='Inicio'>
            <StackTecnic.Screen name='Inicio' component={HomeAgronomo} options={{headerShown: false}}/>
            <StackTecnic.Screen name='Huertos del cliente' component={ClientDetail} />
            <StackTecnic.Screen name='Detalles' component={GardenDetail} />
        </StackTecnic.Navigator>
    )
}

export function Main() {
    const insets = useSafeAreaInsets()
    return (
        <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1 }}>
            <PaperProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName='Login'>
                        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
                        <Stack.Screen name='ClientLayout' component={ClientLayout} options={{ headerShown: false }} />
                        <Stack.Screen name='TecnicLayout' component={TecnicLayout} options={{headerShown: false}}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </View>
    );
}

