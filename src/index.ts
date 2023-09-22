// Importamos Elysia
import { Elysia, t } from "elysia";

// Declaramos la aplicación, el puerto y un id inicial
const app = new Elysia();
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
  }));

// Obtener todos los usuarios
app
  .get('/users', () => Users);

// Obtener usuario según ID
app
  .get('/users/:id', ({ params: { id } }) => Users.find(user => user.id.toString() == id) || {});

// Crear usuario
app
  .post('/users', ({ body }) => {
    Users.push({
      id: id++,
      name: body.name,
      email: body.email,
    })
    return body
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String()
    })
  });

// Editar usuario
app
  .patch('/users/:id', ({ params: { id }, body }) => {
    const user = Users[Users.findIndex(user => user.id.toString() == id)];
    user.name = body.name;
    user.email = body.email;
    return user
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String()
    })
  });

// Eliminar usuario
app
  .delete('/users/:id', ({ params: {id} }) => {
    const userIndex = Users.findIndex(user => user.id.toString() == id);
    Users.splice(userIndex, 1)
    return { message: `User with id ${id} deleted successfully` };
  });

// COnfiguramos el puerto un mensaje en consola
app.listen(port)
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
