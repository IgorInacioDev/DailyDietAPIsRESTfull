import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../../database'
import { z } from 'zod'
import { checkSessionIdExists } from '../../middlewares/checker-sessionid'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    // Rota para criar Refeição
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createSnackBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        type: z.enum(['diet', 'noDiet']),
      })

      const { name, description, type } = createSnackBodySchema.parse(
        request.body,
      )
      const sessionId = request.cookies.sessionId

      await knex('Meals').insert({
        id: randomUUID(),
        name,
        description,
        type,
        session_id: sessionId,
      })

      if (type === 'diet') {
        await knex('Users')
          .where('session_id', sessionId)
          .update({
            diet_meals: knex.raw('?? + 1', ['diet_meals']),
            total_meals: knex.raw('?? + 1', ['total_meals']),
          })
      } else {
        await knex('Users')
          .where('session_id', sessionId)
          .update({
            noDiet_meals: knex.raw('?? + 1', ['noDiet_meals']),
            total_meals: knex.raw('?? + 1', ['total_meals']),
          })
      }

      return reply.status(201).send()
    },
  )

  app.get(
    // Rota Para retornar uma refeições em especifico do usuario
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

      const users = await knex('Meals')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { users }
    },
  )

  app.get(
    // Rota para retornar as refeições do usuario
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const sessionId = request.cookies.sessionId

<<<<<<< HEAD
      const meals = await knex('Meals')
        .where('session_id', sessionId)
        .select('*')
=======
      const meals = await knex('Meals').where('session_id', sessionId).select('*')
>>>>>>> 51c67e3f726bc36e2205e323d23ee7d8067f5867

      return meals
    },
  )

  app.patch(
    // Rota para atualizar os dados da refeição
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getUsersParmsSchema = z.object({
        id: z.string().uuid(),
      })

      const updateMealsBySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        type: z.enum(['diet', 'noDiet']).optional(),
      })

      const { id } = getUsersParmsSchema.parse(request.params)

      const { name, description, type } = updateMealsBySchema.parse(
        request.body,
      )

      if (!name && !description && !type) {
        return reply
          .status(400)
          .send(
            'Pelo menos uma das propriedades name, description ou type deve ser fornecida no corpo da solicitação',
          )
      }

      await knex('Meals').where('id', id).update({
        name,
        description,
        type,
      })

      reply.status(200).send({
        message: 'update completed',
      })
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getIdMealsByParms = z.object({
        id: z.string().uuid(),
      })
      const sessionId = request.cookies.sessionId

      const { id } = getIdMealsByParms.parse(request.params)

      const idVerify = await knex('Meals')
        .where({
          id,
        })
        .first()

      if (!idVerify) {
        reply.status(400).send({
          message: 'Id not Existing',
        })
      }

      await knex('Meals')
        .where({
          session_id: sessionId,
          id,
        })
        .del()

      reply.status(200).send()
    },
  )
}
