
const db = require('../config/db');

// ● CRÉER UN ARTICLE (POST /api/articles)
exports.create = (req, res) => {
    const { titre, contenu, auteur, categorie, tags } = req.body;
    
    // Validation des entrées (Bonnes pratiques)
    if (!titre || !auteur || titre.trim() === "") {
        return res.status(400).json({ error: "Validation échouée : Le titre et l'auteur sont obligatoires (Code 400)." });
    }

    const sql = `INSERT INTO articles (titre, contenu, auteur, categorie, tags) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [titre, contenu, auteur, categorie, tags], function(err) {
        if (err) return res.status(500).json({ error: "Erreur serveur lors de la création (Code 500)." });
        
        // Confirmation avec l'ID (Livrable attendu)
        res.status(201).json({ 
            id: this.lastID, 
            message: "Article créé avec succès (Code 201)",
            data: { titre, auteur }
        });
    });
};

// ● LIRE / AFFICHER (GET /api/articles) + FILTRES
exports.getAll = (req, res) => {
    const { categorie, auteur, date } = req.query;
    let sql = "SELECT * FROM articles WHERE 1=1";
    let params = [];

    // Gestion des filtres optionnels
    if (categorie) { sql += " AND categorie = ?"; params.push(categorie); }
    if (auteur) { sql += " AND auteur = ?"; params.push(auteur); }
    if (date) { sql += " AND date LIKE ?"; params.push(`${date}%`); }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: "Erreur serveur (Code 500)." });
        res.status(200).json(rows); // Réponse : Tableau JSON
    });
};

// ● LIRE UN ARTICLE UNIQUE (GET /api/articles/{id})
exports.getOne = (req, res) => {
    const sql = "SELECT * FROM articles WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: "Erreur serveur." });
        if (!row) return res.status(404).json({ error: "Article non trouvé (Code 404)." });
        res.status(200).json(row);
    });
};

// ● RECHERCHER UN ARTICLE (GET /api/articles/search?query=texte)
exports.search = (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Veuillez fournir un texte de recherche (query)." });

    const sql = "SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?";
    const searchText = `%${query}%`;
    db.all(sql, [searchText, searchText], (err, rows) => {
        if (err) return res.status(500).json({ error: "Erreur serveur." });
        res.status(200).json(rows);
    });
};

// ● MODIFIER UN ARTICLE (PUT /api/articles/{id})
exports.update = (req, res) => {
    const { titre, contenu, categorie, tags } = req.body;
    const sql = `UPDATE articles SET titre = ?, contenu = ?, categorie = ?, tags = ? WHERE id = ?`;
    
    db.run(sql, [titre, contenu, categorie, tags, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: "Erreur lors de la mise à jour." });
        if (this.changes === 0) return res.status(404).json({ error: "Impossible de modifier : article inexistant." });
        res.status(200).json({ message: "Article mis à jour avec succès (Code 200)" });
    });
};

// ● SUPPRIMER UN ARTICLE (DELETE /api/articles/{id})
exports.delete = (req, res) => {
    db.run("DELETE FROM articles WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: "Erreur lors de la suppression." });
        if (this.changes === 0) return res.status(404).json({ error: "Impossible de supprimer : article inexistant." });
        res.status(200).json({ message: "Article supprimé définitivement (Code 200)" });
    });
};