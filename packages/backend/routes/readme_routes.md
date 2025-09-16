# Esquema de Arquitectura: Rutas, Controladores, Servicios y Repositorios

Este esquema te ayuda a entender cómo se relacionan las capas principales del backend y cómo deberías estructurar el código para cada entidad del TP.

---

## 🗺️ Diagrama General

```
Cliente (Frontend)
			│
			▼
	 [Routes]         ← Definen los endpoints y reciben las peticiones
			│
			▼
[Controllers]       ← Procesan la petición, validan y llaman a los servicios
			│
			▼
 [Services]         ← Lógica de negocio, reglas y orquestación
			│
			▼
[Repositories]      ← Acceso a datos (DB, archivos, etc)
			│
			▼
Base de datos / Fuente de datos
```

---

## 🧩 ¿Qué hace cada capa?

- **Routes (Rutas):**
	- Definen los endpoints de la API (ej: `/api/pedidos`).
	- Reciben las solicitudes HTTP del cliente.
	- Llaman al controller correspondiente.

- **Controllers (Controladores):**
	- Reciben la solicitud desde la ruta.
	- Validan y procesan los datos de entrada.
	- Llaman a los servicios para ejecutar la lógica de negocio.
	- Devuelven la respuesta al cliente.

- **Services (Servicios):**
	- Contienen la lógica de negocio principal.
	- Orquestan operaciones complejas y validaciones.
	- Usan los repositories para acceder a los datos.

- **Repositories (Repositorios):**
	- Se encargan del acceso a datos (DB, archivos, APIs externas).
	- Proveen métodos para consultar, guardar, actualizar o eliminar datos.

---

## 🔄 Ejemplo de flujo

1. El cliente hace una petición HTTP a una ruta (por ejemplo, `POST /api/pedidos`).
2. La ruta llama al método correspondiente del controller (`pedidoController.crearPedido`).
3. El controller procesa la solicitud y llama al service (`pedidoService.crearPedido`).
4. El service ejecuta la lógica de negocio y utiliza el repository (`pedidoRepository.guardarPedido`) para acceder o modificar los datos.
5. El repository interactúa con la base de datos y devuelve el resultado al service.
6. El service retorna la respuesta al controller.
7. El controller envía la respuesta al cliente.

---

## 📝 Recomendación para el TP

- Seguí este esquema para cada entidad (Pedido, Usuario, Producto, etc).
- Cada entidad debería tener su propio controller, service y repository.
- Las rutas deben ser simples y solo delegar.
- La lógica de negocio va en los services.
- El acceso a datos va en los repositories.

---

> **Tip:** 
