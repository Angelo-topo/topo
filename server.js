const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/list-chantier', (req, res) => {
  const chantierPath = path.join(__dirname, 'chantiers');
  fs.readdir(chantierPath, (err, elements) => {
    if (err) return res.status(500).json({ error: 'Erreur' });
    const dossiers = elements.filter(el => 
    fs.statSync(path.join(chantierPath, el)).isDirectory()
  );

  res.json(dossiers);
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
