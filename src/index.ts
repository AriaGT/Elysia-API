// Importamos Elysia y Prisma
import { Elysia, t } from "elysia";
import { PrismaClient } from './prisma/generated/clientPg'
import swagger from "@elysiajs/swagger";
import { docInfo } from './swagger.config'
import { env } from "bun";

// Declaramos la aplicación, el puerto y un id inicial
const app = new Elysia().use(swagger(docInfo));
const db = new PrismaClient();
const port = env.PORT || 3000;

// Configuramos la ruta principal de la API para revisar el estado de la misma
app
  .state('version', 1)
  .decorate('getDate', () => Date.now())
  .get('/', ({ getDate, store: { version } }) => ({
    status: 'Online',
    version,
    date: getDate(),
  }), {
    detail: {
      description: 'Obten el estado del servidor, la versión y fecha actual de la API',
      tags: ['API']
    }
  });

// Obtener todos los usuarios
app
  .get('/users', async () => ({ users: await db.user.findMany() }), {
    detail: {
      description: 'Obten una lista con todos los usuarios en la base de datos',
      tags: ['Usuarios']
    }
  });

// Obtener usuario según ID
app
  .get('/users/:id', async ({ params: { id } }) => ({ user: await db.user.findUnique({ where: { id: Number(id) } }) }), {
    detail: {
      description: 'Obten la información del usuario con el id que proporciones',
      tags: ['Usuarios']
    }
  });

// Crear usuario
app
  .post('/users', async ({ body }) => {
    await db.user.create({ data: body })
    return { new_user: body }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String()
    }),
    detail: {
      description: 'Crea un nuevo usuario',
      tags: ['Usuarios']
    }
  });

// Editar nombre de usuario
app
  .patch('/users/:id', async ({ params: { id }, body: { name } }) => {
    const user = await db.user.update({
      where: { id: Number(id) },
      data: { name: name }
    })
    return { user }
  }, {
    body: t.Object({ name: t.String() }),
    detail: {
      description: 'Edita la información de un usuario',
      tags: ['Usuarios']
    }
  });

// Eliminar usuario
app
  .delete('/users/:id', async ({ params: {id} }) => {
    await db.user.delete({ where: { id: Number(id) } })
    return { message: `User with id ${id} deleted successfully` };
  }, {
    detail: {
      description: 'Elimina el usuario con el id que proporciones',
      tags: ['Usuarios']
    }
  });

// Configuramos el puerto un mensaje en consola
app.listen(port)
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
