import { View, Text } from 'react-native'
import { useState, useEffect } from 'react'
import { Button, IconButton, Modal, Portal, TextInput } from 'react-native-paper'
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo';
import { ClientProps, ToastData } from '../interfaces/user'
import { useSQLiteContext } from 'expo-sqlite';
import Toast from 'react-native-toast-message'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface NewClientModalProps {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    techId: string | undefined,
    getNewClient: (client: ClientProps) => void
    getToastData: (obj: ToastData) => void
}

const NewClientModal = ({ visible, setVisible, techId, getNewClient, getToastData }: NewClientModalProps) => {
    const db = useSQLiteContext()
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

        const state = await NetInfo.fetch()
        if (state.isConnected) {
            const uuid = uuidv4();

            const newClient: ClientProps = {
                id: uuid,
                tecnico_id: techId || '',
                email: email,
                apellido: lastname,
                rol: 'cliente',
                creacion: new Date().toString(),
                nombre: name,
            }

            try {
                const result = await db.runAsync('INSERT INTO usuarios (id, apellido, creacion, email, nombre, tecnico_id, historial_estados_huertos) VALUES (?,?,?,?,?,?,?)', uuid, lastname, new Date().toString(), email, name, techId || '', JSON.stringify([]))
                console.log(result.changes)
                getNewClient(newClient)
                getToastData({
                    type: "success",
                    text1: 'Ok',
                    text2: 'El cliente se ha agregado exitosamente',
                    text1Style: { fontSize: 18 },
                    text2Style: { fontSize: 15 },
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
        //         getNewClient(response.data)
        //         onClose()
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

    const onClose = () => {
        setEmail('')
        setLastname('')
        setName('')
        setVisible(false)
    }
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onClose} contentContainerStyle={{ backgroundColor: '#fff', gap: 20, padding: 20 }}>
                <IconButton
                    icon="close"
                    iconColor='#777777'
                    size={20}
                    style={{ marginLeft: 'auto' }}
                    containerColor="#dddddd"
                    onPress={onClose}
                />
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
            </Modal>
        </Portal>
    )
}

export default NewClientModal