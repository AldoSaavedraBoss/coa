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

export interface GardenProps {
  caracteristicas: {
    cobertura: string
    densidad: string
    edad: string
    superficie: string
    tipo_suelo: string
    ubicacion: string
    variedad: string
  }
  cliente_id: string
  id: string
  nombre: string
  recomendaciones: string[]
}

export interface ClientProps {
    id: string,
    tecnico_id: string,
    email: string,
    apellido: string,
    rol: rol,
    creacion: { seconds: number, nanoseconds: number },
    nombre: string
}

export interface ReportProps {
  nombre_huerto: string,
  recomendaciones: string[],
  nombre: string,
  plagas: {
    accion: string,
    ixs: number,
    plaga: string,
    producto: string
  }[],
  estado_general:string,
  observaciones: string[],
  enfermedades: {
    accion: string,
    ixs: number,
    enfermedad: string,
    producto: string
  }[],
  etapa_fenologica: string,
  agricultor_id: string,
  huerto_id: string,
  fecha: string
}

export interface PestsDiseasesProps {
  action: string,
  ixs: number,
  pest: string,
  product: string
}
