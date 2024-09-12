import React, { useEffect, useState } from 'react'
import { View, Pressable, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { Text, Button, DataTable, Searchbar } from 'react-native-paper'
import { clearUserData, getUserData } from '../../../storage/auth';
import { AuthProps, CalendarProps, ClientProps } from '../../../interfaces/user';
import axios from 'axios'
import StateGardenModal from '../../../components/StateGardenModal';
import StatesCalendar from '../../../components/StatesCalendar';
import debounce from 'debounce';

type HomeState = 'profile' | 'producers'


const Home = ({ navigation }: { navigation: any }) => {
    const [tab, setTab] = useState<HomeState>('profile')
    const [user, setUser] = useState<null | AuthProps>(null)
    const [loading, setLoading] = useState(false)

    const [clients, setClients] = useState<ClientProps[]>([])
    const [calendar, setCalendar] = useState<CalendarProps[]>([])
    const [newClients, setNewClients] = useState<ClientProps[]>([])
    const [newCalendar, setNewCalendar] = useState<CalendarProps[]>([])
    const [stateModal, setStateModal] = useState(false)

    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([5, 10, 25]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );

    const [searchQuery, setSearchQuery] = useState('');


    const getClients = async (uid: string) => {
        return await axios.get(`http://192.168.0.18:3000/tech/clients/${uid}`)
    }

    const getCalendar = async (uid: string) => {
        return await axios.get(`http://192.168.0.18:3000/tech/calendario/${uid}`)
    }

    useEffect(() => {
        setLoading(false)
        const getData = async () => {
            try {
                let data: AuthProps = await getUserData();

                if (!data) {
                    data = await getUserData()

                }

                if (data) {
                    setUser(data);

                    const [clientResponse, calendarResponse] = await Promise.all([
                        getClients(data.uid),
                        getCalendar(data.uid)
                    ])

                    if (clientResponse.status === 200) setClients(clientResponse.data)
                    if (calendarResponse.status === 200) setCalendar(calendarResponse.data)
                } else {
                    console.error('No se pudieron obtener los datos del usuario')
                }
            } catch (error) {
                console.error('Error al obtener los datos del usuario', error);
            } finally {
                setLoading(false)
            }
        };

        getData();
    }, [])

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
        if (searchQuery.trim() === '') {
            console.log(clients)
            setNewClients(clients)
            setNewCalendar(calendar)
        } else {
            debounce(filterData, 400)
        }
    }, [searchQuery, clients, calendar])

    const filterData = () => {
        const newCalendar2 = calendar.filter(client => client.name === searchQuery)
        const newClients2 = clients.filter(client => client.nombre === searchQuery)
        setNewCalendar(newCalendar2)
        setNewClients(newClients2)
    }

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* <Image source={{ uri: 'https://picsum.photos/200/300' }} /> */}
                <Text variant='labelLarge' style={{ fontSize: 18 }}>{new Date().toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                })}</Text>
                <Button mode='elevated' textColor='#007901' onPress={() => logout()}>Cerrar Sesión</Button>
            </View>
            <Text variant='headlineSmall'>ING. {user?.data.nombre} {user?.data.apellidos}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                <Button mode={tab === 'profile' ? 'contained' : 'outlined'} onPress={() => setTab('profile')} style={{ width: 150 }}>Mi perfil</Button>
                <Button mode={tab === 'producers' ? 'contained' : 'outlined'} onPress={() => setTab('producers')} style={{ width: 150 }}>Productores</Button>
            </View>
            {
                tab === 'producers' && (<FlatList
                    style={styles.clientsContainer}
                    data={clients}
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

                </FlatList>)
            }
            {
                tab === 'profile' && (
                    <View >

                        <View style={{ flexDirection: 'row', gap: 20, flexWrap: 'wrap', marginVertical: 20 }}>
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
                                <View>
                                    <Searchbar
                                        placeholder="Search"
                                        onChangeText={setSearchQuery}
                                        value={searchQuery}
                                        style={{ marginBottom: 20 }}
                                    />
                                    <StatesCalendar calendar={newCalendar} clients={newClients} />
                                </View>
                            )
                        }
                    </View>
                )
            }
            {/* modal for seeing garden state */}
            <StateGardenModal visible={stateModal} setVisible={setStateModal} />
        </View>
    )
}

const styles = StyleSheet.create({
    clientsContainer: {
        flexDirection: 'column',
        gap: 20,
        marginHorizontal: 'auto',
        marginTop: 40
    },
    clientButton: {
        paddingVertical: 10,
        width: 200,
        height: 50,
        borderRadius: 8,
        shadowColor: '#000',
        elevation: 6,
        shadowRadius: 15,
        shadowOffset: { width: 1, height: 13 },
        marginVertical: 10

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

