import React, { useState } from "react";
import { Portal, Modal, TextInput, IconButton, Button, Text } from "react-native-paper";
import * as Yup from 'yup'
import { Formik } from "formik";
import { View } from "react-native";
import db from "../SQLite/createTables";
import Toast from "react-native-toast-message";

interface ResetPassModalProps {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Debe ser un correo valido').required('El correo es obligatorio'),
    password: Yup.string().required('Debes introducir la nueva contraseña'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir').required('Debes confirmar la nueva contraseña')
})

const ResetPasswordModal = ({ visible, setVisible }: ResetPassModalProps) => {
    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)

    const handleClick = async (values: { email: string, password: string, confirmPassword: string }) => {
        const {email, password} = values
        try {
            const result = await db.execAsync([{sql: "select COUNT(*) as count from usuarios where email = ?", args: [email]}], true)
            console.log(result[0].rows[0].count)
            if(result[0].rows[0].count === 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'El email no existe',
                    text1Style: { fontSize: 18 },
                    text2Style: { fontSize: 15 },
                })
                return
            }
            const insert = await db.execAsync([{sql: "insert into usuarios"}])
        } catch (error) {
            
        }
    }

    return (
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{ backgroundColor: '#fff', padding: 10, maxWidth: 300, width: '100%', marginHorizontal: 'auto', borderRadius: 10 }}>
                <IconButton
                    icon="close"
                    iconColor='#777777'
                    size={20}
                    style={{ marginLeft: 'auto', marginBottom: 20 }}
                    containerColor="#dddddd"
                    onPress={() => setVisible(false)}
                />
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        confirmPassword: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleClick}
                >
                    {({ handleChange, handleSubmit, values, errors }) => (
                        <View style={{ gap: 10 }}>
                            <TextInput
                                label='Correo'
                                value={values.email}
                                onChangeText={handleChange('email')}
                                keyboardType="email-address"
                            />
                            {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                            <TextInput
                                label='Contraseña'
                                value={values.password}
                                onChangeText={handleChange('password')}
                                secureTextEntry={showPass ? false : true}
                                right={<TextInput.Icon onPress={() => setShowPass(prev => !prev)} icon={showPass ? 'eye-off' : 'eye'} />}
                            />
                            {errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
                            <TextInput
                                label='Escribe de nuevo la contraseña'
                                value={values.confirmPassword}
                                onChangeText={handleChange('confirmPassword')}
                                secureTextEntry={showPass ? false : true}
                                right={<TextInput.Icon onPress={() => setShowConfirmPass(prev => !prev)} icon={showConfirmPass ? 'eye-off' : 'eye'} />}
                            />
                            {errors.confirmPassword && <Text style={{ color: 'red' }}>{errors.confirmPassword}</Text>}
                            <Button mode="contained" onPress={handleSubmit} style={{ width: 110, marginHorizontal: 'auto', marginTop: 15 }}>Aceptar</Button>
                        </View>
                    )}
                </Formik>
                <Toast position="bottom"/>
            </Modal>
        </Portal>
    )
}

export default ResetPasswordModal