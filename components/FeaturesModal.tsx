import React, { useEffect, useState } from 'react'
import { Button, IconButton, Modal, Portal, TextInput } from 'react-native-paper'
import { GardenFeatures, GardenProps } from '../interfaces/user'
import { BackHandler, FlatList, View } from 'react-native'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import db from '../SQLite/createTables'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'

interface FeaturesModalProps {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    characteristics: {
        key: string,
        value: string
    }[],
    garden: GardenProps,
    edit?: boolean,
    getFeatures: (feature: any) => void
}

const FeaturesModal = ({ visible, setVisible, characteristics, garden, edit = false, getFeatures }: FeaturesModalProps) => {
    console.log('modal', characteristics)
    const [featuresState, setFeaturesState] = useState(characteristics)
    const [newFeature, setNewFeature] = useState({
        key: '',
        value: ''
    })

    const arrayToObject = (arr: { key: string, value: any }[]) => {
        const newArr = arr.reduce((acc, cur) => {
            acc[cur.key] = cur.value
            return acc
        }, {} as { [key: string]: string })

        return newArr
    }

    const handleBackButton = () => {
        if (visible) {
            console.log('entro 2')
            setVisible(false);
            return true;
        }
        return false;
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, [visible]);


    const postPutFeatures = async () => {
        if (!edit) {
            const checkRepeated = garden.caracteristicas.some(item => Object.keys(item).some(key => key === newFeature.key))
            console.log('ckech', checkRepeated, garden.caracteristicas)
            if (!checkRepeated) garden.caracteristicas.push({ [newFeature.key]: newFeature.value })
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Caracteristica repetida',
                    text1Style: { fontSize: 18 },
                    text2Style: { fontSize: 15 },
                })
                return
            }
        }

        try {
            const result = await db.execAsync([{ sql: "UPDATE huertos SET caracteristicas = ? WHERE id = ?;", args: [JSON.stringify(garden.caracteristicas), garden.id] }], false)
            if (result[0]?.rowsAffected > 0) {
                const gardenResponse = await db.execAsync([{ sql: "SELECT caracteristicas FROM huertos WHERE id = ?", args: [garden.id] }], true)
                if (gardenResponse[0].rows.length > 0) {
                    getFeatures(JSON.parse(gardenResponse[0].rows[0].caracteristicas))
                Toast.show({
                    type: "success",
                    text1: 'Ok',
                    text2: 'Caracteristicas subidas correctamente',
                    text1Style: { fontSize: 18 },
                    text2Style: { fontSize: 15 },
                })
                }
            }
        } catch (error) {
            console.error(error)
            Toast.show({
                type: "error",
                text1: 'Algo fallo...',
                text2: 'Error al subir las caracteristicas',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })
        }
        // try {
        //     const url = 'http://192.168.0.18:3000/tech/caracteristicas';

        //     const data = edit ? {
        //         gardenId: garden_id,
        //         newFeatures: arrayToObject(featuresState)
        //     } : {
        //         gardenId: garden_id,
        //         key: newFeature.key,
        //         value: newFeature.value
        //     }

        //     const method = edit ? axios.put : axios.post

        //     const response = await method(url, data)

        //     if (response.status === 200) {
        //         setNewFeature({key: '', value: ''})
        //         Toast.show({
        //             type: "success",
        //             text1: 'Ok',
        //             text2: 'Caracteristicas subidas correctamente',
        //             text1Style: { fontSize: 18 },
        //             text2Style: { fontSize: 15 },
        //         })
        //         return
        //     }
        // } catch (error) {
        //     console.error('Error al publicar caracteristicas generales', error);
        //     Toast.show({
        //         type: "error",
        //         text1: 'Algo fallo...',
        //         text2: 'Error al subir las caracteristicas',
        //         text1Style: { fontSize: 18 },
        //         text2Style: { fontSize: 15 },
        //     })
        // }
    }

    const handleTextChange = (text: string, key: string) => {
        setFeaturesState(prevState =>
            prevState.map(item =>
                item.key === key ? { ...item, value: text } : item
            )
        );
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{ backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 40 }}>
                <View style={{ gap: 10 }}>
                    <IconButton
                        icon="close"
                        iconColor='#777777'
                        size={20}
                        style={{ marginLeft: 'auto' }}
                        containerColor="#dddddd"
                        onPress={() => {
                            setVisible(false)
                        }}
                    />
                    {
                        edit ? (
                            <FlatList
                                data={featuresState}
                                ItemSeparatorComponent={() => (
                                    <View style={{ height: 10 }}></View>
                                )}
                                style={{height: 200}}
                                keyExtractor={(item) => uuidv4()}
                                renderItem={({ item }) => (
                                    <TextInput
                                        label={item.key}
                                        value={item.value}
                                        onChangeText={(text) => handleTextChange(text, item.key)}
                                    />
                                )}
                            />
                        ) : (
                            <View style={{ gap: 20 }}>
                                <TextInput label='caracteristica' value={newFeature.key} onChangeText={(text) => setNewFeature(prev => ({ ...prev, key: text }))} />
                                <TextInput label='valor' value={newFeature.value} onChangeText={(text) => setNewFeature(prev => ({ ...prev, value: text }))} />
                            </View>
                        )
                    }

                    {
                        edit ? <Button icon='archive-edit' mode='contained' onPress={postPutFeatures} style={{ width: 270, marginHorizontal: 'auto', marginTop: 20 }}>Actualizar caracteristicas</Button> : <Button icon='plus-circle' mode='contained' onPress={postPutFeatures} style={{ width: 270, marginHorizontal: 'auto', marginTop: 20 }}>Agregar caracteristicas</Button>
                    }

                </View>
                <Toast />
            </Modal>
        </Portal>
    )
}

export default FeaturesModal