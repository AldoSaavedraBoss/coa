import React, { useEffect, useState } from 'react'
import { Button, Modal, Portal, Text, IconButton, TextInput, Chip } from 'react-native-paper'
import { ClientProps, ToastData } from '../interfaces/user'
import { FlatList, View, StyleSheet } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useSQLiteContext } from 'expo-sqlite';

interface FeaturesModalProps {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    clients: ClientProps[]
    getToastData: (toastObj: ToastData) => void
}

interface NewGardenData {
    id: string,
    state: string,
    attributes: string[],
    date: Date
}

const RegisterStateModal = ({ visible, setVisible, clients, getToastData }: FeaturesModalProps) => {
    const db = useSQLiteContext()
    const [newGardenStatus, setNewGardenStatus] = useState<NewGardenData[]>([])

    const states = [
        { label: 'Todo bien', color: '#009929', value: 'todo bien' },
        { label: 'Precaución', color: '#ebed17', value: 'precaucion' },
        { label: 'Cuidado con plagas', color: '#efa229', value: 'cuidado con plagas' },
        { label: 'Mal estado', color: '#e80729', value: 'mal estado' },
    ]

    useEffect(() => {
        if (visible) {
            const initialStatus = clients.map(client => ({
                id: client.id,
                state: 'todo bien',
                attributes: [],
                date: new Date()
            }))
            setNewGardenStatus(initialStatus)
        }
    }, [visible])

    const handleCheckItems = (item: string, index: number) => {
        setNewGardenStatus(prev => {
            let aux = [...prev];

            if (aux[index].attributes.includes(item)) {
                // Si el elemento ya está seleccionado, lo removemos
                aux[index].attributes = aux[index].attributes.filter((i) => i !== item);
            } else {
                // Si el elemento no está seleccionado, lo agregamos
                aux[index].attributes.push(item)
            }
            return aux
        })
    }

    const handleSendData = async () => {
        console.log('entro')
        try {

            for (let i = 0; i < clients.length; i++) {
                for (let x = 0; x < newGardenStatus.length; x++) {
                    if (clients[i].id === newGardenStatus[x].id) {
                        const parsed = JSON.parse(clients[i].historial_estados_huertos)
                        parsed.push({
                            atributos: newGardenStatus[x].attributes,
                            estado: newGardenStatus[x].state,
                            fecha: newGardenStatus[x].date
                        })
                        const seriallized = JSON.stringify(parsed)
                        const result = await db.runAsync('UPDATE usuarios SET historial_estados_huertos = ? WHERE id = ?', seriallized, clients[i].id)
                        const toastObj: ToastData = {
                            type: 'success',
                            text1: 'Ok',
                            text2: 'Los estados se ha registrado exitosamente',
                            text1Style: { fontSize: 18 },
                            text2Style: { fontSize: 15 },
                        }
                        getToastData(toastObj)
                        didUnmount()
                        break;
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
        // try {
        //     const response = await axios.post('http://192.168.0.18:3000/tech/registrar/estados', newGardenStatus)
        //     if (response.status === 200) {
        //         const toastObj: ToastData = {
        //             type: 'success',
        //             text1: 'Ok',
        //             text2: 'Los estados se ha registrado exitosamente',
        //             text1Style: { fontSize: 18 },
        //             text2Style: { fontSize: 15 },
        //         }
        //         getToastData(toastObj)
        //         didUnmount()
        //     }
        // } catch (error) {
        //     console.error('Error al enviar los estados de los huertos', error)
        //     Toast.show({
        //         type: "error",
        //         text1: 'Error',
        //         text2: 'Algo salio mal al registrar los estados',
        //         text1Style: { fontSize: 18 },
        //         text2Style: { fontSize: 15 },
        //         position: 'bottom'
        //     })
        // }
    }

    const didUnmount = () => {
        setVisible(false)
        setNewGardenStatus([])
    }

    return (
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{ backgroundColor: '#ffffff', padding: 10 }}>
                <IconButton
                    icon="close"
                    iconColor='#777777'
                    size={20}
                    style={{ marginLeft: 'auto' }}
                    containerColor="#dddddd"
                    onPress={didUnmount}
                />

                {
                    newGardenStatus.length > 0 && (
                        <FlatList
                            data={clients}
                            renderItem={({ item, index }) => (
                                <View style={[{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderStyle: 'dotted', marginVertical: 8, borderRadius: 6, paddingVertical: 8, justifyContent: 'center' }, index % 2 == 0 && { backgroundColor: '#A0A0F9' }]}>
                                    <Text>{`${item.nombre} ${item.apellido.split(' ')[0]}`}</Text>
                                    <View>
                                        <Dropdown
                                            style={styles.dropdown}
                                            data={states}
                                            value={newGardenStatus[index].state}
                                            labelField="label"
                                            valueField="value"
                                            containerStyle={{ borderRadius: 10 }}
                                            onChange={item => {
                                                setNewGardenStatus(prev => {
                                                    const aux = [...prev]
                                                    aux[index] = { ...aux[index], state: item.value }
                                                    return aux
                                                })
                                            }}
                                            renderItem={(item) => {
                                                return (
                                                    <View style={{ flexDirection: 'row', gap: 10, padding: 8, alignItems: 'center' }}>
                                                        <View style={{ width: 30, height: 30, backgroundColor: item.color }}></View>
                                                        <Text>{item.label}</Text>
                                                    </View>
                                                )
                                            }}
                                        />
                                        <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
                                            <Chip selected={newGardenStatus[index].attributes.includes('V')} selectedColor='#6B4FA8' onPress={() => handleCheckItems('V', index)} mode='outlined'>V</Chip>
                                            <Chip selected={newGardenStatus[index].attributes.includes('F')} selectedColor='#6B4FA8' onPress={() => handleCheckItems('F', index)} mode='outlined'>F</Chip>
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                    )
                }
                <Button icon='playlist-edit' mode='contained' onPress={handleSendData} style={{ width: 160, marginHorizontal: 'auto', marginVertical: 40 }}>Registrar</Button>
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        width: 180,
        margin: 16,
        height: 36,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
})

export default RegisterStateModal