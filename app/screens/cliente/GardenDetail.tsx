import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button, Card, Text, List, Icon, Portal, Modal } from 'react-native-paper';
import { AuthProps, ClientProps, GardenProps, ReportProps } from '../../../interfaces/user';
import { getUserData } from '../../../storage/auth';
import ReportModal from '../../../components/ReportModal';
import Toast from 'react-native-toast-message';
import axios from 'axios';

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
  const [reportDetail, setReportDetail] = useState(false)
 

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

  

  return (
    <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 40 }}>
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

      <ReportModal visible={report} setVisible={setReport} techData={user} client={client} garden={garden}/>

      
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