import { app } from '../src/app'
import request from 'supertest'
import { test, beforeAll, afterAll, describe } from 'vitest'
import { execSync } from 'node:child_process'

describe('Meals Routes', () => {
  beforeAll(async () => {
    await app.ready()
    execSync('npm run knex migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  test('O usuario devera conseguir criar uma refeição', async () => {
    const createUserRespose = await request(app.server).post('/users').send({
      name: 'teste name',
      password: 'testePassswor',
    })

    const cookies = createUserRespose.get('Set-Cookie')
    // console.log(cookies)
    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'teste',
        description: 'teste',
        type: 'diet',
      })
      .expect(201)
  })

  test('O usuario devera conseguir lista suas refeições', async () => {
    const createUserRespose = await request(app.server).post('/users').send({
      name: 'teste name',
      password: 'testePassswor',
    })

    const cookies = createUserRespose.get('Set-Cookie')
    // console.log(cookies)
    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'teste',
      description: 'teste',
      type: 'diet',
    })
    await request(app.server).get('/meals').set('Cookie', cookies).expect(200)
  })

  test('O usuario devera conseguir retornar uma refeição em especifico', async () => {
    const createUserRespose = await request(app.server).post('/users').send({
      name: 'teste name',
      password: 'testePassswor',
    })

    const cookies = createUserRespose.get('Set-Cookie')
    // console.log(cookies)
    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'teste',
      description: 'teste',
      type: 'diet',
    })
    const snackInfosResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const id = snackInfosResponse.body.id

    await request(app.server)
      .get(`/meals/${id}`)
      .set('Cookie', cookies)
      .expect(200)
  })

  test('O usuario devera conseguir alterar uma refeição em especifico', async () => {
    const createUserRespose = await request(app.server).post('/users').send({
      name: 'teste name',
      password: 'testePassswor',
    })

    const cookies = createUserRespose.get('Set-Cookie')
    // console.log(cookies)
    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'teste',
      description: 'teste',
      type: 'diet',
    })
    const snackInfosResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const id = snackInfosResponse.body.id

    await request(app.server)
      .patch(`/meals/${id}`)
      .set('Cookie', cookies)
      .send({
        name: 'update name',
        description: 'update description',
      })
      .expect(200)
  })

  test('O usuario devera conseguir deletar uma refeição em especifico', async () => {
    const createUserRespose = await request(app.server).post('/users').send({
      name: 'teste name',
      password: 'testePassswor',
    })

    const cookies = createUserRespose.get('Set-Cookie')
    // console.log(cookies)
    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'teste',
      description: 'teste',
      type: 'diet',
    })
    const snackInfosResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const id = snackInfosResponse.body.id

    await request(app.server)
      .delete(`/meals/${id}`)
      .set('Cookie', cookies)
      .expect(200)
  })
})
