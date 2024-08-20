import { useState } from 'react'
import { ActivityIndicator, Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, View, } from 'react-native'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    const signIn = async () => {
        console.log('ruta',process.env.URL_BACKEND)
        try {
            setLoading(true)
            const response = await axios.post(`${process.env.URL_BACKEND}/login`, {
                email: "test@test.com",
                password: "123456"
            })
            if(response.status === 200) console.log(response.data)
        } catch (error) {
            console.error('Error al iniciar sesion', error)
        } finally {
            setLoading(false)
            navigation.navigate('ClientLayout')
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