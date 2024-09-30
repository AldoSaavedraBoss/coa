import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { DataTable, Text, Tooltip } from 'react-native-paper';
import { CalendarProps, ClientProps, DatesData, Meses } from '../interfaces/user';
import { weeksLeapYear, weeksNonLeapYear } from '../lib/yearTypes';
import { weeksLeapYearStartToEnd, weeksNonLeapYearStartToEnd } from '../lib/calendar'
import { createClientObjects } from '../lib/calendarCalcs';

interface StateCalendarProps {
  calendar: CalendarProps[]
  clients: ClientProps[],
  dates: DatesData[]
}

const StatesCalendar = ({ clients, dates }: StateCalendarProps) => {
  const [numberOfItemsPerPageList] = useState([5, 10, 25]);
  const [itemsPerPage, setItemsPerPage] = useState(
    numberOfItemsPerPageList[0]
  );
  const [calendar, setCalendar] = useState([])
  const [page, setPage] = React.useState<number>(0);

  const leftRef = useRef<ScrollView>(null);
  const rightRef = useRef<ScrollView>(null);

  const leftColumnWidth = 150
  const headerHeight = 40;
  const borderColor = '#C1C0B9';
  const primaryColor = 'dodgerblue';
  const backgroundColor = '#F7F6E7';


  useEffect(() => {
    if (clients.length > 0) setCalendar(createClientObjects(clients))
  }, [clients])

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);


  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

  const yearselected = new Date().getFullYear() % 4 === 0 ? weeksLeapYear : weeksNonLeapYear;
  const rangeDates = new Date().getFullYear() % 4 === 0 ? weeksLeapYearStartToEnd : weeksNonLeapYearStartToEnd;
  const stateToColor = (state: string | undefined) => {
    let bgColor = ''
    let complementaryBgColor = ''
    switch (state) {
      case 'todo bien':
        bgColor = '#009929';
        complementaryBgColor = '#fff'
        break;
      case 'precaucion':
        bgColor = '#ebed17';
        complementaryBgColor = '#000'
        break;
      case 'cuidado con plagas':
        bgColor = '#efa229';
        complementaryBgColor = '#105dd6'
        break;
      case 'mal estado':
        bgColor = '#e80729';
        complementaryBgColor = '#fff'
        break;
      default:
        bgColor = '#fff';
    }
    return {
      bgColor,
      complementaryBgColor
    }
  }

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, clients.length)

  return (
    <View>
      <View style={{ flexDirection: 'row', backgroundColor: '#eee' }}>
        <View style={{ width: leftColumnWidth }}>
          <View
            style={{
              height: headerHeight,
              backgroundColor: primaryColor,
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
              borderTopLeftRadius: 10
            }}
          ></View>
          {/* left column */}
          <ScrollView ref={leftRef} style={{ backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
            {

              clients.slice(from, to).map((client, index) => (
                <Text key={index} style={[{ textAlign: 'center' }, index % 2 ? { height: 28 } : { backgroundColor, height: 28 }]}>{client.nombre}</Text>
              ))
            }
          </ScrollView>
        </View>
        {/* right column */}
        <View style={{ backgroundColor: 'white', flex: 1, borderTopRightRadius: 10, overflow: 'hidden' }}>
          <ScrollView horizontal bounces>
            <View>
              <View style={{ flexDirection: 'row' }}>
                {
                  months.map((month, index) => (
                    <View key={index} style={{ height: 40, backgroundColor: primaryColor, width: 150, borderColor: '#fff', borderStyle: 'solid', borderLeftWidth: 1, borderRightWidth: 1 }}>
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
                <View style={{}}>
                  {calendar.slice(from, to).map((client, index) => {
                    let weekCounter = 0
                    return (
                      <View key={index} style={[{ height: 28, backgroundColor: '#fff', width: 150, borderColor: '#fff', borderStyle: 'solid', borderLeftWidth: 1, borderRightWidth: 1, flexDirection: 'row' }, index % 2 ? { backgroundColor: '#fff' } : { backgroundColor }]}>
                        {
                          months.map((month, monthIndex, arr) => {

                            return (
                              <View key={monthIndex} style={[{ flexDirection: 'row', width: 150, borderColor: '#fff' }, monthIndex === 0 && { borderLeftWidth: 2 }, monthIndex !== 0 && { borderLeftWidth: 2, borderRightWidth: 2 }]}>
                                {
                                  client.meses[monthIndex].map((state, weekIndex) => {
                                    // Definir colores según el estado
                                    const { bgColor, complementaryBgColor } = stateToColor(state?.estado);
                                    weekCounter++;

                                    // Obtener el rango de la semana
                                    const weekRange = rangeDates[month][weekIndex];

                                    // Verificar si alguna cita coincide con la semana actual
                                    const cita = dates.find(date => {
                                      const citaDate = new Date(date.fecha);
                                      return new Date(citaDate) >= new Date(weekRange.start) && citaDate <= new Date(weekRange.end) && date.cliente_id === client.id
                                    });

                                    return (
                                      <View key={weekIndex} style={{ height: 28, flex: 1, backgroundColor: bgColor, borderWidth: 1, borderColor: '#e7e7e7', borderRadius: 5 }}>
                                        {
                                          cita ? (
                                            // Renderizar el círculo blanco si hay una cita
                                            <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                              <Tooltip title={`Fecha: ${new Date(cita.fecha).toLocaleString('es-MX')}`}>
                                                <View style={{
                                                  width: 16,
                                                  height: 16,
                                                  borderRadius: 8,
                                                  backgroundColor: '#000'
                                                }} />
                                              </Tooltip>
                                            </View>
                                          ) : (
                                            // Renderizar los atributos si no hay una cita
                                            bgColor !== '#fff' && <Text style={{ textAlign: 'center', color: complementaryBgColor }}>{state?.atributos.join('')}</Text>
                                          )
                                        }
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
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(calendar.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} de ${calendar.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        showFastPaginationControls
        selectPageDropdownLabel={'Filas por página'}
        style={{ backgroundColor: '#fff', justifyContent: 'center', padding: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginBottom: 10, height: 100 }}
      />
      {/* <View style={{flexDirection: 'row'}}>
        <Text>Filas por página</Text>
        <Dropdown
          data={numberOfItemsPerPageList}
          valueField='value'
          labelField='value'
          value={itemsPerPage}
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          onChange={item => {
            setItemsPerPageChange(item.value)
          }}
          renderItem={(item) => {
            return (<Text style={styles.textItem}>{item.value}</Text>)
          }}
        />
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    width: 60,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
})

export default StatesCalendar;
