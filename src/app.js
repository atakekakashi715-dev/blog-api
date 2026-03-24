const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const apiRoutes = require('./routes/routes');

const app = express();

// 1. INDISPENSABLE : Permet à Express de comprendre le JSON entrant
app.use(express.json());

// 2. Configuration de Swagger (Documentation)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 3. Liaison avec les routes de l'API
app.use('/api', apiRoutes);

// 4. Démarrage
const PORT = 3000;
app.listen(PORT, () => {
    console.log("=========================================");
    console.log(`🚀 Serveur actif sur : http://localhost:${PORT}`);
    console.log(`📖 Swagger Web UI  : http://localhost:${PORT}/api-docs`);
    console.log("=========================================");
});