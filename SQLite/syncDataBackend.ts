import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

// const syncDataWithBackend = async () => {
//     NetInfo.fetch().then(async (state) => {
//       if (state.isConnected) {
//         getUnsyncedCitas(async (citas) => {
//           if (citas.length > 0) {
//             try {
//               // Enviar citas al backend
//               await Promise.all(
//                 citas.map(cita =>
//                   axios.post(BACKEND_URL, cita)
//                 )
//               );
  
//               // Marcar citas como sincronizadas
//               markCitasAsSynced();
//             } catch (error) {
//               console.error('Error syncing data:', error);
//             }
//           }
//         });
//       }
//     });
//   };