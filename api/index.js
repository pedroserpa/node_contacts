import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 53644;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Here you would replace this with DB queries
const contacts = new Map();

function validateContactPayload(payload, isUpdate = false, currentId = null) {
  const errors = [];
  if (!payload) {
    errors.push('An error occurred.');
    return errors;
  }
  if (!payload.name || typeof payload.name !== 'string' || payload.name.length <= 5) {
    errors.push('Name must have text and should be more than 5 characters long');
  }
  if (!payload.contact || !/^\d{9}$/.test(payload.contact)) {
    errors.push('Contact must be exactly 9 digits');
  }
  if (!payload.email || !/^\S+@\S+\.\S+$/.test(payload.email)) {
    errors.push('Email must be a valid email address');
  }
  if (!payload.picture) {
    errors.push('Photo is required');
  }
  for (const c of contacts.values()) {
    if (c.id !== currentId) {
      if (c.email === payload.email) errors.push('Email must be unique');
    }
  }
  return errors;
}

// Rota de teste basico
app.get('/', (req, res) => {
    res.json({message: 'Hello world!'});
});

// Listar todos os contacto 
// TODO: precisa de paginação!
app.get('/contacts', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contacts');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar/detalhe um contacto por ID
app.get('/contacts/:id', async (req, res) => {
    const id_contact = req.params.id;
    console.log(id_contact)
    //TODO: validar se é um número, etc
    if (!id_contact) return res.status(404).json({ error: 'Contact not found' });

    try {
        const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [id_contact]);
        if (rows.length === 0) return res.status(404).json({ error: 'Contact not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Criar um novo contacto
app.post('/contacts', async (req, res) => {
    const { id, name, contact, email, picture } = req.body;

    try {
      const [existing] = await pool.query('SELECT id FROM contacts WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Contact already exists' });
      }

      await pool.query(
        'INSERT INTO contacts (id, name, contact, email, picture) VALUES (?, ?, ?, ?, ?)',
        [id, name, contact, email, picture]
      );
      res.status(201).json({ id, name, contact, email, picture });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Atualizar um contacto existente
app.put('/contacts/:id', async (req, res) => {
    const { name, contact, email, picture } = req.body;
    // TODO: validar o req.params.id
    const id_contact = req.params.id;
    if (!id_contact) return res.status(404).json({ error: 'Contact not found' });

    try {
      const [existing] = await pool.query(
        'SELECT id FROM contacts WHERE (OR email = ?) AND id != ?',
        [email, id_contact]
      );
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Contact or email already exists' });
      }
      const [result] = await pool.query(
        'UPDATE contacts SET name = ?, contact = ?, email = ?, picture = ? WHERE id = ?',
        [name, contact, email, picture, id_contact]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Contact not found' });
      res.json({ id: id_contact, name, contact, email, picture });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Apagar um contacto
app.delete('/contacts/:id', async (req, res) => {
    const id_contact = req.params.id;
    // TODO: validar o req.params.id e não usá-lo diretamente na query
    if (!id_contact) return res.status(404).json({ error: 'Contact not found' });

    try {
      const [result] = await pool.query('DELETE FROM contacts WHERE id = ?', [id_contact]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Contact not found' });
      res.json({ message: 'Contact deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Contacts API running at http://pedroserpa-nodejs.recruitment.alfasoft.pt:${PORT}`));