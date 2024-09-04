import { Pressable, View } from 'react-native'
import { IconButton, Portal, Modal, TextInput, Text, Button } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { GardenProps } from '../interfaces/user'
import { useRef, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios'

interface FertilizerModalProps {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    garden: GardenProps,
}


const FertilizerModal = ({ visible, setVisible, garden }: FertilizerModalProps) => {
    let otpInput = useRef(null);
    const [fertilization, setFertilization] = useState({
        product: "",
        date: new Date(),
        amount: 0,
        area: ""
    })
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);


    const onChange = (event: Event, selectedDate: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        setFertilization(prev => ({ ...prev, date: currentDate }))
        console.log(currentDate)
    };

    const showMode = (currentMode: string) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        console.log()
        showMode('date');
    };

    const postFertilizer = async () => {
        if (fertilization.product === '') {
            Toast.show({
                type: "info",
                text1: 'Algo falta...',
                text2: 'Fertilizante',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })

            return
        }

        const newfertilizer = {
            amount: fertilization.amount,
            formula: fertilization.product,
            date: fertilization.date
        }
        try {
            const response = await axios.post('http://192.168.0.18:3000/tech/fertilizantes', newfertilizer)
            console.log('respuesta de insertar un fertilizante', response.data)
            if (response.status === 201) {
                Toast.show({
                    type: 'success',
                    text1: 'Ok',
                    text2: 'El fertilizante se ha subido exitosamente',
                    text1Style: { fontSize: 18 },
                    text2Style: { fontSize: 15 },
                    position: 'bottom'
                })
                setVisible(false)
            }
        } catch (error) {
            console.error('Error al enviar fertilizante', error)
            Toast.show({
                type: "error",
                text1: 'Error',
                text2: 'Algo salio mal al agregar el fertilizante',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
                position: 'bottom'
            })
        }
    }

    return (
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)} style={{ backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 40 }}>
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 25 }}>
                        <Text variant='labelLarge'>Formula:</Text>
                        <TextInput
                            style={{ width: 170 }}
                            value={fertilization.product}
                            onChangeText={text => setFertilization(prev => ({ ...prev, product: text }))}
                        />

                    </View>
                    <View style={{ position: 'relative' }}>
                        <Pressable onPress={showDatepicker} style={{ backgroundColor: 'transparent', width: '100%', height: '100%', position: 'absolute', zIndex: 2 }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: 170 }}>
                            <Text style={{ width: 80 }} variant='labelLarge'>Fecha: </Text>
                            <TextInput
                                value={fertilization.date.toLocaleDateString()}
                                style={{ width: '100%' }}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <Text variant='labelLarge'>Cantidad:</Text>
                        <TextInput
                            keyboardType='numbers-and-punctuation'
                            value={fertilization.amount.toString()}
                            onChangeText={(text) => setFertilization(prev => ({ ...prev, amount: Number(text) }))}
                            style={{ width: 170 }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 45 }}>
                    <Text variant='labelLarge'>Área:</Text>
                        <Picker
                        style={{width: 170}}
                            selectedValue={fertilization.area}
                            onValueChange={(itemValue, itemIndex) =>
                                setFertilization(prev => ({...prev, area: itemValue}))
                            }>
                            <Picker.Item label="Árbol" value="arbol" />
                            <Picker.Item label="Hectárea" value="hectarea" />
                            <Picker.Item label="Huerto" value="huerto" />
                        </Picker>
                    </View>

                    <Button icon='archive-edit' mode='contained' onPress={postFertilizer} style={{ width: 270, marginHorizontal: 'auto', marginTop: 20 }}>Agregar fertilizante</Button>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={fertilization.date}
                            mode='date'
                            is24Hour={true}
                            onChange={onChange}
                        />
                    )}
                </View>
                <Toast position='bottom' />
            </Modal>
        </Portal>
    )
}

export default FertilizerModal