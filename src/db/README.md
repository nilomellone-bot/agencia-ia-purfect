# Persistencia — Agencia IA Purfect

La aplicación usa PostgreSQL estándar y no depende de un proveedor específico.

## Regla de arquitectura

Los servicios de negocio consumen `Database` desde `src/db/database.ts`. No deben importar SDKs de Neon, Supabase, Railway u otro proveedor directamente.

Esto permite cambiar de hosting de PostgreSQL sin reescribir Director, Finanzas, Analytics, CRO ni el Decision Engine.

## Configuración

La conexión real se habilitará mediante la variable de entorno `DATABASE_URL`.

Mientras `DATABASE_URL` no exista, la interfaz actual puede continuar en modo demo. No se deben presentar datos demo como datos reales de Purfect.

## Esquema MVP

`schema.sql` incorpora primero el núcleo que necesitamos para salir del almacenamiento local:

- `decision_cases`
- `recommendations`
- `recommendation_audit`
- `experiments`

Las tablas de integraciones y métricas se incorporarán por dominio cuando cada conector tenga contrato y fuente canónica definidos.

## Proveedores compatibles

Cualquier PostgreSQL moderno que acepte una URL de conexión estándar. El proveedor es infraestructura; no forma parte del dominio de la aplicación.
