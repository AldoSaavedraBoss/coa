import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, FlatList, Pressable, StyleSheet } from 'react-native';
import { DataTable, Text } from 'react-native-paper';
import { CalendarProps, ClientProps } from '../interfaces/user';
import { Dropdown } from 'react-native-element-dropdown';

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
  clients: ClientProps[],
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

const StatesCalendar = ({ calendar, clients }: StateCalendarProps) => {
  const [numberOfItemsPerPageList] = useState([1, 5, 10, 25]);
  const [itemsPerPage, setItemsPerPage] = useState(
    numberOfItemsPerPageList[0]
  );
  const [page, setPage] = React.useState<number>(0);

  const leftRef = useRef<ScrollView>(null);
  const rightRef = useRef<ScrollView>(null);

  const leftColumnWidth = 150
  const headerHeight = 40;
  const borderColor = '#C1C0B9';
  const primaryColor = 'dodgerblue';
  const backgroundColor = '#F7F6E7';

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);


  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

  const yearselected = new Date().getFullYear() % 4 === 0 ? weeksLeapYear : weeksNonLeapYear;
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
  const to = Math.min((page + 1) * itemsPerPage, calendar.length)

  return (
    <View>
      <View style={{ flexDirection: 'row', backgroundColor: '#eee' }}>
        <View style={{ width: leftColumnWidth, backgroundColor: 'yellow', borderWidth: 1, borderColor }}>
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

              clients.slice(from, to).map((client, index) => (
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
                <View style={{ borderWidth: 1, borderColor, borderStyle: 'solid', }}>
                  {calendar.slice(from, to).map((client, index) => {
                    let weekCounter = 0
                    return (
                      <View key={index} style={[{ height: 28, backgroundColor: '#fff', width: 150, borderColor: '#fff', borderStyle: 'solid', borderLeftWidth: 1, borderRightWidth: 1, flexDirection: 'row' }, index % 2 ? { backgroundColor: '#fff' } : { backgroundColor }]}>
                        {
                          months.map((month, monthIndex) => {

                            return (
                              <View key={monthIndex} style={{ flexDirection: 'row', width: 150 }}>
                                {
                                  client.meses[monthIndex].map((state, weekIndex) => {
                                    // Definir colores según el estado
                                    const { bgColor, complementaryBgColor } = stateToColor(state?.estado)
                                    weekCounter++

                                    return (
                                      <View key={weekIndex} style={{ height: 28, flex: 1, backgroundColor: bgColor, borderWidth: 1, borderColor: '#e7e7e7', borderRadius: 5 }}>
                                        {
                                          bgColor !== '#fff' && <Text style={{ textAlign: 'center', color: complementaryBgColor }}>{state?.atributos.join('')}</Text>
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
        style={{ backgroundColor: '#fff', justifyContent: 'center', padding: 0 }}
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
