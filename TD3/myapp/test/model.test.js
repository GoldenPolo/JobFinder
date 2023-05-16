const DB = require ("../model/db.js");
const userModel = require ("../model/utilisateur.js");
describe("Model Tests", () => {
    afterAll(done=>{
        function callback (err){
        if (err) done (err);
        else done ();
        }
        DB.end(callback);
    });
    
    test("read user", ()=>{
        userModel.read(1, function (resultat){
            nom = resultat.nom;
            expect(nom).toBe("nom1");
        })

});
    test("valid password", () =>{
        userModel.validPassword("candidat@mail.fr", "mdp", function (resultat){
            expect(resultat).toBeTruthy();
        })

    }
    );
})