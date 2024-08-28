import React, { useEffect, useState } from 'react'
import { FlatList, Pressable, View, StyleSheet, ScrollView } from 'react-native'
import axios from 'axios'
import { ClientProps, GardenProps, ReportProps } from '../../../interfaces/user'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Card, Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ReportModal from '../../../components/ReportModal';

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
  const [selectedReport, setSelectedReport] = useState<ReportProps | null>(null)


  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://192.168.0.18:3000/gardens/${client.id}`)
        setGardens(response.data)
      } catch (error) {

      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

  const handlePress = (garden: GardenProps) => {
    navigation.navigate('Detalles', { garden, client });
  };

  const getReportHistory = async () => {
    try {
      const response = await axios.get(`http://192.168.0.18:3000/tech/reportes/${client.id}`)
      if (response.status === 200) {
        setReportsList(response.data)
        console.log('lista de reportes en clientdetail', response.data)
      }
    } catch (error) {
      console.error('Error al obtener los reportes', error)
      Toast.show({ type: 'error', text1: 'Error', text2: 'Error al obtener los reportes, inténtelo mas tarde', text1Style: { fontSize: 18 }, text2Style: { fontSize: 15 }, position: 'bottom' })
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {
        gardens ? (
          <FlatList
            data={gardens}
            style={{ marginHorizontal: 'auto', flex: 1 }}
            keyExtractor={client => client.id}
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

      <Button icon='format-list-bulleted' mode='elevated' onPress={getReportHistory} style={{ width: 200, marginHorizontal: 'auto' }}>Ver historial de reportes</Button>

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