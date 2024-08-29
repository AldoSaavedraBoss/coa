import React, { useEffect, useState } from 'react'
import { View, Image, Pressable, StyleSheet, FlatList } from 'react-native'
import { Text, Button } from 'react-native-paper'
import { clearUserData, getUserData } from '../../../storage/auth';
import { AuthProps, ClientProps } from '../../../interfaces/user';
import axios from 'axios'

type HomeState = 'profile' | 'producers'

const Home = ({ navigation }) => {
    const [tab, setTab] = useState<HomeState>('profile')
    const [user, setUser] = useState<null | AuthProps>(null)
    const [loading, setLoading] = useState(false)
    const [clients, setClients] = useState<ClientProps[]>([])

    const getClients = async (data: AuthProps) => {

        try {
            setLoading(true)
            const response = await axios.get(`http://192.168.0.18:3000/tech/clients/${data.uid}`)
            if (response.status === 200) {

                setClients(response.data)
            }
        } catch (error) {
            console.error('Error al obtener clientes', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getData = async () => {
            const data = await getUserData();
            setUser(data)
            getClients(data)
        }

        getData()
    }, [])

    const logout = async () => {
        await clearUserData();
        navigation.navigate('Login')
    };

    const handlePress = (client: ClientProps) => {
        console.log('datos que se mandan', client)
        navigation.navigate('Huertos del cliente', { client });
    };

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
                    renderItem={({item}) => {
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
                    <View>
                        
                    </View>
                )
            }
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
})

export default Home