var db = require('./db.js'); 

module.exports = {
    read: function (id, callback) {
        db.query("select * from Utilisateur where id = ?", id, function (err, results) {
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
        sql = "SELECT motDePasse FROM USERS WHERE email = ?";
        rows = db.query(sql, email, function (err, results) {
            if (err) throw err;
            if (rows.length == 1 && rows[0].motDePasse === password) {
                callback(true)
            } else {
                callback(false);
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
        db.query("delete from Utilisateur where id = ?", id, function (err, results) {
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