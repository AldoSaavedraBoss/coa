import React, { useEffect, useState } from 'react'
import { View, Pressable, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native'
import { Text, Button, DataTable, Searchbar } from 'react-native-paper'
import { clearUserData, getUserData } from '../../../storage/auth';
import { AuthProps2, CalendarProps, ClientProps, DatesData, ToastData } from '../../../interfaces/user';
import axios from 'axios'
// import StateGardenModal from '../../../components/StateGardenModal';
import StatesCalendar from '../../../components/StatesCalendar';
import debounce from 'debounce';
import NewClientModal from '../../../components/NewClientModal';
import Toast from 'react-native-toast-message';
import DatesModal from '../../../components/DatesModal';
import RegisterStateModal from '../../../components/RegisterStateModal';
import db from '../../../SQLite/createTables'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import SafeView from '../../../components/SafeView';

type HomeState = 'profile' | 'producers'


const Home = ({ route, navigation }: { route: any, navigation: any }) => {
    const { id_user } = route.params || '';

    const [tab, setTab] = useState<HomeState>('profile')
    const [user, setUser] = useState<AuthProps2>({
        id: '',
        apellido: '',
        creacion: '',
        email: '',
        nombre: '',
        rol: '',
    })
    const [loading, setLoading] = useState(false)

    // useDrizzleStudio(db)

    const [clients, setClients] = useState<ClientProps[]>([])
    const [calendar, setCalendar] = useState<CalendarProps[]>([])
    const [dates, setDates] = useState<DatesData[]>([])
    const [newClients, setNewClients] = useState<ClientProps[]>([])
    const [newCalendar, setNewCalendar] = useState<CalendarProps[]>([])
    const [showDatesModal, setShowDatesModal] = useState(false)
    const [newClientModal, setNewClientModal] = useState(false)
    const [registerStateModal, setRegisterStateModal] = useState(false)
        ;
    // const [lastVisible, setLastVisible] = useState(null);
    // const [total, setTotal] = useState(0)

    const [searchQuery, setSearchQuery] = useState('');
    const [searchQueryList, setSearchQueryList] = useState('');


    // const getClients = async (uid: string) => {
    //     return await axios.get(`http://192.168.0.18:3000/tech/clients/${uid}`)
    // }

    // const getCalendar = async (uid: string) => {
    //     return await axios.get(`http://192.168.0.18:3000/tech/calendario/${uid}`)
    // }

    // const getDates = async (uid: string) => {
    //     return await axios.get(`http://192.168.0.18:3000/tech/citas`, {
    //         params: {
    //             tecnico: uid
    //         }
    //     })
    // }

    useEffect(() => {
        setLoading(true)

        const getData = async () => {
            try {
                const result = await db.execAsync([{ sql: "SELECT * from usuarios WHERE id = ?", args: [id_user] }], true)

                if (result[0].rows.length === 1) {
                    setUser(result[0]?.rows[0] as AuthProps2);
                    getClients(id_user)
                    getDates(id_user)
                }
                // await db.transactionAsync(async tx => {
                //     const result = await tx.executeSqlAsync(, [id_user])
                //     console.log('user', result.rows)
                //     if (result.rows.length === 1) {
                //         setUser(result.rows[0] as AuthProps2)
                //     }


                //     const resultClients = await tx.executeSqlAsync("SELECT * FROM usuarios WHERE tecnico_id = ?", [id_user])
                //     // console.log('usuarios', resultClients.rows)
                //     if (resultClients.rows.length > 0) setClients(resultClients.rows as ClientProps[])


                //     const resultDates = await tx.executeSqlAsync("SELECT * FROM citas WHERE tecnico_id= ?", [id_user])
                //     // console.log('citas', resultDates.rows)
                //     if (resultDates.rows.length > 0) setDates(resultDates.rows as DatesData[])
                    setLoading(false)

                // }, true)
            } catch (error) {
                console.error(error)
            }

            // let data: AuthProps = await getUserData();

            // if (!data) {
            //     data = await getUserData()

            // }
            // console.log('usuario data', data)
            // if (data) {
            //     setUser(data);
            //     getClients(data.uid)
            //     getDates(data.uid)

            // const [clientResponse, calendarResponse, datesResponse] = await Promise.all([
            //     getClients(data.uid),
            //     getCalendar(data.uid),
            //     getDates(data.uid)
            // ])

            // if (clientResponse.status === 200) setClients(clientResponse.data)
            // if (calendarResponse.status === 200) setCalendar(calendarResponse.data)
            // if (datesResponse.status === 200) setDates(datesResponse.data)
            // } else {
            //     console.error('No se pudieron obtener los datos del usuario')
            // }
        };

        getData();
    }, [])

    const getClients = async (id: string) => {
        
        try {
            const result = await db.execAsync([{ sql: "SELECT * FROM usuarios WHERE tecnico_id = ?", args: [id] }], true)
        console.log('clientes', result[0].rows)
        if(result[0]?.rows?.length > 0) {
            console.log('mas de uno')
            setClients(result[0].rows as ClientProps[])
        }
            // await db.transactionAsync(async tx => {
            //     console.log('antes')
            //     const result = await tx.executeSqlAsync("SELECT * FROM usuarios WHERE tecnico_id = ?", [id])
            //     console.log('clientes deben der muchos', result)
            //     if (result.rows.length > 0) setClients(result.rows as ClientProps[])
            // })
        } catch (error) {
            console.error(error)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al obtener los clientes'
            })
        }
    }

    const getDates = async (id: string) => {
        try {
            const result = await db.execAsync([{sql: "SELECT * FROM citas WHERE tecnico_id= ?", args: [id]}], true)
            console.log('citas', result)
            if(result[0].rows.length > 0) setDates(result[0].rows as DatesData[])
            // await db.transactionAsync(async tx => {
            //     const result = await tx.executeSqlAsync("SELECT * FROM citas WHERE tecnico_id= ?", [id])
            //     console.log('citas deben ser muchos', result)
            //     if (result.rows.length > 0) setDates(result.rows as DatesData[])
            // })
        } catch (error) {
            console.error(error)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Error al obtener las citas'
            })
        }
    }

    const logout = async () => {
        await clearUserData();
        navigation.navigate('Login')
    };

    const handlePress = (client: ClientProps) => {
        navigation.navigate('Huertos del cliente', { client });
    };


    // const from = page * itemsPerPage;
    // const to = Math.min((page + 1) * itemsPerPage, dataDB.length);

    useEffect(() => {
        const handleSearch = () => {
            if (searchQuery.trim() === '') {
                setNewClients(clients)
                setNewCalendar(calendar)
            } else {
                filterData()
            }
        }

        const debounceFilter = debounce(handleSearch, 200)
        debounceFilter()

        return () => {
            debounceFilter.clear()
        }
    }, [searchQuery, clients, calendar])



    const filterData = () => {
        const newCalendar2 = calendar.filter(client => client.name.toUpperCase().includes(searchQuery.toLocaleUpperCase()))
        const newClients2 = clients.filter(client => client.nombre.toUpperCase().includes(searchQuery.toUpperCase()))
        setNewCalendar(newCalendar2)
        setNewClients(newClients2)
    }

    const getNewClient = (client: ClientProps) => {
        setClients(prev => [...prev].concat(client))
    }

    const getToastData = (obj: ToastData) => {
        Toast.show({
            type: obj.type,
            text1: obj.text1,
            text2: obj.text2,
            text1Style: obj.text1Style,
            text2Style: obj.text2Style,
        })
    }

    return (
        <SafeView>
            <View style={{ flex: 1, padding: 20, paddingBottom: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* <Image source={{ uri: 'https://picsum.photos/200/300' }} /> */}
                    <Text variant='labelLarge' style={{ fontSize: 18 }}>{new Date().toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    })}</Text>
                    <Button mode='elevated' textColor='#007901' onPress={() => logout()}>Cerrar Sesión</Button>
                </View>
                <Text variant='headlineSmall'>ING. {user.nombre} {user.apellido}</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                    <Button mode={tab === 'profile' ? 'contained' : 'outlined'} onPress={() => setTab('profile')} style={{ width: 150 }}>Mi perfil</Button>
                    <Button mode={tab === 'producers' ? 'contained' : 'outlined'} onPress={() => setTab('producers')} style={{ width: 150 }}>Productores</Button>
                </View>
                <Searchbar
                    placeholder="Search"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={{ marginTop: 20 }}
                />
                {
                    tab === 'producers' && (
                        <View style={{ flex: 1 }}>
                            <FlatList
                                style={styles.clientsContainer}
                                data={newClients}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ gap: 16}}
                                keyExtractor={client => client.id}
                                renderItem={({ item }) => {
                                    return (
                                        <Pressable
                                            onPress={() => {
                                                handlePress(item)
                                            }}
                                            style={({ pressed }) => [
                                                {
                                                    backgroundColor: pressed ? '#005510' : '#009929'
                                                },
                                                styles.clientButton
                                            ]}>
                                            <Text style={styles.textClient}>{item.nombre}</Text>
                                        </Pressable>
                                    )
                                }}>

                            </FlatList>
                            <Button mode='outlined' onPress={() => setNewClientModal(true)} style={{ width: 230, marginHorizontal: 'auto', marginTop: 40 }}>Registrar nuevo productor</Button>
                        </View>
                    )
                }
                {
                    tab === 'profile' && (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row', gap: 20, flexWrap: 'wrap', marginVertical: 20, justifyContent: 'center' }}>
                                <View style={styles.meaningfulMarks}>
                                    <View style={{ width: 20, height: 20, backgroundColor: '#009929', borderRadius: 6 }}></View>
                                    <Text>Todo bien</Text>
                                </View>
                                <View style={styles.meaningfulMarks}>
                                    <View style={{ width: 20, height: 20, backgroundColor: '#ebed17', borderRadius: 6 }}></View>
                                    <Text>Precaución</Text>
                                </View>
                                <View style={styles.meaningfulMarks}>
                                    <View style={{ width: 20, height: 20, backgroundColor: '#efa229', borderRadius: 6 }}></View>
                                    <Text>Cuidado con plagas</Text>
                                </View>
                                <View style={styles.meaningfulMarks}>
                                    <View style={{ width: 20, height: 20, backgroundColor: '#e80729', borderRadius: 6 }}></View>
                                    <Text>Mal estado</Text>
                                </View>
                            </View>
                            {
                                loading ? <ActivityIndicator /> : (
                                    <StatesCalendar calendar={newCalendar} clients={newClients} dates={dates} />
                                )
                            }
                            {/* <Dates clients={clients}/> */}

                            <View style={{ gap: 16, marginTop: 'auto' }}>
                                <Button mode='outlined' onPress={() => setRegisterStateModal(true)} style={{ maxWidth: 260, marginHorizontal: 'auto' }}>Registrar estado de los huertos</Button>
                                <Button
                                    mode='outlined'
                                    onPress={() => setShowDatesModal(true)}
                                    style={{ maxWidth: 260, marginHorizontal: 'auto' }}
                                >Agendar cita
                                </Button>
                            </View>
                        </ScrollView>
                    )
                }
                {/* modal for looking garden state */}
                <RegisterStateModal visible={registerStateModal} setVisible={setRegisterStateModal} clients={clients} getToastData={getToastData} />
                {/* Modal for loking new client modal */}
                <NewClientModal visible={newClientModal} setVisible={setNewClientModal} techId={user.id} getNewClient={getNewClient} getToastData={getToastData} />
                <DatesModal visible={showDatesModal} setVisible={setShowDatesModal} clients={clients} getToastData={getToastData} tecnico_id={user.id} />
                <Toast position='bottom' />
            </View>
        </SafeView>
    )
}

const styles = StyleSheet.create({
    clientsContainer: {
        flexDirection: 'column',
        gap: 20,
        marginHorizontal: 'auto',
        marginTop: 20
    },
    clientButton: {
        paddingVertical: 6,
        width: 150,
        borderRadius: 8,
        shadowColor: '#000',
        elevation: 6,
        shadowRadius: 15,
        shadowOffset: { width: 1, height: 13 },
    },
    textClient: {
        color: 'white',
        fontSize: 24,
        fontWeight: '600',
        marginHorizontal: 'auto'
    },
    cellswidth: {
        width: 120,
        justifyContent: 'center',
    },
    stateColorDimensions: {
        width: 26,
        height: 26
    },
    textTitles: {
        borderStyle: 'solid',
        borderColor: 'red',
        flex: 1
    },
    meaningfulMarks: {
        flexDirection: 'row',
        gap: 8,
    }
})

export default Home

