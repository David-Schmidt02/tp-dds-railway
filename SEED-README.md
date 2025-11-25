# Guía para poblar la base de datos con Seed

## Opción 1: Ejecutar localmente (RECOMENDADO - MÁS SIMPLE)

Esta es la forma más sencilla. Ejecuta el seed desde tu computadora apuntando a la base de datos de Railway.

### Pasos:

1. **Configura la variable de entorno localmente:**

En la raíz del proyecto, crea o edita el archivo `.env`:

```bash
DB_URI=mongodb://mongo:GgEMUaPAwblSNJQmmRZuKEhBCKKeWSWz@tramway.proxy.rlwy.net:43392/TiendaSol
```

2. **Ejecuta el script de seed:**

```bash
cd packages/backend
node src/scripts/seed-production.js
```

3. **Verifica que el seed funcionó:**

Deberías ver un mensaje de éxito con un resumen de usuarios y productos insertados.

---

## Opción 2: Crear servicio en Railway

Si prefieres ejecutar el seed desde Railway (más complejo):

### Pasos:

1. **En Railway, crea un nuevo servicio:**
   - Click en "New Service"
   - Selecciona "GitHub Repo"
   - Selecciona tu repositorio `David-Schmidt02/tp-dds-railway`

2. **Configura el servicio:**
   - **Name**: Seed Database
   - **Root Directory**: `/` (raíz del proyecto)
   - **Dockerfile Path**: `packages/backend/Dockerfile.seed`

3. **Agrega las variables de entorno:**
   ```
   DB_URI=mongodb://mongo:GgEMUaPAwblSNJQmmRZuKEhBCKKeWSWz@tramway.proxy.rlwy.net:43392/TiendaSol
   ```

4. **Despliega el servicio:**
   - El servicio se ejecutará, poblará la base de datos y luego terminará
   - Puedes eliminarlo después de que termine

5. **IMPORTANTE:** Este servicio se reiniciará constantemente (porque Railway intenta mantenerlo vivo). Una vez que el seed termine:
   - Ve a Settings del servicio
   - Elimina el servicio o ponlo en pausa

---

## ¿Qué datos se insertan?

### Usuarios (4):
- **Usuario Default** (`6560f1a1e4b0a1b2c3d4e5f3`) - COMPRADOR
- **SportMax** - VENDEDOR
- **Moda Urbana** - VENDEDOR
- **Tech Store** - VENDEDOR

### Productos (12):
- **3 productos** de SportMax (ropa deportiva)
- **4 productos** de Moda Urbana (ropa urbana)
- **5 productos** de Tech Store (tecnología)

---

## Solución de problemas

### Error: "Cannot connect to MongoDB"
- Verifica que la URI de MongoDB sea correcta
- Asegúrate de que el servicio de MongoDB en Railway esté corriendo
- Verifica que la IP de tu computadora esté permitida (para conexión local)

### Error: "Duplicate key error"
- La base de datos ya tiene datos. El script limpia automáticamente los datos existentes.
- Si el error persiste, conecta a MongoDB y limpia manualmente las colecciones `usuarios` y `productos`

### El frontend no encuentra el usuario
- Verifica que el `REACT_APP_DEFAULT_USER_ID` en el frontend sea `6560f1a1e4b0a1b2c3d4e5f3`
- El seed crea automáticamente este usuario

---

## Recomendación

**Usa la Opción 1 (ejecutar localmente)** porque es:
- ✅ Más rápida
- ✅ Más simple
- ✅ Más fácil de debuggear
- ✅ No requiere configuración adicional en Railway
