import express from 'express';
import jwt from 'jsonwebtoken';
import sequelize from './database.js';
import Pelicula from './models/Pelicula.js';

const app = express();
app.use(express.json());

const SECRET_KEY = 'mi_clave_secreta_de_api_maria25!';

// Sincronizar modelo con SQLite
await sequelize.sync();

// LOGIN
app.post('/login', (req, res) => {
    const { usuario, password } = req.body;

    if (usuario === 'mariaosuna' && password === 'maria25') {
        const token = jwt.sign(
            { usuario: usuario, rol: 'admin' },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ mensaje: 'Login correcto', token });
    } else {
        res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
});

// MIDDLEWARE
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ error: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'Token inválido' });
    }

    jwt.verify(token, SECRET_KEY, (error, usuario) => {
        if (error) {
            return res.status(401).json({ error: 'Token no válido o expirado' });
        }

        req.usuario = usuario;
        next();
    });
}

// Consultar películas por género
app.get('/peliculas/genero/:nombre', verificarToken, async (req, res) => {
    const peliculas = await Pelicula.findAll({
        where: {
            genero: req.params.nombre
        }
    });

    res.json(peliculas);
});

// Consultar películas ordenadas por año
app.get('/peliculas/orden/anio', verificarToken, async (req, res) => {
    const peliculas = await Pelicula.findAll({
        order: [['año', 'ASC']]
    });

    res.json(peliculas);
});

// CRUD Películas
app.get('/peliculas', verificarToken, async (req, res) => {
    const peliculas = await Pelicula.findAll();
    res.json(peliculas);
});

app.get('/peliculas/:id', verificarToken, async (req, res) => {
    const pelicula = await Pelicula.findByPk(req.params.id);

    pelicula
        ? res.json(pelicula)
        : res.status(404).json({ error: 'Película no encontrada' });
});

app.post('/peliculas', verificarToken, async (req, res) => {
    const nuevaPelicula = await Pelicula.create(req.body);
    res.status(201).json(nuevaPelicula);
});

app.put('/peliculas/:id', verificarToken, async (req, res) => {
    const pelicula = await Pelicula.findByPk(req.params.id);

    if (pelicula) {
        await pelicula.update(req.body);
        res.json(pelicula);
    } else {
        res.status(404).json({ error: 'Película no encontrada' });
    }
});

app.delete('/peliculas/:id', verificarToken, async (req, res) => {
    const borrada = await Pelicula.destroy({
        where: { id: req.params.id }
    });

    res.json({ eliminado: !!borrada });
});

app.listen(3000, () => {
    console.log('API de películas lista en http://localhost:3000');
});
