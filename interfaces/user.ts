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
    apellidos: string,
    rol: rol,
    creacion: { seconds: number, nanoseconds: number },
    nombre: string
}
