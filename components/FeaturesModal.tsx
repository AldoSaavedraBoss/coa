import React, { useEffect, useState } from 'react'
import { Button, IconButton, Modal, Portal, TextInput } from 'react-native-paper'
import { GardenFeatures, GardenProps } from '../interfaces/user'
import { BackHandler, FlatList, View } from 'react-native'
import axios from 'axios'
import Toast from 'react-native-toast-message'

interface FeaturesModalProps {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    garden: GardenProps,
}

// cobertura: string
//   densidad: string
//   edad: string
//   superficie: string
//   tipo_suelo: string
//   ubicacion: string
//   variedad: string
const FeaturesModal = ({ visible, setVisible, garden }: FeaturesModalProps) => {
    const [featuresState, setFeaturesState] = useState(garden.caracteristicas)
    // const [densidad, setDensidad] = useState(features.densidad)
    // const [edad, setEdad] = useState(features.edad)
    // const [superficie, setSuperficie] = useState(features.superficie)
    // const [suelo, setSuelo] = useState(features.tipo_suelo)
    // const [ubicacion, setUbicacion] = useState(features.ubicacion)
    // const [variedad, setVariedad] = useState(features.variedad)

    const handleBackButton = () => {
        if (visible) {
            console.log('entro 2')
            setVisible(false);
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

    const putFeatures = async () => {
        try {
            const response = await axios.put('http://192.168.0.18:3000/tech/caracteristicas', {
                gardenId: garden.id,
                newFeatures: featuresState
            });
            if (response.status === 200) {
                setVisible(false)
                Toast.show({
                    type: "success",
                    text1: 'Ok',
                    text2: 'Sugerencias subidas correctamente',
                    text1Style: { fontSize: 18 },
                    text2Style: { fontSize: 15 },
                })
            }
        } catch (error) {
            console.error('Error al publicar sugerencias generales', error);
            Toast.show({
                type: "error",
                text1: 'Algo fallo...',
                text2: 'Error al subir las sugerencias',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })
        }
    }

    return (
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)} style={{ backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 40 }}>
                <View style={{gap: 10}}>
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
                <TextInput
                    label='Cobertura'
                    value={featuresState.cobertura}
                    onChangeText={(text) => setFeaturesState(prev => ({ ...prev, cobertura: text }))}
                />
                <TextInput
                    label='Densidad'
                    value={featuresState.densidad}
                    onChangeText={(text) => setFeaturesState(prev => ({ ...prev, densidad: text }))}
                />
                <TextInput
                    label='Edad'
                    value={featuresState.edad}
                    onChangeText={(text) => setFeaturesState(prev => ({ ...prev, edad: text }))}
                />
                <TextInput
                    label='Superficie'
                    value={featuresState.superficie}
                    onChangeText={(text) => setFeaturesState(prev => ({ ...prev, superficie: text }))}
                />
                <TextInput
                    label='Tipo de suelo'
                    value={featuresState.tipo_suelo}
                    onChangeText={(text) => setFeaturesState(prev => ({ ...prev, tipo_suelo: text }))}
                />
                <TextInput
                    label='Ubicación'
                    value={featuresState.ubicacion}
                    onChangeText={(text) => setFeaturesState(prev => ({ ...prev, ubicacion: text }))}
                />
                <TextInput
                    label='Variedad'
                    value={featuresState.variedad}
                    onChangeText={(text) => setFeaturesState(prev => ({ ...prev, variedad: text }))}
                />

                <Button icon='archive-edit' mode='contained' onPress={putFeatures} style={{width: 270, marginHorizontal: 'auto', marginTop: 20}}>Actualizar caracteristicas</Button>
                </View>
                <Toast/>
            </Modal>
        </Portal>
    )
}

export default FeaturesModal