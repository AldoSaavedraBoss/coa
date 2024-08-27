import { useEffect, useState } from 'react'
import { ActivityIndicator, Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, View, } from 'react-native'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { saveUserData, getUserData, clearUserData } from '../../storage/auth'
import { AuthProps } from '../../interfaces/user'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    useEffect(() => {
        checkAuthStatus()
    }, []);

    const verifyToken = async (token: string) => {
        try {
            const response = await axios.get('http://192.168.0.18:3000/verify-token', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.status === 200;
        } catch (error) {
            console.error('Error al verificar el token', error);
            return false;
        }
    };

    const checkAuthStatus = async () => {
        try {
            const user: AuthProps = await getUserData()
            const token = user?.token
            console.log('token', token)
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
        try {
            setLoading(true)
            const response = await axios.post(`http://192.168.0.18:3000/login`, {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.status === 200) {
                response.data.data.rol === 'cliente' ? navigation.navigate('ClientLayout') : navigation.navigate('TecnicLayout')
                await saveUserData(response.data)
            }
        } catch (error) {
            console.error('Error al iniciar sesion', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <TextInput value={email} style={styles.input} placeholder='Correo' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder='Contraseña' autoCapitalize='none' onChangeText={(text) => setPassword(text)}></TextInput>
                {
                    loading ? <ActivityIndicator size="large" color="#0000ff" /> :
                        <>
                            <Button title='Iniciar' onPress={() => signIn()} />
                        </>
                }
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    }, input: {
        margin: 4,
        borderWidth: 1,
        borderRadius: 6,
        height: 50,
        padding: 10,
        backgroundColor: '#fff'
    }
})

export default Login