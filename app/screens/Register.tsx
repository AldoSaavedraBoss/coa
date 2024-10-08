import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'
import { View } from 'react-native'
import React, { useState } from 'react'
import db from '../../SQLite/createTables'
import { useNavigation } from '@react-navigation/native'
import { Button, IconButton, Text, TextInput } from 'react-native-paper'
import Toast from 'react-native-toast-message'

const Register = () => {
    const navigation = useNavigation()
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    const handleRegister = async () => {
        const isValid = validate()
        if (!isValid) return
        const id = uuidv4()
        try {
            await db.transactionAsync(async tx => {
                console.log('antes de la consulta')
                console.log('id es:', id)

                const count = await tx.executeSqlAsync("SELECT COUNT(*) FROM autenticacion WHERE email = ?", [email]);
                console.log('despues de la consulta',count)

                if (count.rows[0]["COUNT(*)"] > 0) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Email ya existente',
                        text1Style: { fontSize: 18 },
                        text2Style: { fontSize: 15 },
                    })
                    return
                }

                // const insertAuth = await tx.executeSqlAsync("INSERT INTO autenticacion (id, email, password, creacion) VALUES (?,?,?,?)", [id, email.trim(), password.trim(), new Date().toString()])

                // const insertUsers = await tx.executeSqlAsync("INSERT INTO usuarios (id, apellido, creacion, email,  nombre, rol) VALUES (?,?,?,?,?,?)", [id, lastname.trim(), new Date().toString(), email.trim(), name.trim(), 'tecnico'])

                // const info = await tx.executeSqlAsync("SELECT * FROM usuarios;")
                // console.log('info de usuarios', info.rows)

                // console.log('inserts', insertAuth, insertUsers)
                
                // if (insertAuth.rowsAffected > 0 && insertUsers.rowsAffected > 0) navigation.navigate('Inicio', { id_user: id })
            })
            // console.error('No se pudo registrar en autenticacion')
            // console.error('No se pudo registrar en usaurios')
        } catch (error) {
            console.error(error)
        }
    }

    const validate = () => {

        if (!name) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Falta el nombre',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })
            return false
        }
        if (!lastname) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Falta el apellido',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })
            return false
        }
        if (!email) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Falta el email',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })
            return false
        }
        if (!password || !password2) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Falta la contraseña y/o la confirmación',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })
            return false
        }
        if (password !== password2) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Las contraseñas no coinciden',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })
            return false
        }

        return true
    }

    return (
        <View style={{ flex: 1, paddingVertical: 40, paddingHorizontal: 20 }}>
            <IconButton icon='keyboard-backspace' onPress={() => navigation.goBack()} />
            <Text variant='titleLarge' style={{ textAlign: 'center' }}>Registro de tecnico</Text>
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', gap: 20 }}>
                <TextInput label="Nombre" value={name} onChangeText={text => setName(text.trim())} autoFocus />
                <TextInput
                    label="Apellidos"
                    value={lastname}
                    onChangeText={text => setLastname(text)}
                />
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    autoCapitalize='none'
                    keyboardType='email-address'
                />
                <TextInput
                    label="Contraseña"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                />
                <TextInput
                    label="Confirmar contraseña"
                    value={password2}
                    onChangeText={text => setPassword2(text)}
                    secureTextEntry
                />
            </View>
            <Button
                mode="contained"
                onPress={handleRegister}
                style={{ width: 200, marginHorizontal: 'auto' }}
            >
                Aceptar
            </Button>
            <Toast position="bottom" />
        </View>
    )
}

export default Register
