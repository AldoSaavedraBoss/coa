import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthProps } from '../interfaces/user'

export const saveUserData = async (data: AuthProps) => {
  try {
    await AsyncStorage.setItem('@user_data', JSON.stringify(data))
  } catch (error) {
    console.error('Error al guardar datos:', error)
  }
}

export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem('@user_data')
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error al recuperar datos:', error)
    return null
  }
}

export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('@user_data')
  } catch (error) {
    console.error('Error al eliminar datos:', error)
  }
}
