/* eslint-disable no-undef */
const userModel = require('../model/utilisateur.js')

describe('Model Tests', () => {
  test('read user', () => {
    userModel.read(1, function (result, error) {
      if (!error) {
        expect(result.nom).toBe('nom1')
        expect(result.prenom).toBe('prenom1')
      }
    })
  })

  test('error read user', () => {
    function cbRead (resultat, err) {
      expect(() => {
        if (err) throw err
      }).toThrow('Error : pas d\'utilisateur avec cet id!')
    }
    userModel.read(9000, cbRead)
  })

  test('read id', () => {
    userModel.readId('candidat@mail.fr', function (resultat, err) {
      if (!err) {
        expect(resultat.id).toBe(1)
      }
    })
  })

  test('error read id', () => {
    function cbRead (resultat, err) {
      expect(() => {
        if (err) throw err
      }).toThrow('Error : pas d\'utilisateur avec cet email!')
    }
    userModel.readId('pasUnEmail@mail.fr', cbRead)
  })

  test('read type', () => {
    userModel.readType(1, function (resultat, err) {
      if (!err) {
        expect(resultat.type).toBe('candidat')
      }
    })
  })

  test('error read type', () => {
    function cbRead (resultat, err) {
      expect(() => {
        if (err) throw err
      }).toThrow('Error : pas d\'utilisateur avec cet id!')
    }
    userModel.readType(9000, cbRead)
  })

  test('read all with filters', () => {
    userModel.readAllFilters('prenom1', 0, 10, function (resultat) {
      expect(resultat.length).toBeMoreThanOrEqual(1)
    })
  })

  test('read password', () => {
    userModel.readPassword('candidat@mail.fr', function (resultat) {
      expect(resultat.motDePasse).toBe('$2a$10$YN7KohtuxFSUADx29gdsROp/.urZSNW4OAyc8DTHkmg5ms4zSjMJq')
    })
  })

  test('valid password', () => {
    userModel.validPassword('candidat@mail.fr', 'mdp', function (resultat) {
      expect(resultat).toBeTruthy()
    })
  })

  test('read orga', () => {
    userModel.readOrganisation(2, function (resultat, err) {
      if (!err) {
        expect(resultat.organisation).toBe(1)
      }
    })
  })

  test('error read orga', () => {
    function cbRead (resultat, err) {
      expect(() => {
        if (err) throw err
      }).toThrow('Error : pas d\'utilisateur avec cet id!')
    }
    userModel.readOrganisation(9000, cbRead)
  })

  test('error create', () => {
    function cbCreate (err, resultat) {
      expect(() => {
        if (err) throw err
      }).toThrow(1092)
    }
    userModel.create(9000, 'email', cbCreate)
  })
})

describe('Model tests with preparation', () => {
  let id
  beforeEach(() => {
    userModel.create('test@mail.com', 'testnom', 'testprenom', 'testpasswd', 'candidat', 'tel', function (id_) {
      id = id_
    })
  })

  afterEach(async () => {
    userModel.delete(id, function () {})
  })

  test('update user', () => {
    userModel.update(id, 'test@mail.com', 'testnom2', 'testprenom2', 'tel', function (res) {
      userModel.read(id, function (resultat) {
        expect(resultat.nom).toBe('testnom2')
        expect(resultat.prenom).toBe('testprenom2')
      })
    })
  })

  test('become Recruter', () => {
    userModel.becomeRecruter(id, 1, function (resultat) {
      userModel.readType(id, function (type) {
        expect(type).toBe('recruteur')
      })
    })
  })

  test('become Admin', () => {
    userModel.becomeAdmin(id, function (resultat) {
      userModel.readType(id, function (type) {
        expect(type).toBe('admin')
      })
    })
  })
})

describe('Model tests with preparation before', () => {
  let id
  beforeEach(() => {
    userModel.create('test@mail.com', 'testnom', 'testprenom', 'testpasswd', 'candidat', 'tel', function (id_) {
      id = id_
    })
  })

  test('delete user', () => {
    userModel.delete(id, function (res) {
      function cbRead (err, resultat) {
        expect(() => {
          if (err) throw err
        }).toThrow('Error : pas d\'utilisateur avec cet id!')
      }
      userModel.read(id, cbRead)
    })
  })
})

describe('Model tests with preparation', () => {
  let id
  afterEach(async () => {
    userModel.delete(id, function () {})
  })

  test('create user', () => {
    userModel.create('test@mail.com', 'testnom', 'testprenom', 'testpasswd', 'candidat', 'tel', function (id_) {
      id = id_
      userModel.read(id, function (resultat) {
        expect(resultat.nom).toBe('testnom')
        expect(resultat.prenom).toBe('testprenom')
      })
    })
  })
})