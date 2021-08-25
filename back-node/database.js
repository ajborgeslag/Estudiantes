var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // No se puede conectar con la base de datos
        console.error(err.message)
        throw err
    }else{
        console.log('Se ha realizado la conección con la base de datos.')
        //Crear tabla ciudad
        db.run(`CREATE TABLE ciudad (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre text
            )`,
            (err) => {
                if (err) {
                    // La tabla ya existe
                }else{
                    // Agregar ciudades
                    var insertar = 'INSERT INTO ciudad (nombre) VALUES (?)'
                    db.run(insertar, ["La Habana"])
                    db.run(insertar, ["Varadero"])
                }
            });
        //Crear tabla grupo
        db.run(`CREATE TABLE grupo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre text,
            profesor_guia text,
            disponible boolean
            )`,
            (err) => {
                if (err) {
                    // La tabla ya existe
                }else{
                    // Agregar ciudades
                    var insertar = 'INSERT INTO grupo (nombre, profesor_guia, disponible) VALUES (?, ?, ?)'
                    db.run(insertar, ["Grupo 1", "Pedro Sanchez", true])
                }
            });
        db.run(`CREATE TABLE estudiante (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre text,
            edad INTEGER ,
            sexo text,
            email text,
            grupo NOT NULL,
            fecha_nacimiento text,
            lugar_nacimiento INTEGER,
            FOREIGN KEY (grupo) REFERENCES grupo(id)
            )`,
            (err) => {
                //console.log(err)
            });
    }
});


module.exports = db