const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./blog.db', (err) => {
    if (err) {
        console.error("❌ Erreur SQLite :", err.message);
    } else {
        console.log("✅ Connecté à la base de données SQLite.");
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titre TEXT NOT NULL,
        contenu TEXT NOT NULL,
        auteur TEXT NOT NULL,
        date TEXT DEFAULT CURRENT_TIMESTAMP,
        categorie TEXT,
        tags TEXT
    )`);
});

// CRUCIAL : Exporter la base pour l'utiliser ailleurs
module.exports = db;