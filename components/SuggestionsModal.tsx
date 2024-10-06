import React, { useEffect, useState } from 'react'
import { View, ScrollView, BackHandler } from 'react-native'
import Toast from 'react-native-toast-message';
import { IconButton, Button, TextInput, Modal, Portal } from 'react-native-paper'
import axios from 'axios';
import db from '../SQLite/createTables';
import { GardenProps } from '../interfaces/user';

interface SuggestionsModalProps {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    garden: GardenProps,
    getSuggestions: (obj: string[]) => void
}

const SuggestionsModal = ({ visible, setVisible, garden, getSuggestions }: SuggestionsModalProps) => {

    const [generalSuggestions, setGeneralSuggestions] = useState([''])

    const addSuggestionField = () => {
        setGeneralSuggestions(prev => [...prev, '']);
    };

    const postGeneralSuggestions = async () => {
        const newSuggestions = generalSuggestions.filter(sugg => sugg !== '')
        if (newSuggestions.length === 0) {
            Toast.show({
                type: "error",
                text1: 'Faltan datos',
                text2: 'Tienes haber por lo menos 1 sugerencia',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })
            return
        }
        const addSuggestions = garden.recomendaciones.concat(newSuggestions)
        console.log('adds',addSuggestions, JSON.stringify(addSuggestions))
        try {
            console.log('id huerto', garden.id)
            const result = await db.execAsync([{sql: "UPDATE huertos SET recomendaciones = ? WHERE id = ?", args: [JSON.stringify(addSuggestions), garden.id]}], false)
            console.log('actualizar huertos',result[0])
            if (result[0]?.rowsAffected > 0) {
                setGeneralSuggestions([''])
                getSuggestions(addSuggestions)
                Toast.show({
                    type: "success",
                    text1: 'Ok',
                    text2: 'Sugerencias subidas correctamente',
                    text1Style: { fontSize: 18 },
                    text2Style: { fontSize: 15 },
                })
            }
//             const updatedGarden = await db.getFirstAsync('SELECT recomendaciones FROM huertos WHERE id = ?', garden.id);
// console.log("Datos actualizados:", updatedGarden);
        } catch (error) {
            console.error(error)
        }
        // try {
        //     const response = await axios.post('http://192.168.0.18:3000/tech/sugerencias', {
        //         gardenId: garden.id,
        //         newSuggestions: newSuggestions
        //     });
        //     if (response.status === 200) {
        //         setGeneralSuggestions([''])
        //         Toast.show({
        //             type: "success",
        //             text1: 'Ok',
        //             text2: 'Sugerencias subidas correctamente',
        //             text1Style: { fontSize: 18 },
        //             text2Style: { fontSize: 15 },
        //         })
        //     }
        // } catch (error) {
        //     console.error('Error al publicar sugerencias generales', error);
        //     Toast.show({
        //         type: "error",
        //         text1: 'Algo fallo...',
        //         text2: 'Error al subir las sugerencias',
        //         text1Style: { fontSize: 18 },
        //         text2Style: { fontSize: 15 },
        //     })
        // }
    }

    const handleBackButton = () => {
        if (visible) {
            console.log('entro 2')
            setVisible(false);
            setGeneralSuggestions([''])
            return true; // Indica que hemos manejado el evento del botón de atrás
        }
        return false; // Deja que el comportamiento predeterminado del botón de atrás ocurra
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        // Limpia el event listener cuando el componente se desmonte
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, [visible]);
    return (
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)} style={{ backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 40 }}>
                <ScrollView >
                    <IconButton
                        icon="close"
                        iconColor='#777777'
                        size={20}
                        style={{ marginLeft: 'auto' }}
                        containerColor="#dddddd"
                        onPress={() => {
                            setVisible(false)
                            setGeneralSuggestions([''])
                        }}
                    />
                    <View style={{ gap: 10 }}>
                        {
                            generalSuggestions.map((item, i) => (
                                <TextInput
                                    key={`suggestion-${i}`}
                                    label={`Recomendación: ${i + 1}`}
                                    value={item}
                                    numberOfLines={2}
                                    multiline
                                    onChangeText={text => {
                                        const newSuggestions = [...generalSuggestions]
                                        newSuggestions[i] = text
                                        setGeneralSuggestions(newSuggestions)
                                    }}
                                />
                            ))
                        }
                    </View>
                </ScrollView>
                <IconButton
                    icon="plus"
                    mode="contained"
                    iconColor="#ffffff"
                    style={{ backgroundColor: '#8740a2', marginHorizontal: 'auto' }}
                    size={26}
                    onPress={addSuggestionField}
                />

                <Button onPress={postGeneralSuggestions}>Agregar recomendaciones</Button>
                <Toast position='bottom' />
            </Modal>
        </Portal>
    )
}

export default SuggestionsModal