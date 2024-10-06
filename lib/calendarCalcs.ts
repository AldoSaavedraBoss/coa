import { weeksLeapYearStartToEnd, weeksNonLeapYearStartToEnd } from './calendar'

const getWeekForDate = (date, weeks) => {
  const parsedDate = new Date(date)
  for (const week of weeks) {
    const start = new Date(week.start)
    const end = new Date(week.end)
    if (parsedDate >= start && parsedDate <= end) {
      return week
    }
  }
  return null
}

export const createClientObjects = data => {
  const yearSelected =
    new Date().getFullYear() % 4 === 0 ? weeksLeapYearStartToEnd : weeksNonLeapYearStartToEnd
  return data.map(client => {
    // Crear un objeto vacío para los meses
    const meses = Object.keys(yearSelected).map(month => {
      // Crear un array con las semanas del mes inicializadas a `null`
      const monthWeeks = Array(yearSelected[month].length).fill(null)
      // Validar si el historial_estados_huertos es una cadena JSON válida
      const parsed = client.historial_estados_huertos
        ? JSON.parse(client.historial_estados_huertos)
        : [] // Si está vacío o no es válido, inicializarlo como un array vacío
      // Iterar por cada estado del historial del cliente
      parsed.forEach(entry => {
        // Iterar por las semanas del mes actual
        for (let i = 0; i < yearSelected[month].length; i++) {
          const week = yearSelected[month][i]
          const weekRange = getWeekForDate(entry.fecha, yearSelected[month])

          // Si la fecha corresponde a esta semana, guardar el estado y romper el ciclo
          if (weekRange && entry.fecha >= week.start && entry.fecha <= week.end) {
            monthWeeks[i] = { estado: entry.estado, atributos: entry.atributos }
            break // Salir del ciclo una vez se haya asignado el estado
          }
        }
      })

      return monthWeeks
    })

    return {
      id: client.id,
      name: client.name,
      meses,
    }
  })
}
