/* eslint-disable no-undef */
const request = require('supertest')
const app = require('../app')
describe('Test the root path', () => {
  test('It should response the GET method', done => {
    request(app)
      .get('/')
      .then(response => {
        expect(response.statusCode).toBe(302)
        done()
      })
  })
  test('Login page working', done => {
    request(app)
      .get('/login')
      .then(response => {
        expect(response.statusCode).toBe(200)
        done()
      })
  })
  test('Redirection working', done => {
    request(app)
      .get('/admin')
      .then(response => {
        expect(response.statusCode).toBe(302)
        done()
      })
  })
})