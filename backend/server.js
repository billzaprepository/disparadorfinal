// Importar dependências principais
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');

// Configuração inicial
env = require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Conexão ao banco de dados
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

pool.connect()
    .then(() => console.log('Conectado ao banco de dados Postgres!'))
    .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

// Helper para validação de token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido.' });
        req.user = user;
        next();
    });
};

// Rotas

// Rota principal
app.get('/', (req, res) => {
    res.send('API funcionando!');
});

// Registro de usuário
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
            [username, hashedPassword]
        );
        res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao registrar usuário.', error: err });
    }
});

// Login de usuário
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login bem-sucedido!', token });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao fazer login.', error: err });
    }
});

// CRUD de conexões
app.get('/connections', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM connections WHERE user_id = $1', [req.user.id]);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar conexões.', error: err });
    }
});

app.post('/connections', authenticateToken, async (req, res) => {
    const { name, details } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO connections (user_id, name, details) VALUES ($1, $2, $3) RETURNING id',
            [req.user.id, name, details]
        );
        res.status(201).json({ message: 'Conexão criada com sucesso!', connectionId: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar conexão.', error: err });
    }
});

app.delete('/connections/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM connections WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        res.status(200).json({ message: 'Conexão deletada com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar conexão.', error: err });
    }
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
