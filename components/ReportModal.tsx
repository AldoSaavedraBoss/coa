import React, { useEffect, useState } from "react"
import { Modal, Text, Portal, TextInput, Button, IconButton, HelperText } from "react-native-paper"
import { AuthProps, ClientProps, GardenProps, ReportProps } from "../interfaces/user"
import { ScrollView, View, StyleSheet } from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import Toast from 'react-native-toast-message';

interface ReportModalProps {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    techData: AuthProps | null,
    garden: GardenProps
    client: ClientProps
    data?: ReportProps | null
    setData?: React.Dispatch<React.SetStateAction<ReportProps | null>>
}

interface FormFields {
    nombre: string,
    huerto: string,
    fecha: string | Date,
    etapa: string,
    plagas: {
        plaga: string,
        ixs: number,
        accion: string,
        producto: string
    }[],
    enfermedades: {
        enfermedad: string,
        ixs: number,
        accion: string,
        producto: string
    }[],
    recomendaciones: string[],
    observaciones: string[],
    estado_general: string
}

const ReportModal = ({ visible, setVisible, techData, garden, client, data, setData }: ReportModalProps) => {
    const [form, setForm] = useState<FormFields>({
        nombre: data?.nombre ?? `${client.nombre} ${client.apellido}`,
        huerto: data?.nombre_huerto ?? garden.nombre,
        fecha: data?.fecha ?? new Date(),
        etapa: data?.etapa_fenologica ?? '',
        plagas: data?.plagas ?? [{
            plaga: '',
            ixs: 0,
            accion: '',
            producto: ''
        }],
        enfermedades: data?.enfermedades ?? [{
            enfermedad: '',
            ixs: 0,
            accion: '',
            producto: ''
        }],
        recomendaciones: data?.recomendaciones ?? [""],
        observaciones: data?.observaciones ?? [""],
        estado_general: data?.estado_general ?? ""
    })
    const generalState = [
        {
            value: 'Peligro',
            color: '#e80729'
        },
        {
            value: 'Precaucion',
            color: '#ebed17'
        },
        {
            value: 'Riesgo de plaga',
            color: '#f3b24a'
        },
        {
            value: 'Todo bien',
            color: '#5ccb5f'
        }]
    const [errors, setErrors] = useState<string[]>([])
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChangeDateTime = (event: any, selectedDate: Date | undefined) => {
        setShow(false);
        setForm(prev => ({ ...prev, date: selectedDate ?? new Date() }))
    };

    const showDateTimePicker = (currentMode: string) => {
        setShow(true);
        setMode(currentMode);
    };

    const addSuggestionField = () => {
        setForm(prevForm => ({
            ...prevForm,
            recomendaciones: [...prevForm.recomendaciones, '']
        }));
    };

    const addObservationField = () => {
        setForm(prevForm => ({
            ...prevForm,
            observaciones: [...prevForm.observaciones, '']
        }));
    };

    const didUnmount = () => {
        setData(null)
        setVisible(false)
    }

    const makeReport = async () => {
        setErrors([])
        if (form.etapa === '') {
            setErrors(prev => [...prev, "stage"])
            return
        }
        if (form.recomendaciones.join("") === '') {
            setErrors(prev => [...prev, "suggestions"])
            return
        }
        if (form.observaciones.join('') === '') {
            setErrors(prev => [...prev, "observations"])
            return
        }
        if (form.estado_general === '') {
            setErrors(prev => [...prev, "generalState"])
            return
        }
        const report = {
            agricultor_id: garden.cliente_id,
            enfermedades: form.enfermedades,
            estado_general: form.estado_general,
            etapa_fenologica: form.etapa,
            fecha: form.fecha,
            huerto_id: garden.id,
            observaciones: form.observaciones,
            plagas: form.plagas,
            recomendaciones: form.recomendaciones,
            nombre: form.nombre,
            nombre_huerto: form.huerto
        }
        console.log('reporte hecho', report)
        try {
            const response = await axios.post('http://192.168.1.14:3000/tech/reportes', report)
            console.log('respuesta de insertar un reporte', response.data)
            if (response.status === 201) {
                Toast.show({
                    type: 'success',
                    text1: 'Ok',
                    text2: 'El reporte se ha subido exitosamente',
                    text1Style: { fontSize: 18 },
                    text2Style: { fontSize: 15 },
                    position: 'bottom'
                })
                setVisible(false)
            }
        } catch (error) {
            console.error('Error al enviar reporte', error)
            Toast.show({
                type: "error",
                text1: 'Error',
                text2: 'Algo salio mal al subir el reporte',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
                position: 'bottom'
            })
        }
    }

    const editReport = () => {
        setVisible(false)
    }

    return (
        <Portal>
            <Toast />
            <Modal style={{ flex: 1, backgroundColor: '#fff' }} visible={visible} onDismiss={didUnmount}>
                <ScrollView style={{ paddingHorizontal: 10, paddingBottom: 20, marginTop: 10 }}>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date(form.fecha)}
                            // mode={mode}
                            is24Hour={true}
                            onChange={onChangeDateTime}
                        />
                    )}
                    <TextInput label={'Productor'} editable={false} value={form.nombre} style={StyleSheet.compose(styles.mainInputs, styles.inputs)} />
                    <TextInput label={'Huerto'} editable={false} value={form.huerto} style={styles.mainInputs} />
                    <TextInput label={'Fecha'} value={new Date(form.fecha).toLocaleDateString()} onPress={() => showDateTimePicker('date')} style={styles.mainInputs} />
                    <TextInput label={'Etapa Fenológica'} value={form.etapa} onChangeText={text => setForm(prev => ({ ...prev, etapa: text }))} error={errors.includes('stage')} />
                    <HelperText type="error" visible={errors.includes('stage')}>Debe incluir una etapa</HelperText>

                    <Text variant="titleLarge" style={{ marginVertical: 10, marginHorizontal: 'auto' }}>Plagas</Text>

                    {
                        form.plagas.map((item, i) => {
                            return (
                                <View key={i} style={styles.plagueContainer}>
                                    <TextInput label={'Plaga'} value={item.plaga} onChangeText={(text) => setForm(prev => {
                                        const updatedPests = [...prev.plagas]
                                        updatedPests[i].plaga = text
                                        return { ...prev, plagas: updatedPests }
                                    })} />
                                    <TextInput label={'I x S'} keyboardType="numeric" value={`${item.ixs}`} onChangeText={(text) => setForm(prev => {
                                        const updatedPests = [...prev.plagas]
                                        updatedPests[i].ixs = Number(text)
                                        return { ...prev, plagas: updatedPests }
                                    })} />
                                    <TextInput label={'Acción'} value={item.accion} onChangeText={(text) => setForm(prev => {
                                        const updatedPests = [...prev.plagas]
                                        updatedPests[i].accion = text
                                        return { ...prev, plagas: updatedPests }
                                    })} />
                                    <TextInput label={'Producto'} value={item.producto} onChangeText={(text) => setForm(prev => {
                                        const updatedPests = [...prev.plagas]
                                        updatedPests[i].producto = text
                                        return { ...prev, plagas: updatedPests }
                                    })} />
                                </View>
                            )
                        })
                    }
                    <Button icon="plus" mode="contained" onPress={() => setForm(prev => ({
                        ...prev,
                        plagas: [...prev.plagas, { plaga: '', ixs: 0, accion: '', producto: '' }]
                    }))}>Agregar plaga</Button>

                    <Text variant="titleLarge" style={{ marginVertical: 10, marginHorizontal: 'auto' }}>Enfermedades</Text>

                    {
                        form.enfermedades.map((item, i) => {
                            return (
                                <View key={i} style={styles.plagueContainer}>
                                    <TextInput label={'Enfermedad'} value={item.enfermedad} onChangeText={(text) => setForm(prev => {
                                        const updateDisease = [...prev.enfermedades]
                                        updateDisease[i].enfermedad = text
                                        return { ...prev, enfermedades: updateDisease }
                                    })} />
                                    <TextInput label={'I x S'} keyboardType="numeric" value={`${item.ixs}`} onChangeText={(text) => setForm(prev => {
                                        const updateDisease = [...prev.enfermedades]
                                        updateDisease[i].ixs = Number(text)
                                        return { ...prev, enfermedades: updateDisease }
                                    })} />
                                    <TextInput label={'Acción'} value={item.accion} onChangeText={(text) => setForm(prev => {
                                        const updateDisease = [...prev.enfermedades]
                                        updateDisease[i].accion = text
                                        return { ...prev, enfermedades: updateDisease }
                                    })} />
                                    <TextInput label={'Producto'} value={item.producto} onChangeText={(text) => setForm(prev => {
                                        const updateDisease = [...prev.enfermedades]
                                        updateDisease[i].producto = text
                                        return { ...prev, enfermedades: updateDisease }
                                    })} />
                                </View>
                            )
                        })
                    }
                    <Button icon="plus" mode="contained" onPress={() => setForm(prev => ({
                        ...prev,
                        enfermedades: [...prev.enfermedades, { enfermedad: '', ixs: 0, accion: '', producto: '' }]
                    }))}>Agregar enfermedad</Button>

                    <Text variant="titleLarge" style={{ marginVertical: 10, marginHorizontal: 'auto' }}>Recomendaciones</Text>

                    <View style={{ gap: 10 }}>
                        {
                            form.recomendaciones.map((item, i) => (
                                <TextInput
                                    key={`suggestion-${i}`}
                                    label={`Recomendación: ${i + 1}`}
                                    value={item}
                                    numberOfLines={2}
                                    multiline
                                    error={errors.includes('suggestions')}
                                    onChangeText={text => {
                                        const newSuggestions = [...form.recomendaciones]
                                        newSuggestions[i] = text
                                        setForm(prev => ({ ...prev, recomendaciones: newSuggestions }))
                                    }}
                                />
                            ))
                        }
                        <HelperText type="error" visible={errors.includes('suggestions')}>Debe incluir por lo menos una Recomendación</HelperText>
                    </View>

                    <IconButton
                        icon="plus"
                        mode="contained"
                        iconColor="#ffffff"
                        style={{ backgroundColor: '#8740a2', marginHorizontal: 'auto' }}
                        size={26}
                        onPress={addSuggestionField}
                    />

                    <Text variant="titleLarge" style={{ marginVertical: 10, marginHorizontal: 'auto' }}>Observaciones</Text>

                    <View style={{ gap: 10 }}>
                        {
                            form.observaciones.map((item, i) => (
                                <TextInput
                                    key={`observation-${i}`}
                                    label={`Observación: ${i + 1}`}
                                    value={item}
                                    numberOfLines={3}
                                    multiline
                                    error={errors.includes('observations')}
                                    onChangeText={text => {
                                        const newObservations = [...form.observaciones]
                                        newObservations[i] = text
                                        setForm(prev => ({ ...prev, observaciones: newObservations }))
                                    }}
                                />
                            ))
                        }
                        <HelperText type="error" visible={errors.includes('observations')}>Debe incluir por lo menos una Observación</HelperText>
                    </View>

                    <IconButton icon="plus" mode="contained" iconColor="#ffffff" style={{ backgroundColor: '#8740a2', marginHorizontal: 'auto' }} size={26} onPress={addObservationField} />

                    <Dropdown
                        data={generalState}
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        labelField='value'
                        valueField='value'
                        value={form.estado_general}
                        placeholder="Estado general de huerto"
                        onChange={item => {
                            setForm(prev => ({ ...prev, estado_general: item.value }))
                        }}
                        renderItem={(item) => {
                            return (<View style={styles.item}>
                                <View style={{ backgroundColor: item.color, width: 20, height: 20 }}></View>
                                <Text style={styles.textItem}>{item.jvalue}</Text>
                            </View>)
                        }}
                    />
                    <HelperText type="error" visible={errors.includes('generalState')} style={{ marginBottom: 16 }}>Selecciona un estado general del huerto</HelperText>

                    {
                        data === null ? (<Button icon='pencil-plus' textColor="#fff" onPress={makeReport} style={{ backgroundColor: '#8740a2', marginBottom: 10 }}>Hacer Reporte</Button>)
                            : (
                                <Button icon='pencil-plus' textColor="#fff" onPress={editReport} style={{ backgroundColor: '#8740a2', marginBottom: 10 }}>Editar Reporte</Button>
                            )
                    }

                </ScrollView>
            </Modal>
        </Portal>
    )
}
const styles = StyleSheet.create({
    plagueContainer: {
        borderColor: 'black',
        borderWidth: 1,
        borderStyle: 'solid',
        gap: 8,
        marginBottom: 20,
        padding: 4,
        borderRadius: 8
    },
    mainInputs: {
        marginBottom: 6
    },
    inputs: {
        borderRadius: 0
    },
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

export default ReportModal