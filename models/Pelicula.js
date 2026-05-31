import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Pelicula = sequelize.define('Pelicula', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    titulo: {type: DataTypes.STRING, allowNull: false},
    director: {type: DataTypes.STRING, allowNull: false},
    año: {type: DataTypes.INTEGER, allowNull: false},
    genero: {type: DataTypes.STRING, allowNull: false},
    sinopsis: {type: DataTypes.TEXT, allowNull: false}
}, {
    timestamps: false
});

export default Pelicula;
