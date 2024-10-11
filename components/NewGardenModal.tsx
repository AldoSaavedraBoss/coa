import { ScrollView, View, StyleSheet } from 'react-native'
import { Portal, Modal, IconButton, Button, TextInput, Text } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { ClientProps, GardenProps, ToastData } from '../interfaces/user'
import db from '../SQLite/createTables'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Dropdown } from 'react-native-element-dropdown'
import { Formik } from 'formik'
import * as Yup from 'yup'

interface AddGardenModalProps {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    client: ClientProps,
    getToastData: (obj: ToastData) => void,
    getNewGarden: (garden: GardenProps) => void
}

const validationSchema = Yup.object().shape({
    cliente_id: Yup.string().required('No existe el productor'),
    superficie: Yup.string().required('Falta definir la superficie'),
    edad: Yup.string().required('Falta definir la edad'),
    ubicacion: Yup.string().required('Falta definir la ubicación'),
    asnm: Yup.string().required('Falta definir el ASNM'),
    densidad_poblacion: Yup.string().required('Falta definir la densidad'),
    marco_plantacion: Yup.string().required('Falta definir el marco de plantación'),
    variedad: Yup.string().required('Falta definir la variedad'),
    sistema: Yup.string().required('Falta definir el sistema de riego'),
    sugerencia: Yup.string(),
    estado_inicial: Yup.object().shape({
        estado: Yup.string().required('Falta definir el estado'),
        fecha: Yup.date().required('Falta fecha').typeError('No es una fecha valida')
    }),
    nombre: Yup.string().required('Falta nombre del huerto')
})

