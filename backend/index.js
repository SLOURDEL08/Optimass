const express = require('express');
const cors = require('cors');
const routes = require('./src/routes/api');                // Changé ici
const errorHandler = require('./src/middleware/errorHandler'); // Changé ici
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Gestion des erreurs
app.use(errorHandler);

// Dossiers statiques
app.use('/output', express.static(path.join(__dirname, 'output')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});