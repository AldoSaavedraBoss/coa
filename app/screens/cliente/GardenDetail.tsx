import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Card, Text, List, Icon } from 'react-native-paper';
import { GardenProps } from '../../../interfaces/user';

type States = 'features' | 'suggestions' | 'nutrition' | 'pests'

type RootStackParamList = {
  Detalles: { garden: GardenProps }; // Define el tipo de `garden` si lo conoces
};

type DetallesProps = NativeStackScreenProps<RootStackParamList, 'Detalles'>;

const GardenDetail = ({ route }: DetallesProps) => {
  const { garden } = route.params;
  const [tab, setTab] = useState<States>('suggestions');

  const toggleButton = (value: States) => {
    setTab(value)
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 40 }}>
      <Text>detalle de: {garden.nombre}</Text>
      <View style={{ marginHorizontal: 'auto', gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button mode="contained" onPress={() => toggleButton('features')} style={StyleSheet.compose(
            {width: 150},
            tab === 'features' && styles.selected
          )}>
            Características
          </Button>
          <Button mode="contained" onPress={() => toggleButton('suggestions')} style={StyleSheet.compose(
            {width: 150},
            tab === 'suggestions' && styles.selected
          )}>
            Sugerencias
          </Button>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button mode="contained" onPress={() => toggleButton('nutrition')} style={StyleSheet.compose(
            {width: 150},
            tab === 'nutrition' && styles.selected
          )}>
            Nutrición
          </Button>
          <Button mode="contained" onPress={() => toggleButton('pests')} style={StyleSheet.compose(
            {width: 150},
            tab === 'pests' && styles.selected
          )}>
            Plagas y enfermedades
          </Button>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        {
          tab === 'features' && (
            <Card>
              <Card.Title title="Características" />
              <Card.Content>
                <Text> Superficie: {garden.caracteristicas.superficie} </Text>
                <Text> Edad: {garden.caracteristicas.edad}</Text>
                <Text> Variedad: {garden.caracteristicas.variedad}</Text>
                <Text> Ubicación: {garden.caracteristicas.ubicacion}</Text>
                <Text> Densidad: {garden.caracteristicas.densidad}</Text>
                <Text> Tipo de suelo: {garden.caracteristicas.tipo_suelo}</Text>
                <Text> Cobertura de cultivo: {garden.caracteristicas.cobertura}</Text>
              </Card.Content>
            </Card>)
        }
        {
          tab === 'suggestions' && (
            <Card>
              <Card.Title title="Sugerencias" />
              <Card.Content>
                {
                  garden.recomendaciones.map((sug, i) => {
                    return (
                      <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                        <Icon source={"check"} size={20}></Icon><Text >{sug}</Text>
                      </View>
                    )
                  })
                }
              </Card.Content>
            </Card>)
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  selected: {
    backgroundColor: '#9c8bf3',
    borderWidth: 2,
    borderColor: '#4f1ca4',
    borderStyle: 'solid'
  }
})

export default GardenDetail