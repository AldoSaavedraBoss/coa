import React from 'react'
import { Text, View} from 'react-native'
  

const GardenDetail = ({route}) => {
    const { huertoId } = route.params;
  return (
    <View>
        <Text>detalle de: {huertoId}</Text>
    </View>
  )
}

export default GardenDetail