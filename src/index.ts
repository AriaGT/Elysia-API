// Importamos Elysia
import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import { docInfo } from './swagger.config'

// Declaramos la aplicación, el puerto y un id inicial
const app = new Elysia().use(swagger(docInfo));
const port = 3000;
let id = 1;

// Definimos el formato de un usuario
type User = { id: Number; name: String; email: String }

// Creamos la lista de usuarios
let Users: User[] = [];

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
  .get('/users', () => ({users: Users}), {
    detail: {
      description: 'Obten una lista con todos los usuarios en la base de datos',
      tags: ['Usuarios']
    }
  });

// Obtener usuario según ID
app
  .get('/users/:id', ({ params: { id } }) => ({ user: Users.find(user => user.id.toString() == id) || {} }), {
    detail: {
      description: 'Obten la información del usuario con el id que proporciones',
      tags: ['Usuarios']
    }
  });

// Crear usuario
app
  .post('/users', ({ body }) => {
    Users.push({
      id: id++,
      name: body.name,
      email: body.email,
    })
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

// Editar usuario
app
  .patch('/users/:id', ({ params: { id }, body }) => {
    const user = Users[Users.findIndex(user => user.id.toString() == id)];
    user.name = body.name;
    user.email = body.email;
    return { user }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String()
    }),
    detail: {
      description: 'Edita la información de un usuario',
      tags: ['Usuarios']
    }
  });

// Eliminar usuario
app
  .delete('/users/:id', ({ params: {id} }) => {
    const userIndex = Users.findIndex(user => user.id.toString() == id);
    Users.splice(userIndex, 1)
    return { message: `User with id ${id} deleted successfully` };
  }, {
    detail: {
      description: 'Elimina el usuario con el id que proporciones',
      tags: ['Usuarios']
    }
  });

// COnfiguramos el puerto un mensaje en consola
app.listen(port)
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
