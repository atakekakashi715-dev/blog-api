
const express = require('express');
const router = express.Router();
const articleCtrl = require('../controllers/article');

// Définition des Endpoints
router.post('/articles', articleCtrl.create);
router.get('/articles', articleCtrl.getAll);
router.get('/articles/search', articleCtrl.search); // Route de recherche
router.get('/articles/:id', articleCtrl.getOne);
router.put('/articles/:id', articleCtrl.update);
router.delete('/articles/:id', articleCtrl.delete);

module.exports = router;