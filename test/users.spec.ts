// import { execSync } from 'node:child_process'
import { app } from '../src/app'
import request from 'supertest'
import { test, beforeAll, describe } from 'vitest'

describe('Users Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  test('O cliente podera criar uma conta.', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'teste name',
        password: 'testePassswor',
      })
      .expect(201)
  })

  test('O usuario podera retornar seu propio perfil', async () => {
    const createUserRespose = await request(app.server).post('/users').send({
      name: 'teste name',
      password: 'testePassswor',
    })

    const cookies = createUserRespose.get('Set-Cookie')

    await request(app.server).get('/users').set('Cookie', cookies).expect(200)
  })
})
