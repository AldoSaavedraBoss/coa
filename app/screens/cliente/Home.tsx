import React from 'react'
import { Text, Pressable, View, StyleSheet } from 'react-native'

const Home = ({navigation}) => {

  const handlePress = (huertoId: string) => {
    navigation.navigate('Detalles', { huertoId });
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text style= {{fontSize: 22, fontWeight: 'bold'}}>Bienvenido: aldo</Text>
      <Text style={styles.date}>{new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })}</Text>
      </View>
      <View style={styles.gardenContainer}>
        <Pressable
        onPress={() => {
          handlePress('1')
        }}
         style={({pressed}) => [
          {
            backgroundColor: pressed ? '#005510' : '#009929'
          },
          styles.gardenButton
        ]}>
          <Text style={styles.textGarden}>Huerto: 1</Text>
        </Pressable>
        <Pressable 
        onPress={() => {
          handlePress('2')
        }}
        style={({pressed}) => [
          {
            backgroundColor: pressed ? '#005510' : '#009929'
          },
          styles.gardenButton
        ]}>
          <Text style={styles.textGarden}>Huerto: 2</Text>
        </Pressable>
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
    transform: [{ translateX: -100 }, {translateY: -100}],
  },
  gardenButton: {
    paddingVertical: 10,
    width: 200,
    height: 50,
    borderRadius: 8,
    shadowColor: '#000',
    elevation: 6,
    shadowRadius: 15,
    shadowOffset : { width: 1, height: 13},
    
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