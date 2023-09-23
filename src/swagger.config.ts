import { swagger } from '@elysiajs/swagger'
import { ElysiaSwaggerConfig } from '@elysiajs/swagger/src/types'
import Elysia from 'elysia'

export const docInfo: ElysiaSwaggerConfig<"/docs"> = {
  path: '/docs',
  exclude: ["/docs", "/docs/json"],
  documentation: {
    info: {
      title: 'API CRUD de Usuarios en Elysia',
      version: '0.1.0',
      description: 'API sencilla y escalable para manejar usuarios, proximamente incluirá Prisma para manejar bases de datos SQL!'
    },
    tags: [
      { name: 'API', description: 'Endpoints generales'},
      { name: 'Usuarios', description: 'Endpoints para manejar usuarios'},
    ]
  }
}