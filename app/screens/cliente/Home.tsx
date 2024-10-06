import React, { useEffect, useState } from 'react'
import { Text, Pressable, View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper';
import { clearUserData, getUserData } from '../../../storage/auth';
import { AuthProps2, GardenProps } from '../../../interfaces/user';
import axios from 'axios';

const Home = ({ navigation }) => {
  const [user, setUser] = useState<AuthProps2>({
    id: '',
    apellido: '',
    creacion: '',
    email: '',
    nombre: '',
    rol: '',
  })
  const [gardens, setGardens] = useState<GardenProps[]>([])

  // useEffect(() => {
  //   const getData = async () => {
  //     const data = await getUserData();
  //     try {
  //       const response = await axios.get(`http://192.168.0.18:3000/gardens/${data?.uid}`, {
  //         headers: {
  //           Authorization: `Berear ${data?.token}`
  //         }
  //       })
  //       setGardens(response.data)
  //     } catch (error) {
  //       console.error('error al obtener huertos', error)
  //     }
  //     setUser(data)
  //   }

  //   getData()
  // }, [])

  const handlePress = (garden: GardenProps) => {
    navigation.navigate('Detalles', { garden });
  };

  const logout = async () => {
    await clearUserData();
    navigation.navigate('Login')
  };
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Bienvenido: {user?.data.nombre}</Text>
        {/* <Text style={styles.date}>{new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })}</Text> */}
        <Button mode='elevated' textColor='#007901' onPress={() => logout()}>Cerrar Sesión</Button>
      </View>
      <View style={styles.gardenContainer}>
        {
          gardens.map(garden => {
            return (
              <Pressable
                key={garden.id}
                onPress={() => {
                  handlePress(garden)
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? '#005510' : '#009929'
                  },
                  styles.gardenButton
                ]}>
                <Text style={styles.textGarden}>{garden.nombre}</Text>
              </Pressable>
            )
          })
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  gardenContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: 20,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -100 }],
  },
  gardenButton: {
    paddingVertical: 10,
    width: 200,
    height: 50,
    borderRadius: 8,
    shadowColor: '#000',
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },

  },
  textGarden: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    marginHorizontal: 'auto'
  },
  date: {
    fontSize: 18,
  }
})

export default Home