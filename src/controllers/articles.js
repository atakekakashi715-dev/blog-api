const db = require('../config/db');

// 1. POST : Créer un article
exports.create = (req, res) => {
    const { titre, contenu, auteur, categorie, tags } = req.body;
    
    // Validation
    if (!titre || !auteur) {
        return res.status(400).json({ error: "Le titre et l'auteur sont obligatoires." });
    }

    const sql = `INSERT INTO articles (titre, contenu, auteur, categorie, tags) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [titre, contenu, auteur, categorie, tags], function(err) {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.status(201).json({ id: this.lastID, message: "Article créé avec succès" });
    });
};

// 2. GET : Lire tous les articles (avec filtres optionnels)
exports.getAll = (req, res) => {
    const { categorie, auteur, date } = req.query;
    let sql = "SELECT * FROM articles WHERE 1=1";
    let params = [];

    if (categorie) { sql += " AND categorie = ?"; params.push(categorie); }
    if (auteur) { sql += " AND auteur = ?"; params.push(auteur); }
    if (date) { sql += " AND date LIKE ?"; params.push(`${date}%`); }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.status(200).json(rows);
    });
};

// 3. GET : Rechercher (Doit être placé avant le GET by ID dans les routes)
exports.search = (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Paramètre 'query' manquant" });

    const sql = "SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?";
    db.all(sql, [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.status(200).json(rows);
    });
};

// 4. GET : Lire un article unique
exports.getOne = (req, res) => {
    db.get("SELECT * FROM articles WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        if (!row) return res.status(404).json({ error: "Article non trouvé" });
        res.status(200).json(row);
    });
};

// 5. PUT : Modifier un article
exports.update = (req, res) => {
    const { titre, contenu, categorie, tags } = req.body;
    const sql = `UPDATE articles SET titre = ?, contenu = ?, categorie = ?, tags = ? WHERE id = ?`;
    
    db.run(sql, [titre, contenu, categorie, tags, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        if (this.changes === 0) return res.status(404).json({ error: "Article non trouvé" });
        res.status(200).json({ message: "Article mis à jour" });
    });
};

// 6. DELETE : Supprimer un article
exports.delete = (req, res) => {
    db.run("DELETE FROM articles WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        if (this.changes === 0) return res.status(404).json({ error: "Article non trouvé" });
        res.status(200).json({ message: "Article supprimé" });
    });
};