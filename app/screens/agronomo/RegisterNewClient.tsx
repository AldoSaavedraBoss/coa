import { useState } from "react"
import { View } from "react-native"
import { Button, TextInput } from "react-native-paper"
import Toast from "react-native-toast-message"
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../SQLite/createTables'
import { ClientProps } from "../../../interfaces/user";

interface NewClientProps {
    route: any,
    navigation: any
    getNewClient: (client: ClientProps) => void
}

const RegisterNewClient = ({ route, navigation, }: NewClientProps) => {
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')

    const handleNewClient = async () => {
        if (name === '') {
            Toast.show({
                type: "info",
                text1: 'Algo falta...',
                text2: 'Nombre',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })
            return
        }
        if (lastname === '') {
            Toast.show({
                type: "info",
                text1: 'Algo falta...',
                text2: 'Apellidos',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })
            return
        }
        if (email === '') {
            Toast.show({
                type: "info",
                text1: 'Algo falta...',
                text2: 'Correo',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })
            return
        }

        const isEmail = handleEmailChange

        if (!isEmail) {
            Toast.show({
                type: "error",
                text1: 'Error',
                text2: 'Email no valido',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 }
            })
            return
        }

        const uuid = uuidv4();

        const newClient: ClientProps = {
            id: uuid,
            tecnico_id: techId || '',
            email: email,
            apellido: lastname,
            rol: 'cliente',
            creacion: new Date().toString(),
            nombre: name,
            historial_estados_huertos: '[]'
        }

        try {
            await db.transactionAsync(async tx => {
                const result = await tx.executeSqlAsync("INSERT INTO usuarios (id, apellido, creacion, email, nombre, tecnico_id, historial_estados_huertos) VALUES (?,?,?,?,?,?,?)", [uuid, lastname, new Date().toString(), email, name, techId || '', JSON.stringify([])])

                if(result.rowsAffected > 0) {
                    // getToastData({
                    //     type: "success",
                    //     text1: 'Ok',
                    //     text2: 'El cliente se ha agregado exitosamente',
                    //     text1Style: { fontSize: 18 },
                    //     text2Style: { fontSize: 15 },
                    // })
                    getNewClient(newClient)
                }
            })
            
            onClose()
        } catch (error) {
            console.log('Error al crear usuario en sqlite', error)
            Toast.show({
                type: "error",
                text1: 'Error',
                text2: 'Algo salio mal al agregar el cliente',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })
        }

        // try {
        //     const response = await axios.post('http://192.168.0.18:3000/tech/register/client/', {
        //         name,
        //         lastname,
        //         email,
        //         tecnicoId: techId
        //     })

        //     if (response.status === 200) {
        //         Toast.show({
        //             type: 'success',
        //             text1: 'Ok',
        //             text2: 'El cliente se ha agregado exitosamente',
        //             text1Style: { fontSize: 18 },
        //             text2Style: { fontSize: 15 },
        //         })
        //         // getNewClient(response.data)
        //         // onClose()
        //     }
        // } catch (error) {
        //     console.error('Error al enviar cliente', error)
        //     Toast.show({
        //         type: "error",
        //         text1: 'Error',
        //         text2: 'Algo salio mal al agregar el cliente',
        //         text1Style: { fontSize: 18 },
        //         text2Style: { fontSize: 15 },
        //     })
        // }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleEmailChange = (value: string) => {
        return emailRegex.test(value)

    };
    return (
        <View>
                {/* <IconButton
                    icon="close"
                    iconColor='#777777'
                    size={20}
                    style={{ marginLeft: 'auto' }}
                    containerColor="#dddddd"
                    onPress={onClose}
                /> */}
                <TextInput
                    label='Nombre(s)'
                    value={name}
                    onChangeText={text => setName(text)}
                />
                <TextInput
                    label='Apellidos'
                    value={lastname}
                    onChangeText={text => setLastname(text)}
                />
                <TextInput
                    label='email'
                    value={email}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    onChangeText={text => setEmail(text)}
                />

                <Button mode='contained' onPress={handleNewClient}>Agregar</Button>
                <Toast position='bottom' />
        </View>
    )
}