import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export function setupSwagger(app) {
  const options = {
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'Tienda Sol - Entrega 1',
        version: '1.0.0',
        description:
          'Documentación de **POST /pedidos** con todos los caminos posibles.\n' +
          'Stack: Express + Mongoose. Tests: Jest + Supertest.',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local' }
      ],
      components: {
        schemas: {
          
          ItemPedidoInput: {
            type: 'object',
            required: ['productoId', 'cantidad'],
            properties: {
              productoId: { type: 'string', example: '66fabc1234567890abc12345' },
              cantidad: { type: 'integer', minimum: 1, example: 2 }
            }
          },
          DireccionEntregaInput: {
            type: 'object',
            required: ['calle', 'altura', 'piso', 'departamento', 'codigoPostal', 'ciudad', 'referencia'],
            properties: {
              calle:        { type: 'string', example: 'Av. Siempreviva' },
              altura:       { type: 'integer', example: 742 },
              piso:         { type: 'integer', example: 1 },
              departamento: { type: 'integer', example: 2 },
              codigoPostal: { type: 'integer', example: 1405 },
              ciudad:       { type: 'string', example: 'CABA' },
              referencia:   { type: 'string', example: 'Timbre verde' }
            }
          },
          PedidoCreateInput: {
            type: 'object',
            required: ['usuarioId', 'items', 'moneda', 'direccionEntrega'],
            properties: {
              usuarioId: { type: 'string', example: '66fabcd234567890abc12345' },
              items: {
                type: 'array',
                minItems: 1,
                items: { $ref: '#/components/schemas/ItemPedidoInput' }
              },
              moneda: {
                type: 'string',
                enum: ['PESO_ARG', 'DOLAR_USA', 'REAL'],
                example: 'PESO_ARG'
              },
              direccionEntrega: { $ref: '#/components/schemas/DireccionEntregaInput' }
            }
          },

          
          UsuarioRef: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              nombre: { type: 'string' },
              email: { type: 'string' }
            }
          },
          ProductoRef: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              titulo: { type: 'string' },
              descripcion: { type: 'string' },
              precio: { type: 'number' },
              categoria: { type: 'string' }
            }
          },
          ItemPedidoDTO: {
            type: 'object',
            properties: {
              producto: { $ref: '#/components/schemas/ProductoRef' },
              cantidad: { type: 'integer' },
              precioUnitario: { type: 'number' },
              subtotal: { type: 'number' }
            }
          },
          PedidoDTO: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              comprador: { $ref: '#/components/schemas/UsuarioRef' },
              items: {
                type: 'array',
                items: { $ref: '#/components/schemas/ItemPedidoDTO' }
              },
              total: { type: 'number', example: 35000 },
              moneda: { type: 'string', example: 'PESO_ARG' },
              direccionEntrega: {
                type: 'object',
                properties: {
                  calle: { type: 'string' },
                  altura: { type: 'integer' },
                  ciudad: { type: 'string' }
                }
              },
              estado: { type: 'string', example: 'PENDIENTE' },
              fechaCreacion: { type: 'string', format: 'date-time' }
            }
          },

          
          ValidationIssue: {
            type: 'object',
            properties: {
              path: { type: 'array', items: { type: 'string' } },
              message: { type: 'string' }
            }
          },
          ValidationErrorResponse: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Datos de entrada inválidos' },
              details: {
                type: 'array',
                items: { $ref: '#/components/schemas/ValidationIssue' }
              }
            }
          },
          ErrorResponse: {
            type: 'object',
            properties: {
              error:   { type: 'string', example: 'ProductoInexistente' },
              message: { type: 'string', example: 'El producto con id X no existe' }
            }
          }
        }
      },
      paths: {
        '/pedidos': {
          post: {
            tags: ['Pedidos'],
            summary: 'Crear un pedido',
            description:
              'Crea un nuevo pedido para un **usuario comprador** y descuenta stock de los productos. ' +
              'Genera notificación al vendedor. **Valida** el body con Zod (estructura y tipos).',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PedidoCreateInput' },
                  examples: {
                    valido: {
                      summary: 'Crea un pedido válido',
                      value: {
                        usuarioId: '66fabcd234567890abc12345',
                        items: [
                          { productoId: '66fabc1234567890abc12345', cantidad: 2 },
                          { productoId: '66fabc1234567890abc99999', cantidad: 1 }
                        ],
                        moneda: 'PESO_ARG',
                        direccionEntrega: {
                          calle: 'Av. Siempreviva',
                          altura: 742,
                          piso: 1,
                          departamento: 2,
                          codigoPostal: 1405,
                          ciudad: 'CABA',
                          referencia: 'Timbre verde'
                        }
                      }
                    },
                    invalidoZod: {
                      summary: 'Falla de validación (Zod)',
                      value: {
                        items: [{ productoId: '66fabc1234567890abc12345', cantidad: 0 }],
                        moneda: 'PESO_ARG',
                        direccionEntrega: {
                          calle: 'X',
                          altura: 1,
                          piso: 1,
                          departamento: 1,
                          codigoPostal: 1000,
                          ciudad: 'CABA',
                          referencia: 'x'
                        }
                      }
                    }
                  }
                }
              }
            },
            responses: {
              '201': {
                description: 'Pedido creado',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/PedidoDTO' },
                    example: {
                      id: '66face01234567890abc0001',
                      comprador: { id: '66fabcd234567890abc12345', nombre: 'Comprador Uno', email: 'comprador@ejemplo.com' },
                      items: [
                        {
                          producto: {
                            id: '66fabc1234567890abc12345',
                            titulo: 'Mouse Gamer',
                            descripcion: 'RGB 7200dpi',
                            precio: 10000,
                            categoria: 'perifericos'
                          },
                          cantidad: 2,
                          precioUnitario: 10000,
                          subtotal: 20000
                        },
                        {
                          producto: {
                            id: '66fabc1234567890abc99999',
                            titulo: 'Teclado Mecánico',
                            descripcion: 'Switch blue',
                            precio: 15000,
                            categoria: 'perifericos'
                          },
                          cantidad: 1,
                          precioUnitario: 15000,
                          subtotal: 15000
                        }
                      ],
                      total: 35000,
                      moneda: 'PESO_ARG',
                      direccionEntrega: { calle: 'Av. Siempreviva', altura: 742, ciudad: 'CABA' },
                      estado: 'PENDIENTE',
                      fechaCreacion: '2025-10-13T12:00:00.000Z'
                    }
                  }
                }
              },
              '400': {
                description: 'Body inválido (Zod) — antes de llegar a la lógica de negocio',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
                    example: {
                      message: 'Datos de entrada inválidos',
                      details: [
                        { path: ['items', '0', 'cantidad'], message: 'Debe haber al menos 1' }
                      ]
                    }
                  }
                }
              },
              '404': {
                description: 'Errores de negocio: ProductoInexistente | ProductoNoDisponible',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                    examples: {
                      ProductoInexistente: {
                        value: { error: 'ProductoInexistente', message: 'El producto con id X no existe' }
                      },
                      ProductoNoDisponible: {
                        value: { error: 'ProductoNoDisponible', message: 'El producto con id X no está activo' }
                      }
                    }
                  }
                }
              },
              '409': {
                description: 'Negocio: ProductoStockInsuficiente',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                    example: {
                      error: 'ProductoStockInsuficiente',
                      message: 'Stock disponible 5, solicitado 10'
                    }
                  }
                }
              },
              '500': {
                description: 'Error inesperado (fallback del middleware de errores)',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                    example: {
                      error: 'Error',
                      message: 'Ups. Algo sucedió en el servidor.'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    apis: [] 
  };

  const openapiSpec = swaggerJSDoc(options);

  app.get('/openapi.json', (_req, res) => res.json(openapiSpec));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, { explorer: true }));
}