import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View, Dimensions, FlatList, } from 'react-native'
import { Button, Card, Text, List, Icon, Divider, IconButton } from 'react-native-paper';
import { AuthProps, ClientProps, GardenProps, ReportProps } from '../../../interfaces/user';
import { getUserData } from '../../../storage/auth';
import ReportModal from '../../../components/ReportModal';
import Toast from 'react-native-toast-message';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios'
import SuggestionsModal from '../../../components/SuggestionsModal';

type States = 'features' | 'suggestions' | 'nutrition' | 'pests'

type RootStackParamList = {
  Detalles: { garden: GardenProps, client: ClientProps }; // Define el tipo de `garden` si lo conoces
};

type DetallesProps = NativeStackScreenProps<RootStackParamList, 'Detalles'>;

const GardenDetail = ({ route }: DetallesProps) => {
  const { garden } = route.params;
  const { client } = route.params;
  const [user, setUser] = useState<null | AuthProps>(null)
  const [tab, setTab] = useState<States>('suggestions');
  const [report, setReport] = useState(false)
  const [suggestions, setSuggestions] = useState(garden.recomendaciones)
  const [suggestionsModal, setSuggestionsModal] = useState(false)

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const getData = async () => {
      const data = await getUserData();
      setUser(data)
    }

    getData()
  }, [])

  const toggleButton = (value: States) => {
    setTab(value)
  }

  const deleteSuggestion = async (suggestion: string) => {
    console.log(garden.id)
    try {
      const response = await axios.delete('http://192.168.0.18:3000/tech/sugerencias', {
        params: {
          gardenId: garden.id,
          suggestion: suggestion
        }
      })
      if (response.status === 200) {
        setSuggestions(response.data.suggestions)
        Toast.show({
          type: "success",
          text1: 'Ok',
          text2: 'Sugerencia elminada correctamente correctamente',
          text1Style: { fontSize: 18 },
          text2Style: { fontSize: 15 },
        })
      }
    } catch (error) {
      console.error('Error al mandar la peticion delete de recomendaciones', error)
    }
  }

  return (
    <ScrollView nestedScrollEnabled contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1, paddingHorizontal: 10 }}>
      <Toast />
      <Text variant='titleLarge' style={{ marginHorizontal: 'auto', marginBottom: 20 }}>Detalle de: {garden.nombre}</Text>
      <View style={{ marginHorizontal: 'auto', gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10, height: 40 }}>
          <Button mode="contained" onPress={() => toggleButton('features')} style={StyleSheet.compose(
            { width: 150 },
            tab === 'features' && styles.selected
          )}>
            Características
          </Button>
          <Button mode="contained" onPress={() => toggleButton('suggestions')} style={StyleSheet.compose(
            { width: 150 },
            tab === 'suggestions' && styles.selected
          )}>
            Sugerencias
          </Button>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, height: 40 }}>
          <Button mode="contained" onPress={() => toggleButton('nutrition')} style={StyleSheet.compose(
            { width: 150 },
            tab === 'nutrition' && styles.selected
          )}>
            Nutrición
          </Button>
          <Button mode="contained" onPress={() => toggleButton('pests')} style={StyleSheet.compose(
            { width: 150 },
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
            <View style={{ gap: 20 }}>
              <Card>
                <Card.Title title="Sugerencias Generales" />
                <Card.Content>
                  {
                    suggestions.map((sug, i) => {
                      return (
                        <View>
                          <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                            <Icon source={"check"} size={20}></Icon><Text style={{ flexShrink: 1, textAlign: 'left' }}>{sug}</Text>
                            <IconButton icon='delete' size={20} iconColor='#ffffff' containerColor='#e80729' style={{ marginLeft: 'auto' }} onPress={() => deleteSuggestion(sug)} />
                          </View>
                          <Divider key={`Divider-${i}`} bold style={{ marginVertical: 6 }} />
                        </View>
                      )
                    })
                  }
                </Card.Content>
              </Card>
              <Button icon='plus' mode='outlined' onPress={() => setSuggestionsModal(true)} style={{ width: 250, marginHorizontal: 'auto' }}>Agregar sugerencias generales</Button>
            </View>
          )
        }
        {
          tab === 'nutrition' && (
            <View style={{ gap: 20 }}>
              <FlatList
                horizontal
                data={[{
                  labels: ['N', 'P', 'K', 'Ca', 'Mg', 'S', 'B', 'Zn', 'Mn', 'Mo'],
                  datasets: [
                    {
                      data: [
                        (Math.random() * 100).toFixed(1),
                        (Math.random() * 100).toFixed(1),
                        (Math.random() * 100).toFixed(1),
                        (Math.random() * 100).toFixed(1),
                        (Math.random() * 100).toFixed(1),
                        (Math.random() * 100).toFixed(1),
                        (Math.random() * 100).toFixed(1),
                        (Math.random() * 100).toFixed(1),
                        (Math.random() * 100).toFixed(1),
                        (Math.random() * 100).toFixed(1),
                      ]
                    }
                  ]
                }]}
                renderItem={({ item }) => (
                  <BarChart
                    yAxisSuffix=''
                    width={600}
                    height={220}
                    data={item}
                    yAxisLabel='%'
                    fromZero
                    showBarTops
                    showValuesOnTopOfBars
                    chartConfig={{
                      backgroundColor: "#e26a00",
                      backgroundGradientFrom: "#6a1b9a",
                      backgroundGradientTo: "#4a148c",
                      decimalPlaces: 2, // optional, defaults to 2dp
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      strokeWidth: 2,
                      barPercentage: 0.8,
                      fillShadowGradient: "#8e24aa",
                      fillShadowGradientOpacity: 1,
                      style: {
                        borderRadius: 16
                      },
                      propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                      }
                    }}
                    style={{
                      marginVertical: 8,
                      borderRadius: 16
                    }}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              >

              </FlatList>
              <View>
                <FlatList
                  data={garden.historial_fertilizante}
                  renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row' }}>
                      <Icon source="chevron-right" color='black' size={20} />
                      <Text style={{ flexShrink: 1 }}><Text style={{ fontWeight: 'bold' }}>{new Date(item.fecha).toLocaleDateString()}</Text>, se aplicó <Text style={{ fontWeight: 'bold' }}>{item.cantidad}Kg</Text> de la formula {item.formula.map((part, index) => (
                        <Text key={index} style={{ fontWeight: 'bold' }}>
                          {part}
                          {index < item.formula.length - 1 ? '-' : ''}
                        </Text>
                      ))} por árbol</Text>
                    </View>
                  )}
                  ListEmptyComponent={<Text variant='labelLarge'>No hay ningnua fertilización</Text>}
                  ListHeaderComponent={<Text variant='titleMedium'>Fertilizantes</Text>}
                />
                <Text style={{ marginTop: 10 }}>Pendientes de aplicar: <Text>{garden.fertilizaciones_pendientes.map((item, i, arr) => (
                  <Text key={i}>
                    {item}
                    {i < arr.length - 1 ? ',' : ''}
                  </Text>))}</Text></Text>
              </View>
              <Button icon='plus' mode='outlined' style={{ width: 250, marginHorizontal: 'auto', marginTop: 10 }}>Agregar fertilizante</Button>
            </View>
          )
        }
      </View>
      {/* ----- Buttons ----- */}
      <View style={{ marginTop: 20 }}>
        {
          user !== null && user.data.rol === 'tecnico' && tab === 'features' && (
            <Button icon='pencil' mode='elevated'>Modificar caracteristica</Button>
          )
        }
        {
          user !== null && user.data.rol === 'tecnico' && tab === 'pests' && (
            <View style={{ gap: 20 }}>
              <Button icon='plus' mode='elevated' onPress={() => setReport(true)} style={{ width: 200, marginHorizontal: 'auto' }}>Agregar reporte</Button>
            </View>
          )
        }
      </View>

      <ReportModal visible={report} setVisible={setReport} client={client} garden={garden} />

      {/* Suggestion Modal */}
      <SuggestionsModal visible={suggestionsModal} setVisible={setSuggestionsModal} garden={garden} />
    </ScrollView>
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