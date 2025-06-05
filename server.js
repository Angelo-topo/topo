const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('chantiers'));

app.get('/list-chantier', (req, res) => {
  const dossier = path.join(__dirname, 'chantiers');
  fs.readdir(dossier, (err, fichiers) => {
    if (err) return res.status(500).json({ error: 'Erreur' });
    res.json(fichiers.filter(f => fs.statSync(path.join(dossier, f)).isFile()));
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
