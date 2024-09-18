type rol = 'cliente' | 'tecnico'

export interface AuthProps {
  token: string
  refreshToken: string
  uid: string
  data: {
    apellidos: string
    creacion: Date
    email: string
    nombre: string
    rol: rol
  }
}

export type GardenFeatures = {
  [key: string]: any
}

export interface FertilizerData {
  cantidad: number
  fecha: string
  formula: string[]
}

export interface GardenStates {
  estado: string
  fecha: string
}

export interface GardenProps {
  caracteristicas: GardenFeatures
  cliente_id: string
  id: string
  nombre: string
  recomendaciones: string[]
  fertilizaciones_pendientes: string[]
  historial_fertilizante: FertilizerData[]
  historial_estados: GardenStates[]
}

export interface ClientProps {
  id: string
  tecnico_id: string
  email: string
  apellido: string
  rol: rol
  creacion: string
  nombre: string
}

export interface ReportProps {
  id: string
  nombre_huerto: string
  recomendaciones: string[]
  nombre: string
  plagas: {
    accion: string
    ixs: number
    plaga: string
    producto: string
  }[]
  estado_general: string
  observaciones: string[]
  enfermedades: {
    accion: string
    ixs: number
    enfermedad: string
    producto: string
  }[]
  etapa_fenologica: string
  agricultor_id: string
  huerto_id: string
  fecha: string
}

export interface PestsDiseasesProps {
  action: string
  ixs: number
  pest: string
  product: string
}

export interface CalendarProps {
  id: string
  name: string
  meses: [null[] | { estado: string; atributos: string[] }[]]
}

export interface ToastData {
  type: 'error' | 'info' | 'success'
  text1: string
  text2: string
  text1Style: any
  text2Style: any
}

type Estado = 'todo bien' | 'precaución' | 'cuidado con plagas' | 'mal estado'

export interface Meses {
  enero: Estado[]
  febrero: Estado[]
  marzo: Estado[]
  abril: Estado[]
  mayo: Estado[]
  junio: Estado[]
  julio: Estado[]
  agosto: Estado[]
  septiembre: Estado[]
  octubre: Estado[]
  noviembre: Estado[]
  diciembre: Estado[]
}

export interface DatesData {
  id: string
  clientId: string
  date: string
  gardenId: string
  name: string
  apellidos: string
}
