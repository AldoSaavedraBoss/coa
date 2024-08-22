import React, { useEffect, useState } from 'react'
import { FlatList, Pressable, View, StyleSheet } from 'react-native'
import axios from 'axios'
import { ClientProps, GardenProps } from '../../../interfaces/user'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text } from 'react-native-paper';

type RootStackParamList = {
    ClientDetail: { client: ClientProps }; // Define el tipo de `garden` si lo conoces
};

type DetallesProps = NativeStackScreenProps<RootStackParamList, 'ClientDetail'>;

const ClientDetail = ({ route, navigation }: DetallesProps) => {
    const { client } = route.params;
    const [loading, setLoading] = useState(true)
    const [gardens, setGardens] = useState<GardenProps[]>([])

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`http://192.168.0.18:3000/gardens/${client.id}`)
                setGardens(response.data)
            } catch (error) {

            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    const handlePress = (garden: GardenProps) => {
        navigation.navigate('Detalles', { garden });
    };

    return (
        <View>
            {
                gardens ? (
                    <FlatList
                        data={gardens}
                        style={{marginHorizontal: 'auto'}}
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
                        }}
                    ></FlatList>
                ): null
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

export default ClientDetail