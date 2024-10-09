import React, { useEffect, useState } from 'react'
import { FlatList, Pressable, View, StyleSheet, ScrollView } from 'react-native'
import axios from 'axios'
import { ClientProps, GardenProps, ReportProps, ToastData } from '../../../interfaces/user'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Card, Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ReportModal from '../../../components/ReportModal';
import NewGardenModal from '../../../components/NewGardenModal';
import db from '../../../SQLite/createTables';

type RootStackParamList = {
  ClientDetail: { client: ClientProps }; // Define el tipo de `garden` si lo conoces
};

type DetallesProps = NativeStackScreenProps<RootStackParamList, 'ClientDetail'>;

const ClientDetail = ({ route, navigation }: DetallesProps) => {
  const { client } = route.params;
  const [loading, setLoading] = useState(true)
  const [gardens, setGardens] = useState<GardenProps[]>([])
  const [reportsList, setReportsList] = useState<ReportProps[]>([])
  const [modalReport, setModalReport] = useState(false)
  const [newGardenModal, setNewGardenModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ReportProps | null>(null)


  useEffect(() => {
    const getData = async () => {
      try {
        const result = await db.execAsync([{sql: "SELECT * FROM huertos WHERE cliente_id = ?", args: [client.id]}], true)
        if (result[0].rows.length > 0) setGardens(() => {
          const aux: GardenProps[] = result[0].rows.map((garden: GardenProps) => ({
            ...garden,
            caracteristicas: JSON.parse(garden.caracteristicas),
            fertilizaciones_pendientes: JSON.parse(garden.fertilizaciones_pendientes),
            historial_fertilizantes: JSON.parse(garden.historial_fertilizantes),
            historial_estados: JSON.parse(garden.historial_estados),
            recomendaciones: JSON.parse(garden.recomendaciones)
          }))

          return aux
        })
      } catch (error) {
      }
      // try {
      //   const response = await axios.get(`http://192.168.0.18:3000/gardens/${client.id}`)
      //   setGardens(response.data)
      // } catch (error) {

      // } finally {
      //   setLoading(false)
      // }
    }
    getData()
  }, [])

  const handlePress = (garden: GardenProps) => {
    navigation.navigate('Detalles', { garden, client });
  };

  const getReportHistory = async () => {
    try {
      const result = await db.execAsync([{sql: "SELECT * FROM reportes WHERE agricultor_id = ?", args: [client.id]}], true)
      if (result[0].rows.length > 0) {
        setReportsList(() => {
          return result[0].rows.map((report: any) => ({
            ...report,
            enfermedades: JSON.parse(report.enfermedades),
            observaciones: JSON.parse(report.observaciones),
            plagas: JSON.parse(report.plagas),
            recomendaciones: JSON.parse(report.recomendaciones)
          }))
        })
      }
    } catch (error) {
      console.error('Error al obtener los reportes', error)
      Toast.show({ type: 'error', text1: 'Error', text2: 'Error al obtener los reportes, inténtelo mas tarde', text1Style: { fontSize: 18 }, text2Style: { fontSize: 15 }, position: 'bottom' })
    }
    // try {
    //   const response = await axios.get(`http://192.168.0.18:3000/tech/reportes/${client.id}`)
    //   if (response.status === 200) {
    //     setReportsList(response.data)
    //   }
    // } catch (error) {
    //   console.error('Error al obtener los reportes', error)
    //   Toast.show({ type: 'error', text1: 'Error', text2: 'Error al obtener los reportes, inténtelo mas tarde', text1Style: { fontSize: 18 }, text2Style: { fontSize: 15 }, position: 'bottom' })
    // }
  }

  const getToastData = (obj: ToastData) => {
    Toast.show({
      type: obj.type,
      text1: obj.text1,
      text2: obj.text2,
      text1Style: obj.text1Style,
      text2Style: obj.text2Style,
    })
  }

  const getNewGarden = (garden: GardenProps) => {
    const newGarden: GardenProps = {
      ...garden,
      caracteristicas: JSON.parse(garden.caracteristicas),
      fertilizaciones_pendientes: JSON.parse(garden.fertilizaciones_pendientes),
      historial_estados: JSON.parse(garden.historial_estados),
      historial_fertilizantes: JSON.parse(garden.historial_fertilizantes),
      recomendaciones: JSON.parse(garden.recomendaciones)
    }
    setGardens(prev => [...prev].concat(newGarden))
  }


  return (
    <View style={{ flex: 1 }}>
      {
        gardens ? (
          <FlatList
            data={gardens}
            style={{ marginHorizontal: 'auto', flex: 1 }}
            keyExtractor={garden => garden.id}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() => {
                    handlePress(item)
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? '#005510' : '#009929'
                    },
                    styles.clientButton
                  ]}>
                  <Text style={styles.textClient}>{item.nombre}</Text>
                </Pressable>
              )
            }}
          ></FlatList>
        ) : null
      }

      <View style={{ marginHorizontal: 'auto', gap: 12, marginTop: 10 }}>
        <Button icon='account-plus' mode='contained' onPress={() => setNewGardenModal(true)} style={{ width: 200 }}>Agregar nuevo huerto</Button>
        <Button icon='format-list-bulleted' mode='contained' onPress={getReportHistory} style={{ width: 200, marginBottom: 40 }}>Ver historial de reportes</Button>
      </View>

      {
        reportsList.length > 0 && (
          <View style={{ flex: 1 }}>
            <FlatList
              style={{ marginTop: 20 }}
              data={reportsList}
              renderItem={({ item, index }) => (
                <Card key={item.id} style={{ marginBottom: 20 }} onPress={() => {
                  setSelectedReport(item)
                  setModalReport(true)
                }}>
                  <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text>{index + 1}</Text>
                      <Text variant='labelLarge'>{new Date(item.fecha).toLocaleDateString()}</Text>
                      <Text>{item.nombre_huerto}</Text>
                    </View>
                    <Text>Ver detalles</Text>
                  </Card.Content>
                </Card>
              )}
            />
          </View>
        )
      }

      <ReportModal visible={modalReport} setVisible={setModalReport} client={client} data={selectedReport} setData={setSelectedReport} />
      <NewGardenModal visible={newGardenModal} setVisible={setNewGardenModal} client={client} getToastData={getToastData} getNewGarden={getNewGarden} />
    </View>
  )
}

const styles = StyleSheet.create({
  clientsContainer: {
    flexDirection: 'column',
    gap: 20,
    marginHorizontal: 'auto',
    marginTop: 40
  },
  clientButton: {
    paddingVertical: 10,
    width: 200,
    height: 50,
    borderRadius: 8,
    shadowColor: '#000',
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },
    marginVertical: 10

  },
  textClient: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    marginHorizontal: 'auto'
  },
})

export default ClientDetail