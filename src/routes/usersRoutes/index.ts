import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../../database'
import { z } from 'zod'
import { checkSessionIdExists } from '../../middlewares/checker-sessionid'

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    // Rota para criar Usuario
    '/',
    async (request, reply) => {
      const createUserBodySchema = z.object({
        name: z.string(),
        password: z.string(),
      })

      const { name, password } = createUserBodySchema.parse(request.body)

      console.log(name, password)

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()

        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })
      }

      await knex('users').insert({
        id: randomUUID(),
        name,
        password,
        session_id: sessionId,
        total_meals: 0,
        noDiet_meals: 0,
        diet_meals: 0,
      })

      return reply.status(201).send()
    },
  )

  app.get(
    // Rota para retornar o perfil do usuario
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId

      const users = await knex('Users').where({ session_id: sessionId }).first()

      return { users }
    },
  )

  app.get(
    // Rota para retornar o perfil do usuario
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getUsersParmsSchema = z.object({
        id: z.string().uuid(),
      })

      const sessionId = request.cookies.sessionId
      const { id } = getUsersParmsSchema.parse(request.params)

      const users = await knex('Users')
        .where({ session_id: sessionId, id })
        .first()

      return { users }
    },
  )
}
