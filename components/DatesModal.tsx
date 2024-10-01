import { View, StyleSheet, Pressable } from 'react-native'
import { Portal, Modal, IconButton, Button, Text, TextInput } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import { ClientProps, GardenProps, ToastData } from '../interfaces/user'
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import db from '../SQLite/createTables'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface DatesModalProps {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    clients: ClientProps[],
    getToastData: (toastObj: ToastData) => void,
    tecnico_id: string
}

const DatesModal = ({ visible, setVisible, clients, getToastData, tecnico_id }: DatesModalProps) => {

    const [form, setForm] = useState({
        clientId: '',
        lastname: '',
        date: new Date(),
        gardenId: '',
        name: '',
        tecnicoId: tecnico_id
    })
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [gardens, setGardens] = useState<GardenProps[]>([])


    const onChangeDate = (event: Event, selectedDate: Date | null) => {
        if (selectedDate) {
            setForm(prev => ({ ...prev, date: selectedDate }));
            setShowDatePicker(false);
            setShowTimePicker(true); // Muestra el selector de tiempo después de seleccionar la fecha
        }
    };

    useEffect(() => {
        setForm(prev => ({ ...prev, tecnicoId: tecnico_id }))
    }, [tecnico_id])

    const onChangeTime = (event: any, selectedTime: any) => {
        if (selectedTime) {
            const currentDate = new Date(form.date);
            currentDate.setHours(selectedTime.getHours());
            currentDate.setMinutes(selectedTime.getMinutes());

            setForm(prev => ({ ...prev, date: currentDate }));
            setShowTimePicker(false); // Cierra el selector de tiempo
        }
    };

    const didUnmount = () => {
        setForm({
            clientId: '',
            lastname: '',
            date: new Date(),
            gardenId: '',
            name: '',
            tecnicoId: ''
        })
        setGardens([])
        setVisible(false)
    }

    useEffect(() => {
        const getGardens = async () => {
            if (form.clientId === '') return
            try {

                db.transaction(tx => {
                    tx.executeSql("SELECT * FROM huertos WHERE cliente_id = ?", [form.clientId], (tr, res) => {
                        console.log('huertos del cliente', res.rows._array)

                        if (res.rows._array.length > 0) {
                            const aux: GardenProps[] = res.rows._array.map(garden => ({
                                ...garden,
                                caracteristicas: JSON.parse(garden.caracteristicas),
                                fertilizaciones_pendientes: JSON.parse(garden.fertilizaciones_pendientes),
                                historial_estados: JSON.parse(garden.historial_estados),
                                historial_fertilizantes: JSON.parse(garden.historial_fertilizantes),
                                recomendaciones: JSON.parse(garden.recomendaciones)
                            }))
                            setGardens(aux)
                        }
                    })
                })


            } catch (error) {
                console.error(error)
            }
        }

        //     try {
        //         const response = await axios.get(`http://192.168.0.18:3000/gardens/${form.clientId}`)

        //         if (response.status === 200) setGardens(response.data)
        //     } catch (error) {

        //     }
        // }

        // Ejecutar la función solo si hay un clientId
        if (form.clientId) {
            getGardens()
        }
    }, [form.clientId])

    const bookingDate = async () => {
        console.log('formulario', form.clientId, form.date, form.gardenId, form.tecnicoId)
        if (!form.clientId || !form.date || !form.gardenId || !form.tecnicoId) {
            Toast.show({
                text1: 'Algo falta',
                text2: 'Completa los campos',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
                type: 'info'
            })
            return
        }
        const newDate = {
            lastname: form.lastname,
            clientId: form.clientId,
            date: form.date,
            gardenId: form.gardenId,
            name: form.name,
            tecnicoId: form.tecnicoId
        }
        try {
            const id = uuidv4()
            const result = await db.execAsync([{sql: "INSERT INTO citas (id, cliente_id, fecha, huerto_id, tecnico_id, nombre, apellido) VALUES(?,?,?,?,?,?,?)", args: [id, form.clientId, form.date.toString(), form.gardenId, form.tecnicoId, form.name, form.lastname]}], false)
            console.log('resultado insercion citas', result)
            // db.transaction(tx => {
            //     tx.executeSql("INSERT INTO citas (id, cliente_id, fecha, huerto_id, tecnico_id, nombre, apellido) VALUES(?,?,?,?,?,?,?)", [id, form.clientId, form.date.toString(), form.gardenId, form.tecnicoId, form.name, form.lastname], (tr, res) => {
            //         console.log('insertar cita', res.rowsAffected)
            //         if (res.rowsAffected > 0) {
            //             getToastData({
            //                 text1: 'OK',
            //                 text2: 'La cita se ha agendado con exito',
            //                 text1Style: { fontSize: 18 },
            //                 text2Style: { fontSize: 15 },
            //                 type: 'success'
            //             })
            //             setVisible(false)
            //         }
            //     }, (tr, error) => {
            //         console.error('Error al agendar cita', error)
            //         getToastData({
            //             type: "error",
            //             text1: 'Error',
            //             text2: 'Algo salio mal al agendar la cita',
            //             text1Style: { fontSize: 18 },
            //             text2Style: { fontSize: 15 }
            //         })
            //     })
            // })

        } catch (error) {

        }

        // try {
        //     const response = await axios.post('http://192.168.0.18:3000/tech/citas', newDate)

        //     if (response.status === 201) {
        //         getToastData({
        //             text1: 'OK',
        //             text2: 'La cita se ha agendado con exito',
        //             text1Style: { fontSize: 18 },
        //             text2Style: { fontSize: 15 },
        //             type: 'success'
        //         })
        //         setVisible(false)
        //     }
        // } catch (error) {
        //     console.error('Error al agendar cita', error)
        //     getToastData({
        //         type: "error",
        //         text1: 'Error',
        //         text2: 'Algo salio mal al agendar la cita',
        //         text1Style: { fontSize: 18 },
        //         text2Style: { fontSize: 15 }
        //     })
        // }
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

                <Dropdown
                    data={clients}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    itemContainerStyle={{ padding: 10 }}
                    labelField='nombre'
                    valueField='id'
                    value={form.clientId}
                    placeholder="Selecciona el cliente"
                    onChange={item => {
                        setForm(prev => ({ ...prev, clientId: item.id, name: item.nombre, lastname: item.apellido }))
                    }}
                    renderItem={(item) => <Text style={styles.textItem}>{item.nombre} {item.apellido}</Text>}
                />
                <Dropdown
                    data={gardens}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    itemContainerStyle={{ padding: 10 }}
                    labelField='nombre'
                    valueField='id'
                    value={form.clientId}
                    placeholder="Selecciona el huerto"
                    onChange={item => {
                        setForm(prev => ({ ...prev, gardenId: item.id }))
                    }}
                    renderItem={(item) => <Text style={styles.textItem}>{item.nombre}</Text>}
                />
                <View style={{ marginTop: 16, position: 'relative' }}>
                    <Pressable onPress={() => setShowDatePicker(true)} style={{ backgroundColor: 'transparent', width: '100%', height: '100%', position: 'absolute', zIndex: 2 }} />
                    <TextInput value={form.date.toLocaleString('es-MX')} readOnly />
                </View>

                <Button
                    icon='playlist-edit'
                    mode='contained'
                    onPress={bookingDate}
                    style={{ width: 160, marginHorizontal: 'auto', marginTop: 40 }}>
                    Agendar cita
                </Button>
                {showDatePicker && (
                    <DateTimePicker
                        testID="datePicker"
                        value={form.date}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}
                {showTimePicker && (
                    <DateTimePicker
                        testID="timePicker"
                        value={form.date}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={onChangeTime}
                    />
                )}
                <Toast position='bottom' />
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
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
        textTransform: 'capitalize'
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

export default DatesModal