import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper'
import Login from '../app/screens/Login'
import Home from '../app/screens/cliente/Home';
import HomeAgronomo from '../app/screens/agronomo/Home';
import GardenDetail from '../app/screens/cliente/GardenDetail';

import { View } from 'react-native';
import ClientDetail from '../app/screens/agronomo/ClientDetail';
import { createTables } from '../SQLite/createTables';
import Register from '../app/screens/Register';

type RootStackParamList = {
    Login: undefined;
    ClientLayout: { screen?: string } | undefined;
};


const Stack = createNativeStackNavigator()
// const StackClient = createNativeStackNavigator()
const StackTecnic = createNativeStackNavigator()

// const ClientLayout = ({ route }: NativeStackScreenProps<RootStackParamList, 'ClientLayout'>) => {
//     return (
//         <StackClient.Navigator initialRouteName='Inicio'>
//             <StackClient.Screen name='Inicio' component={Home} options={{ headerShown: false }} />
//             <StackClient.Screen name='Detalles' component={GardenDetail} />
//         </StackClient.Navigator>
//     )
// }

const TecnicLayout = ({ route }) => {
    const { id } = route.params;
    console.log('main', id)
    return (
        <StackTecnic.Navigator initialRouteName='Inicio'>
            <StackTecnic.Screen name='Inicio' component={HomeAgronomo} initialParams={{ id_user: id }} options={{ headerShown: false }} />
            <StackTecnic.Screen name='Huertos del cliente' component={ClientDetail} />
            <StackTecnic.Screen name='Detalles' component={GardenDetail} />
        </StackTecnic.Navigator>
    )
}

const initializeDatabase = async (db: any) => {
    try {
        await db.execAsync(`
            DROP TABLE IF EXISTS dates;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS gardens;
DROP TABLE IF EXISTS general_suggestions;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS features;
DROP TABLE IF EXISTS features_modified;
DROP TABLE IF EXISTS fertilizer;
DROP TABLE IF EXISTS general_states;
            `)
    } catch (error) {
        console.error('Error whilte initializing the database', error)
    }
}

export function Main() {

    return (
        <PaperProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName='Login'>
                        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
                        <Stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
                        {/* <Stack.Screen name='ClientLayout' component={ClientLayout} options={{ headerShown: false }} /> */}
                        {/* <Stack.Screen name='TecnicLayout' component={TecnicLayout} options={{ headerShown: false }} /> */}
                        <Stack.Screen name='Inicio' component={HomeAgronomo} options={{ headerShown: false }} />
                        <Stack.Screen name='Huertos del cliente' component={ClientDetail} />
                        <Stack.Screen name='Detalles' component={GardenDetail} />
                    </Stack.Navigator>
                </NavigationContainer>
        </PaperProvider>
    );
}

