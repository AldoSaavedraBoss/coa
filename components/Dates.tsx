import { View, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Text } from 'react-native-paper';
import { weeksLeapYear, weeksNonLeapYear } from '../lib/yearTypes';
import { ClientProps, Meses } from '../interfaces/user';

interface DatesProps {
    clients: ClientProps[],
}

const Dates = ({ clients }: DatesProps) => {
    const leftRef = useRef<ScrollView>(null);
    const rightRef = useRef<ScrollView>(null);

    const [numberOfItemsPerPageList] = useState([5, 10, 25]);
    const [itemsPerPage, setItemsPerPage] = useState(
        numberOfItemsPerPageList[0]
    );
    const [page, setPage] = React.useState<number>(0);

    const leftColumnWidth = 150
    const headerHeight = 40;
    const borderColor = '#C1C0B9';
    const primaryColor = 'dodgerblue';
    const backgroundColor = '#F7F6E7';

    const yearselected = new Date().getFullYear() % 4 === 0 ? weeksLeapYear : weeksNonLeapYear;
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, clients.length)

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    return (
        <View style={{ gap: 12 }}>
            <Text variant='titleLarge' style={{ marginHorizontal: 'auto' }}>Citas</Text>
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
            <Button icon={require('../assets/icons/clock.png')}>Agendar cita</Button>
        </View>
    )
}

export default Dates