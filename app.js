const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Conectar a la base de datos (o crearla si no existe)
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos', err.message);
  } else {
    console.log('Conectado a la base de datos');
    // Crear la tabla si no existe
    db.run('CREATE TABLE IF NOT EXISTS maquinas (id INTEGER PRIMARY KEY AUTOINCREMENT, numero_maquina TEXT, numero_servicio TEXT, estado TEXT, observaciones TEXT)');
  }
});

app.use(express.static('public'));
app.use(express.json());

// Endpoint para obtener todas las máquinas
app.get('/api/maquinas', (req, res) => {
  db.all('SELECT * FROM maquinas', (err, rows) => {
    if (err) {
      console.error('Error al obtener las máquinas', err.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json(rows);
    }
  });
});

// Endpoint para agregar una nueva máquina
app.post('/api/maquinas', (req, res) => {
  const { numero_maquina, numero_servicio, estado, observaciones } = req.body;
  const query = 'INSERT INTO maquinas (numero_maquina, numero_servicio, estado, observaciones) VALUES (?, ?, ?, ?)';
  db.run(query, [numero_maquina, numero_servicio, estado, observaciones], function(err) {
    if (err) {
      console.error('Error al agregar la máquina', err.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
