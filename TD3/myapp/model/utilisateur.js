var db = require('./db.js'); 

module.exports = {
    read: function (id, callback) {
        db.query("select * from Utilisateur where id = ?", [id], function (err, results) {
            if (err) throw err;
            callback(results[0]);
        });
    },

    readType: function (id, callback) {
        db.query("select type from Utilisateur where id = ?", [id], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readOrganisation: function (id, callback) {
        db.query("select organisation from Utilisateur where id = ?", [id], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readall: function (callback) {
        db.query("select * from Utilisateur", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    validPassword: function (email, password, callback) {
        db.query("select motDePasse, type, id from Utilisateur where email = ?", [email], function (err, rows) {
            if (err) throw err;
            if (rows.length == 1 && rows[0].motDePasse === password) {
                callback([true, rows[0].type, rows[0].id])
            } else {
                callback([false]);
            }
        });
    },

    create: function (id, nom, prenom, pwd, type, telephone, callback) {
        db.query("insert into Utilisateur(id, nom, prenom, motDePasse, type, telephone, dateCreation, estActif) values(?, ?, ?, ?, ?, ?, ?, ?)", [id, nom, prenom, pwd, type, telephone, new Date, 1], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    delete: function (id, callback) {
        db.query("delete from Utilisateur where id = ?", [id], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    update: function (id, email, nom, prenom, pwd, type, telephone, callback) {
        db.query("update Utilisateur set email = ?, nom = ?, prenom = ?, motDePasse = ?, type = ?, telephone = ? where id = ?", [email, nom, prenom, pwd, type, telephone, id], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }

}