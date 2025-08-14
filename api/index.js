import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function validateContactPayload(payload) {
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
  console.log(errors)
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
    if ( !id_contact || isNaN(parseInt(id_contact)) ) return res.status(404).json({ error: 'Contact not found' });

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
    validateContactPayload(req.body)

    const { name, contact, email, picture } = req.body;

    try {
      const [existing] = await pool.query('SELECT id FROM contacts WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Contact already exists' });
      }

      const [result] = await pool.query(
        'INSERT INTO contacts (name, contact, email, picture) VALUES (?, ?, ?, ?)',
        [name, contact, email, picture]
      );
      const newId = result.insertId;
      console.log('Inserted ID:', newId);
      res.status(201).json({ newId, name, contact, email, picture });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Atualizar um contacto existente
app.put('/contacts/:id', async (req, res) => {
    validateContactPayload(req.body)

    const { name, contact, email, picture } = req.body;
    
    const id_contact = req.params.id;
    if ( !id_contact || isNaN(parseInt(id_contact)) ) return res.status(404).json({ error: 'Contact not found' });

    try {
      const [existing] = await pool.query(
        'SELECT id FROM contacts WHERE email = ? AND id != ?',
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
    if ( !id_contact || isNaN(parseInt(id_contact)) ) return res.status(404).json({ error: 'Contact not found' });

    try {
      const [result] = await pool.query('DELETE FROM contacts WHERE id = ?', [id_contact]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Contact not found' });
      res.json({ message: 'Contact deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Contacts API running at http://localhost:${PORT}`));