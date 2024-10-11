import { create } from "zustand";
import { AuthProps2 } from "../interfaces/user";

interface IStore {
  user: AuthProps2,
  saveUser: (newUser: AuthProps2) => void
  clearUser: () => void
}

const initialState: AuthProps2 = {
  id: '',
  apellido: '',
  creacion: '',
  email: '',
  nombre: '',
  rol: ''
}

const useStore = create<IStore>((set) => ({
  user: initialState,
  saveUser: (newUser: AuthProps2) => set((state) => ({
    user: newUser
  })),
  clearUser: () => set(state => ({
    user: initialState
  }))
}))

export default useStore