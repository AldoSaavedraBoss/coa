import { useEffect, useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View, } from 'react-native'
import { Button } from 'react-native-paper'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { saveUserData, getUserData, clearUserData } from '../../storage/auth'
import { AuthProps2 } from '../../interfaces/user'
import db, {createTables} from '../../SQLite/createTables'
import Toast from 'react-native-toast-message'

const Login = () => {
    // const db = useSQLiteContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    useEffect(() => {
        // checkAuthStatus()
        createTables()
    }, []);

    const verifyToken = async (token: string) => {
        try {
            const response = await axios.get('http://192.168.0.18:3000/verify-token', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.status === 200;
        } catch (error: any) {
            if (error.response && error.response.status === 404) console.error('Error al verificar el token', error);
            return false;
        }
    };

    const checkAuthStatus = async () => {
        try {
            //Authprops tiene el token
            const user: AuthProps2 = await getUserData()
            const token = user?.token
            if (token) {
                const isValid = await verifyToken(token);
                if (isValid) {
                    // Token válido, redirige al usuario a la pantalla principal
                    console.log('Token válido, usuario autenticado');
                    // Navegar a la pantalla principal o inicializar la app
                    user.data.rol === 'tecnico' ? navigation.navigate('TecnicLayout') : navigation.navigate('ClientLayout')
                } else {
                    // Token inválido o expirado, eliminar el token y redirigir al inicio de sesión
                    console.log('Token inválido, redirigiendo al inicio de sesión');
                    await clearUserData()
                    // Navegar a la pantalla de inicio de sesión
                }
            } else {
                // No hay token, redirigir al inicio de sesión
                console.log('No hay token, redirigiendo al inicio de sesión');
                // Navegar a la pantalla de inicio de sesión
            }
        } catch (error) {
            console.error('Error al comprobar el estado de autenticación', error);
            // Manejo de errores
        }
    };

    const signIn = async () => {
        setLoading(true)
        try {
            // const result: { id: string, email: string, password: string } | null = await db.getFirstAsync('SELECT id, email, password FROM autenticacion')
            // console.log('resultado',result)
            // if (result === null) {
            //     Toast.show({
            //         type: "error",
            //         text1: 'Error al iniciar sesión',
            //         text2: 'Usuario y/o contraseña incorrecta',
            //         text1Style: { fontSize: 18 },
            //         text2Style: { fontSize: 15 },
            //     })
            //     return
            // }
            // if (result.email === email && result.password === password) {
            await db.transactionAsync(async tx => {
                const result = await tx.executeSqlAsync("SELECT COUNT(*), id from autenticacion WHERE email = ? AND password = ?", [email, password])
                console.log('login count',result)
                const id_user: number = result.rows[0].id
                if (result.rows[0]['COUNT(*)'] > 0) {
                    navigation.navigate('Inicio', { id_user })
                } else {
                    Toast.show({
                        type: "error",
                        text1: 'Error al iniciar sesión',
                        text2: 'Usuario y/o contraseña incorrecta',
                        text1Style: { fontSize: 18 },
                        text2Style: { fontSize: 15 },
                    })
                }
            }, true)


        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
        // try {
        //     setLoading(true)
        //     const response = await axios.post(`http://192.168.0.18:3000/login`, {
        //         email,
        //         password
        //     }, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     })
        //     if (response.status === 200) {
        //         await saveUserData(response.data)
        //         response.data.data.rol === 'cliente' ? navigation.navigate('ClientLayout') : navigation.navigate('TecnicLayout')
        //     }
        // } catch (error: any) {
        //     if (error.response && error.response.status === 404) {
        //         Toast.show({
        //             type: "error",
        //             text1: 'Error al iniciar sesión',
        //             text2: 'Usuario y/o contraseña incorrecta',
        //             text1Style: { fontSize: 18 },
        //             text2Style: { fontSize: 15 },
        //         })
        //     } else {
        //         console.error('Error al iniciar sesión:', error)
        //     }
        // } finally {
        //     setLoading(false)
        // }
    }

    const handleRegister = () => {
        navigation.navigate('Register')
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding' style={{ gap: 12, flex: 1, justifyContent: 'center' }}>
                <TextInput value={email} style={styles.input} placeholder='Correo' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder='Contraseña' autoCapitalize='none' onChangeText={(text) => setPassword(text)}></TextInput>
                {
                    loading ? <ActivityIndicator size="large" color="#0000ff" /> :
                        <Button mode='elevated' onPress={signIn} style={{ width: 200, marginHorizontal: 'auto' }} >Iniciar</Button>
                }
            </KeyboardAvoidingView>
            <View style={styles.bottomButtonContainer}>
                <Button mode='contained' style={{ marginHorizontal: 'auto' }} onPress={handleRegister} >Registrate</Button>
            </View>
            <Toast position='bottom' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
    }, input: {
        margin: 4,
        borderWidth: 1,
        borderRadius: 6,
        height: 50,
        padding: 10,
        backgroundColor: '#fff'
    },
    bottomButtonContainer: {
        marginBottom: 20,  // Para darle espacio desde la parte inferior
        justifyContent: 'flex-end',
    }
})

export default Login