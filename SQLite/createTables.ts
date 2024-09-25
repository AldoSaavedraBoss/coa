export const createTables = async (db: any) => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS citas (
        id TEXT PRIMARY KEY,
        cliente_id TEXT,
        fecha TEXT,
        huerto_id TEXT,
        tecnico_id TEXT,
        nombre TEXT,
        apellido TEXT,
        sync INTEGER DEFAULT 0
      );
  
      CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY,
        apellido TEXT,
        creacion TEXT,
        email TEXT NOT NULL,
        nombre TEXT,
        rol TEXT DEFAULT 'cliente',
        tecnico_id TEXT,
        historial_estados_huertos TEXT,
        sync INTEGER DEFAULT 0,
        UNIQUE(email)
      );
  
      CREATE TABLE IF NOT EXISTS huertos (
        id TEXT PRIMARY KEY,
        caracteristicas TEXT,
fertilizaciones_pendientes TEXT,
historial_estados TEXT,
historial_fertilizantes TEXT,
        nombre TEXT,
        recomendaciones TEXT,
        cliente_id TEXT NOT NULL,
        sync INTEGER DEFAULT 0
      );
  
      CREATE TABLE IF NOT EXISTS reportes (
        id TEXT PRIMARY KEY,
        agricultor_id TEXT NOT NULL,
        estado_general TEXT,
        etapa_fenologica TEXT,
        fecha TEXT,
        huerto_id TEXT,
        nombre TEXT,
        nombre_huerto TEXT,
        enfermedades TEXT,
        observaciones TEXT,
        plagas TEXT,
        recomendaciones TEXT,
        sync INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS estados_huerto (
      id TEXT PRIMARY KEY,
      estado TEXT,
      color TEXT
      );

      CREATE TABLE IF NOT EXISTS autenticacion (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      creacion TEXT,
      UNIQUE(email)
      );
    `)
    console.log('Tablas creadas correctamente')
  } catch (error) {
    console.error('Error al crear las tablas:', error)
  }
}


// DROP TABLE IF EXISTS dates;
// DROP TABLE IF EXISTS clients;
// DROP TABLE IF EXISTS huertos;
// DROP TABLE IF EXISTS general_suggestions;
// DROP TABLE IF EXISTS reports;
// DROP TABLE IF EXISTS features;
// DROP TABLE IF EXISTS features_modified;
// DROP TABLE IF EXISTS fertilizer;
// DROP TABLE IF EXISTS general_states;
// CREATE TABLE IF NOT EXISTS general_suggestions (
//   id TEXT PRIMARY KEY,
//   garden_id TEXT NOT NULL,
//   value TEXT,
//   sync INTEGER DEFAULT 0
// );

// CREATE TABLE IF NOT EXISTS features (
//   id TEXT PRIMARY KEY,
//   garden_id TEXT NOT NULL,
//   key TEXT,
//   value TEXT,
//   sync INTEGER DEFAULT 0
// );

// CREATE TABLE IF NOT EXISTS features_modified (
//   id TEXT PRIMARY KEY,
//   garden_id TEXT NOT NULL,
//   newFeatures TEXT NOT NULL,
//   sync INTEGER DEFAULT 0
// );

// CREATE TABLE IF NOT EXISTS fertilizer (
//   id TEXT PRIMARY KEY,
//   area TEXT,
//   cantidad REAL,
//   fecha TEXT,
//   formula TEXT
// );

// CREATE TABLE IF NOT EXISTS general_states (
//   id TEXT PRIMARY KEY,
//   values_array TEXT
// );
