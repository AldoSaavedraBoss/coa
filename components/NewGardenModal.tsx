import { ScrollView, View, StyleSheet } from 'react-native'
import { Portal, Modal, IconButton, Button, TextInput, Text } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { ClientProps, GardenProps, ToastData } from '../interfaces/user'
import db from '../SQLite/createTables'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Dropdown } from 'react-native-element-dropdown'

interface AddGardenModalProps {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    client: ClientProps,
    getToastData: (obj: ToastData) => void,
    getNewGarden: (garden: GardenProps) => void
}

const NewGardenModal = ({ visible, setVisible, client, getToastData, getNewGarden }: AddGardenModalProps) => {
    const [form, setForm] = useState({
        cliente_id: client.id,
        caracteristica: '',
        valor_caracteristica: '',
        historial_estados: [{
            estado: '',
            fecha: new Date()
        }],
        nombre: ''
    })

    const addNewGarden = async () => {
        const arrFeature = [{ [form.caracteristica]: form.valor_caracteristica }]
        try {
            const uuid = uuidv4()
            const result = await db.execAsync([{ sql: "INSERT INTO huertos (id, caracteristicas, fertilizaciones_pendientes, historial_estados, historial_fertilizantes, nombre, recomendaciones, cliente_id) VALUES (?,?,?,?,?,?,?,?)", args: [uuid, JSON.stringify(arrFeature), JSON.stringify([]), JSON.stringify(form.historial_estados), JSON.stringify([]), form.nombre, JSON.stringify([]), form.cliente_id] }], false)

            console.log('Se registro el huerto en sqlite', result[0] ) 
            if(result[0]?.rowsAffected > 0) {
                {
                    getToastData({
                        type: "success",
                        text1: 'Ok',
                        text2: 'El huerto se ha agregado exitosamente',
                        text1Style: { fontSize: 18 },
                        text2Style: { fontSize: 15 },
                    })
                    const gardenResult = await db.execAsync([{sql: "SELECT * FROM huertos ORDER BY id DESC LIMIT 1", args: []}], true)
                    console.log('devolucion nuevo huerto',gardenResult[0].rows)
                    if (gardenResult[0].rows.length > 0 ) getNewGarden(gardenResult[0].rows[0])
                }
            }

        } catch (error) {
            console.error('Error al registrar huerto en sqlite', error)
            Toast.show({
                type: "error",
                text1: 'Error',
                text2: 'Algo salio mal al agregar el huerto',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })
        }
    }

    // useEffect(() => {
    //     const getStatus = async () => {
    //         //{ estado: string, id: string, color: string }[] =
    //         const result = await db.execAsync([{sql: "SELECT * FROM estados_huerto;", args: []}], true)
    //         if (result[0].rows.lenght > 0) setStates(result[0].rows)
    //     }
    //     getStatus()
    // }, [])

    const states = [
        { label: 'Todo bien', color: '#009929', value: 'todo bien' },
        { label: 'Precaución', color: '#ebed17', value: 'precaucion' },
        { label: 'Cuidado con plagas', color: '#efa229', value: 'cuidado con plagas' },
        { label: 'Mal estado', color: '#e80729', value: 'mal estado' },
    ]

    return (
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)} style={{ backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 40 }}>
                <ScrollView style={{ marginBottom: 50 }}>
                    <IconButton
                        icon="close"
                        iconColor='#777777'
                        size={20}
                        style={{ marginLeft: 'auto' }}
                        containerColor="#dddddd"
                        onPress={() => {
                            setVisible(false)
                            setForm({
                                cliente_id: client.id,
                                caracteristica: '',
                                valor_caracteristica: '',
                                historial_estados: [{
                                    estado: '',
                                    fecha: new Date()
                                }],
                                nombre: ''
                            })
                        }}
                    />
                    <View style={{ gap: 10 }}>
                        <TextInput
                            label='Nombre del huerto'
                            value={form.nombre}
                            onChangeText={text => setForm(prev => ({ ...prev, nombre: text }))}
                        />
                        <View style={{ gap: 10, flexDirection: 'row' }}>
                            <TextInput
                                label='Agregar Caracteristica'
                                value={form.caracteristica}
                                onChangeText={text => setForm(prev => ({ ...prev, caracteristica: text.trim() }))}
                                style={{ flex: 1 }}
                            />
                            <TextInput
                                label='Agregar Valor'
                                value={form.valor_caracteristica}
                                onChangeText={text => setForm(prev => ({ ...prev, valor_caracteristica: text.trim() }))}
                                style={{ flex: 1 }}
                            />
                        </View>

                        <Dropdown
                            data={states}
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            labelField={'label'}
                            valueField='value'
                            value={states[0]}
                            placeholder="Estado general de huerto"
                            onChange={item => setForm(prev => {
                                const aux = { ...prev }
                                aux.historial_estados[0].estado = item.value
                                return aux
                            })}
                            renderItem={(item) => {
                                return (<View style={styles.item}>
                                    <View style={{ backgroundColor: item.color, width: 20, height: 20 }}></View>
                                    <Text style={styles.textItem}>{item.label}</Text>
                                </View>)
                            }}
                        />
                    </View>
                </ScrollView>

                <Button mode='contained' style={{ marginHorizontal: 'auto', width: 200 }} onPress={addNewGarden}>Agregar huerto</Button>
                <Toast position='bottom' />
                <Toast position='bottom' />
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
    inputs: {
        borderRadius: 0
    },
    dropdown: {
        marginTop: 16,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
})

export default NewGardenModal