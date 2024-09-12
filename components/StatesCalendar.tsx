import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, FlatList, Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { CalendarProps, ClientProps } from '../interfaces/user';

const weeksNonLeapYear = {
  enero: ['1', '8', '15', '22', '29'],
  febrero: ['5', '12', '19', '26'],
  marzo: ['5', '12', '19', '26'],
  abril: ['2', '9', '16', '23', '30'],
  mayo: ['7', '14', '21', '28'],
  junio: ['4', '11', '18', '25'],
  julio: ['2', '9', '16', '23', '30'],
  agosto: ['6', '13', '20', '27'],
  septiembre: ['3', '10', '17', '24'],
  octubre: ['1', '8', '15', '22', '29'],
  noviembre: ['5', '12', '19', '26'],
  diciembre: ['3', '10', '17', '24', '31'],
};

const weeksLeapYear = {
  enero: ['1', '8', '15', '22', '29'],
  febrero: ['5', '12', '19', '26'],
  marzo: ['4', '11', '18', '25'],
  abril: ['1', '8', '15', '22', '29'],
  mayo: ['6', '13', '20', '27'],
  junio: ['3', '10', '17', '24'],
  julio: ['1', '8', '15', '22', '29'],
  agosto: ['5', '12', '19', '26'],
  septiembre: ['2', '9', '16', '23', '30'],
  octubre: ['7', '14', '21', '28'],
  noviembre: ['4', '11', '18', '25'],
  diciembre: ['2', '9', '16', '23', '30'],
};

interface StateCalendarProps {
  calendar: CalendarProps[]
  clients: ClientProps[]
}

type Estado = 'todo bien' | 'precaución' | 'cuidado con plagas' | 'mal estado';

interface Meses {
    enero: Estado[];
    febrero: Estado[];
    marzo: Estado[];
    abril: Estado[];
    mayo: Estado[];
    junio: Estado[];
    julio: Estado[];
    agosto: Estado[];
    septiembre: Estado[];
    octubre: Estado[];
    noviembre: Estado[];
    diciembre: Estado[];
}

const StatesCalendar = ({ calendar, clients}: StateCalendarProps) => {

  const leftRef = useRef<ScrollView>(null);
  const rightRef = useRef<ScrollView>(null);

  const leftColumnWidth = 150
  const headerHeight = 40;
  const borderColor = '#C1C0B9';
  const primaryColor = 'dodgerblue';
  const backgroundColor = '#F7F6E7';


  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

  const yearselected = new Date().getFullYear() % 4 === 0 ? weeksLeapYear : weeksNonLeapYear;
  const stateToColor = (state: string | null) => {
    let bgColor = ''
    switch (state) {
      case 'todo bien':
        bgColor = '#009929';
        break;
      case 'precaucion':
        bgColor = '#ebed17';
        break;
      case 'cuidado con plagas':
        bgColor = '#efa229';
        break;
      case 'mal estado':
        bgColor = '#e80729';
        break;
      default:
        bgColor = '#fff';
    }
    return bgColor
  }

  return (
    <View style={{ flexDirection: 'row', backgroundColor: '#eee' }}>
      <View style={{ width: leftColumnWidth, backgroundColor: 'yellow', borderWidth: 1, borderColor: borderColor }}>
        <View
          style={{
            height: headerHeight,
            backgroundColor: primaryColor,
            borderBottomWidth: 1,
            borderBottomColor: borderColor,
          }}
        ></View>
        {/* left column */}
        <ScrollView ref={leftRef} style={{ backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
          {

            clients.map((client, index) => (
              <Text key={index} style={[{ textAlign: 'center' }, index % 2 ? { height: 28 } : { backgroundColor, height: 28 }]}>{client.nombre}</Text>
            ))
          }
        </ScrollView>
      </View>
      {/* right column */}
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <ScrollView horizontal bounces>
          <View>
            <View style={{ borderWidth: 1, borderColor, borderStyle: 'solid', flexDirection: 'row' }}>
              {
                months.map((month, index) => (
                  <View key={index} style={{ height: 40, backgroundColor: primaryColor, width: 150, borderColor: 'black', borderStyle: 'solid', borderLeftWidth: 1, borderRightWidth: 1 }}>
                    <Text
                      key={index}
                      style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', textTransform: 'capitalize' }}
                    >
                      {month}
                    </Text>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      {
                        yearselected[month as keyof Meses].map((week: string, index: number, arr: string[]) => {
                          return (
                            <View key={index} style={{ flex: 1, flexDirection: 'row' }}>
                              <Text style={[{ flex: 1, textAlign: 'center', borderColor: 'white', borderTopWidth: 1, color: 'white' }, index !== arr.length - 1 ? { borderRightWidth: 1 } : null]}>{week}</Text>
                            </View>
                          )
                        })
                      }
                    </View>
                  </View>
                ))
              }
            </View>
            <ScrollView
              ref={rightRef}
              style={{ marginTop: -1 }}
              scrollEventThrottle={16}
              bounces={false}
              onScroll={(e) => {
                const { y } = e.nativeEvent.contentOffset
                leftRef.current?.scrollTo({ y, animated: false })
              }}
            >
              <View style={{ borderWidth: 1, borderColor, borderStyle: 'solid' }}>
                {calendar.map((client, index) => {
                  let weekCounter = 0
                  return (
                    <View key={index} style={[{ height: 28, backgroundColor: '#fff', width: 150, borderColor: 'black', borderStyle: 'solid', borderLeftWidth: 1, borderRightWidth: 1, flexDirection: 'row' }, index % 2 ? { backgroundColor: '#fff' } : { backgroundColor }]}>
                      {
                        months.map((month, monthIndex) => {

                          return (
                            <View key={monthIndex} style={{ flexDirection: 'row', borderLeftWidth: 1, borderRightWidth: 1, width: 150 }}>
                              {
                                client.meses[monthIndex].map((state, weekIndex) => {
                                  // Definir colores según el estado
                                  const bgColor = stateToColor(state)
                                  weekCounter++

                                  return (
                                    <View key={weekIndex} style={{ height: 28, flex: 1, backgroundColor: bgColor, borderWidth: 1, borderColor: '#e7e7e7', borderRadius: 5 }}>
                                    </View>
                                  );
                                })
                              }
                            </View>
                          )
                        })
                      }

                    </View>
                  )
                })
                }
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerCell: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  monthContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  monthHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  weekHeader: {
    width: 40,
    textAlign: 'center',
    marginVertical: 5,
  },
  clientCell: {
    width: 100,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  stateCell: {
    width: 40,
    height: 40,
    marginVertical: 5,
    borderRadius: 5,
  },
})

export default StatesCalendar;
