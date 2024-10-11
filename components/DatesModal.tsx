import { View, StyleSheet, Pressable, FlatList, ScrollView } from 'react-native'
import { Portal, Modal, IconButton, Button, Text, TextInput, Chip, Searchbar, Divider } from 'react-native-paper'
import React, { Children, useEffect, useState } from 'react'
import { ClientProps, GardenProps, ToastData } from '../interfaces/user'
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import db from '../SQLite/createTables'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'debounce';

interface DatesModalProps {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    clients: ClientProps[],
    getToastData: (toastObj: ToastData) => void,
    tecnico_id: string
}

const DatesModal = ({ visible, setVisible, clients, getToastData, tecnico_id }: DatesModalProps) => {

    // const [form, setForm] = useState({
    //     clientId: '',
    //     lastname: '',
    //     date: new Date(),
    //     gardenId: '',
    //     name: '',
    //     tecnicoId: tecnico_id
    // })
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [date, setDate] = useState(new Date)
    const [gardens, setGardens] = useState<GardenProps[]>([])

    const [clientsList, setClientsList] = useState<ClientProps[]>(clients)
    const [clientsDated, setClientsDated] = useState<ClientProps[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    const onChangeDate = (event: Event, selectedDate: Date | null) => {
        if (selectedDate) {
            setDate(selectedDate)
            setShowDatePicker(false);
            // setShowTimePicker(true); // Muestra el selector de tiempo después de seleccionar la fecha
        }
    };


    // useEffect(() => {
    //     const getGardens = async () => {
    //         if (form.clientId === '') return
    //         try {

    //             db.transaction(tx => {
    //                 tx.executeSql("SELECT * FROM huertos WHERE cliente_id = ?", [form.clientId], (tr, res) => {
    //                     console.log('huertos del cliente', res.rows._array)

    //                     if (res.rows._array.length > 0) {
    //                         const aux: GardenProps[] = res.rows._array.map(garden => ({
    //                             ...garden,
    //                             caracteristicas: JSON.parse(garden.caracteristicas),
    //                             fertilizaciones_pendientes: JSON.parse(garden.fertilizaciones_pendientes),
    //                             historial_estados: JSON.parse(garden.historial_estados),
    //                             historial_fertilizantes: JSON.parse(garden.historial_fertilizantes),
    //                             recomendaciones: JSON.parse(garden.recomendaciones)
    //                         }))
    //                         setGardens(aux)
    //                     }
    //                 })
    //             })


    //         } catch (error) {
    //             console.error(error)
    //         }
    //     }

    //     //     try {
    //     //         const response = await axios.get(`http://192.168.0.18:3000/gardens/${form.clientId}`)

    //     //         if (response.status === 200) setGardens(response.data)
    //     //     } catch (error) {

    //     //     }
    //     // }

    //     // Ejecutar la función solo si hay un clientId
    //     if (form.clientId) {
    //         getGardens()
    //     }
    // }, [form.clientId])

    const bookingDate = async () => {
        if (clientsDated.length === 0 || !tecnico_id) {
            Toast.show({
                text1: 'Algo falta',
                text2: 'Completa los campos',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
                type: 'info'
            })
            return
        }


        const promises = clientsDated.map(async (client) => {
            const id = uuidv4()
            return db.execAsync([{ sql: "INSERT INTO citas (id, cliente_id, fecha, huerto_id, tecnico_id, nombre, apellido) VALUES(?,?,?,?,?,?,?)", args: [id, client.id, date.toString(), 'general', tecnico_id, client.nombre, client.apellido] }], false)
        })
        try {
            const result = await Promise.all(promises)
            console.log('promesas', result)

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
            console.error('Error al insertar citas', error);
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

    const addDatesList = (selectedClient: ClientProps) => {
        // Aquí podrías actualizar clientsList o realizar otra acción cuando se selecciona un cliente
        setClientsDated(prevState => {
            // Si el cliente ya está seleccionado, lo quitamos de la lista
            if (prevState.find(client => client.id === selectedClient.id)) {
                return prevState.filter(client => client.id !== selectedClient.id);
            }
            // Si no está seleccionado, lo agregamos
            return [...prevState, selectedClient];
        });
    };

    const onDismiss = () => {
        setClientsDated([])
        setVisible(false)
    }
    useEffect(() => {
        if (clients.length > 0) {
            setClientsList(clients);
        }
    }, [clients]);

    useEffect(() => {
        const handleSearch = () => {
            if (searchQuery.trim() === '') {
                setClientsList(clients)
            } else {
                filterData()
            }
        }

        const debounceFilter = debounce(handleSearch, 200)
        debounceFilter()

        return () => {
            debounceFilter.clear()
        }
    }, [searchQuery, clients])

    const filterData = () => {
        const clientsFiltered = clientsList.filter(client => client.nombre.toUpperCase().includes(searchQuery.toUpperCase()))

        setClientsList(clientsFiltered)
    }
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{ backgroundColor: '#ffffff', padding: 10 }}>
                <IconButton
                    icon="close"
                    iconColor='#777777'
                    size={20}
                    style={{ marginLeft: 'auto' }}
                    containerColor="#dddddd"
                    onPress={onDismiss}
                />
                <Searchbar
                    placeholder="Search"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={{ marginTop: 20 }}
                />
                {
                    clientsList.length > 0 && <FlatList
                        data={clientsList}
                        style={{ maxHeight: 150, marginTop: 10 }}
                        keyExtractor={clients => clients.id}
                        contentContainerStyle={{ gap: 10 }}
                        renderItem={({ item, index }) => {
                            const isSelected = clientsDated.some(client => client.id === item.id);
                            return (
                                <View style={{ height: 45 }}>
                                    <Chip key={item.id} selected={isSelected} style={{ width: 200 }} mode='outlined' onPress={() => addDatesList(item)}>{item.nombre} {item.apellido}</Chip>
                                </View>
                            )
                        }}
                    />
                }
                <View style={{ marginTop: 16, position: 'relative' }}>
                    <Pressable onPress={() => setShowDatePicker(true)} style={{ backgroundColor: 'transparent', width: '100%', height: '100%', position: 'absolute', zIndex: 2 }} />
                    <TextInput value={date.toLocaleDateString('es-MX')} readOnly />
                </View>

                <Button
                    icon='playlist-edit'
                    mode='contained'
                    onPress={bookingDate}
                    style={{ width: 160, marginHorizontal: 'auto', marginTop: 40 }}>
                    Agendar citas
                </Button>
                {showDatePicker && (
                    <DateTimePicker
                        testID="datePicker"
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}
                {/* {showTimePicker && (
                    <DateTimePicker
                        testID="timePicker"
                        value={form.date}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={onChangeTime}
                    />
                )} */}
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