const NewGardenModal = ({ visible, setVisible, client, getToastData, getNewGarden }: AddGardenModalProps) => {
    // const [form, setForm] = useState()

    const addNewGarden = async (values: {
        cliente_id: string,
        superficie: string,
        edad: string,
        ubicacion: string,
        asnm: string,
        densidad_poblacion: string,
        marco_plantacion: string,
        variedad: string,
        sistema: string,
        sugerencia: string,
        estado_inicial: {
            estado: string,
            fecha: Date
        },
        nombre: string
    }) => {
        const features = [
            { nombre: values.nombre },
            { superficie: values.superficie },
            { eda: values.edad },
            { ubicacion: values.ubicacion },
            { asnm: values.asnm },
            { densidad_poblacion: values.densidad_poblacion },
            { marco_plantacion: values.marco_plantacion },
            { variedad: values.variedad },
            { sistema: values.sistema },
        ]
        const suggestion = values.sugerencia !== '' ? [values.sugerencia] : []
        try {
            const uuid = uuidv4()
            const result = await db.execAsync([{ sql: "INSERT INTO huertos (id, caracteristicas, fertilizaciones_pendientes, historial_estados, historial_fertilizantes, nombre, recomendaciones, cliente_id) VALUES (?,?,?,?,?,?,?,?)", args: [uuid, JSON.stringify(features), JSON.stringify([]), JSON.stringify(values.estado_inicial), JSON.stringify([]), values.nombre, JSON.stringify(suggestion), values.cliente_id] }], false)

            console.log('Se registro el huerto en sqlite', result[0])
            if (result[0]?.rowsAffected > 0) {
                {
                    getToastData({
                        type: "success",
                        text1: 'Ok',
                        text2: 'El huerto se ha agregado exitosamente',
                        text1Style: { fontSize: 18 },
                        text2Style: { fontSize: 15 },
                    })
                    const gardenResult = await db.execAsync([{sql: 'select * from huertos where id = ?', args: [uuid]}], true)
                    console.log('devolucion nuevo huerto', gardenResult[0].rows)
                    if (gardenResult[0].rows.length > 0) getNewGarden(gardenResult[0].rows[0])
                }
            }

        } catch (error) {
            console.error('Error al registrar huerto en sqlite', error)
            Toast.show({
                type: "error",
                text1: 'Error',
                text2: 'Algo salio mal al agregar el huerto',
                text1Style: { fontSize: 18 },
                text2Style: { fontSize: 15 },
            })
        }
    }

    // useEffect(() => {
    //     const getStatus = async () => {
    //         //{ estado: string, id: string, color: string }[] =
    //         const result = await db.execAsync([{sql: "SELECT * FROM estados_huerto;", args: []}], true)
    //         if (result[0].rows.lenght > 0) setStates(result[0].rows)
    //     }
    //     getStatus()
    // }, [])

    const states = [
        { label: 'Todo bien', color: '#009929', value: 'todo bien' },
        { label: 'Precaución', color: '#ebed17', value: 'precaucion' },
        { label: 'Cuidado con plagas', color: '#efa229', value: 'cuidado con plagas' },
        { label: 'Mal estado', color: '#e80729', value: 'mal estado' },
    ]

    const irrigationSystem = [
        { label: 'Riego', value: 'riego' },
        { label: 'Temporal', value: 'temporal' },
    ]

    return (
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)} style={{ backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 40 }}>
                <ScrollView>
                    <IconButton
                        icon="close"
                        iconColor='#777777'
                        size={20}
                        style={{ marginLeft: 'auto' }}
                        containerColor="#dddddd"
                        onPress={() => setVisible(false)}
                    />
                    <Text variant='labelLarge' style={{ marginBottom: 10, color: '#909090' }}>Los campos con * son obligatorios</Text>
                    <Formik
                        initialValues={{
                            cliente_id: client.id,
                            superficie: '',
                            edad: '',
                            ubicacion: '',
                            asnm: '',
                            densidad_poblacion: '',
                            marco_plantacion: '',
                            variedad: '',
                            sistema: '',
                            sugerencia: '',
                            estado_inicial: {
                                estado: '',
                                fecha: new Date()
                            },
                            nombre: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={addNewGarden}
                    >
                        {({ handleSubmit, values, handleChange, errors, setFieldValue }) => (
                            <View style={{ gap: 10 }}>

                                <View>
                                    <TextInput
                                        label='Nombre del huerto*'
                                        value={values.nombre}
                                        onChangeText={handleChange('nombre')}
                                    />
                                    {errors.nombre && <Text variant='labelMedium' style={{ color: 'red' }}>{errors.nombre}</Text>}
                                </View>
                                <View>
                                    <TextInput
                                        label={'Superficie (Hectáreas)*'}
                                        value={values.superficie}
                                        onChangeText={handleChange('superficie')}
                                    />
                                    {errors.superficie && <Text variant='labelMedium' style={{ color: 'red' }}>{errors.superficie}</Text>}
                                </View>
                                <View>
                                    <TextInput
                                        label={'Edad*'}
                                        value={String(values.edad)}
                                        onChangeText={text => setFieldValue('edad', text)}
                                        keyboardType='number-pad'
                                    />
                                    {errors.edad && <Text variant='labelMedium' style={{ color: 'red' }}>{errors.edad}</Text>}
                                </View>
                                <View>
                                    <TextInput
                                        label={'Ubicación*'}
                                        value={values.ubicacion}
                                        onChangeText={handleChange('ubicacion')}
                                    />
                                    {errors.ubicacion && <Text variant='labelMedium' style={{ color: 'red' }}>{errors.ubicacion}</Text>}
                                </View>
                                <View>
                                    <TextInput
                                        label={'ASNM (metros)*'}
                                        value={values.asnm}
                                        onChangeText={handleChange('asnm')}
                                    />
                                    {errors.asnm && <Text variant='labelMedium' style={{ color: 'red' }}>{errors.asnm}</Text>}
                                </View>
                                <View>
                                    <TextInput
                                        label={'Densidad de población (por hectárea)*'}
                                        value={values.densidad_poblacion}
                                        onChangeText={handleChange('densidad_poblacion')}
                                    />
                                    {errors.densidad_poblacion && <Text variant='labelMedium' style={{ color: 'red' }}>{errors.densidad_poblacion}</Text>}
                                </View>
                                <View>
                                    <TextInput
                                        label={'Marco de plantación*'}
                                        value={values.marco_plantacion}
                                        onChangeText={handleChange('marco_plantacion')}
                                    />
                                    {errors.marco_plantacion && <Text variant='labelMedium' style={{ color: 'red' }}>{errors.marco_plantacion}</Text>}
                                </View>
                                <View>
                                    <TextInput
                                        label={'Variedad*'}
                                        value={values.variedad}
                                        onChangeText={handleChange('variedad')}
                                    />
                                    {errors.variedad && <Text variant='labelMedium' style={{ color: 'red' }}>{errors.variedad}</Text>}
                                </View>
                                <View>
                                    <TextInput
                                        label={'Sugerencia'}
                                        value={values.sugerencia}
                                        onChangeText={handleChange('sugerencia')}
                                    />
                                    {errors.sugerencia && <Text variant='labelMedium' style={{ color: 'red' }}>{errors.sugerencia}</Text>}
                                </View>

                                <View>
                                    <Dropdown
                                        data={irrigationSystem}
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        labelField='label'
                                        valueField='value'
                                        value={values.sistema}
                                        placeholder="Sistema de riego"
                                        onChange={item => setFieldValue('sistema', item.value)}
                                        renderItem={(item) => {
                                            return (
                                                <View style={styles.item}>
                                                    <Text style={styles.textItem}>{item.label}</Text>
                                                </View>
                                            )
                                        }}
                                    />
                                    {errors.sistema && <Text variant='labelMedium' style={{ color: 'red' }}>{errors.sistema}</Text>}
                                </View>

                                <Dropdown
                                    data={states}
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    labelField={'label'}
                                    valueField='value'
                                    value={values.estado_inicial.estado}
                                    placeholder="Estado general de huerto"
                                    onChange={item => setFieldValue('estado_inicial', {
                                        estado: item.value,
                                        fecha: new Date()
                                    })}
                                    renderItem={(item) => {
                                        return (<View style={styles.item}>
                                            <View style={{ backgroundColor: item.color, width: 20, height: 20 }}></View>
                                            <Text style={styles.textItem}>{item.label}</Text>
                                        </View>)
                                    }}
                                />
                                <Button mode='contained' style={{ marginHorizontal: 'auto', width: 200 }} onPress={() => handleSubmit()}>Agregar huerto</Button>
                            </View>
                        )}
                    </Formik>
                </ScrollView>
                <Toast position='bottom' />
                <Toast position='bottom' />
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
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

export default NewGardenModal