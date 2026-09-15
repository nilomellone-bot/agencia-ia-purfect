# Agencia IA Purfect · V0.3

Aplicación independiente de demostración, construida con Next.js App Router, TypeScript, React, Tailwind CSS, Recharts y Zod.

## Alcance

- Inicio con indicadores, gráficos, canales, especialistas, recomendaciones y experimento demo.
- Director con consulta secuencial simulada a Meta Ads, Finanzas, Analytics y CRO.
- Expedientes con objetivo, período, baseline, fuentes, hallazgos, contradicciones, recomendaciones y auditoría.
- Validación, bloqueo, aprobación explícita y rechazo de recomendaciones demo.
- Finanzas con cálculos determinísticos y simulador mensual.
- Vistas de Meta Ads, Analytics, CRO, Experimentos, Memoria, Configuración y Documentación.
- Fixtures sintéticos separados de una carga manual local de información. No se extrae información de las cuentas de Purfect.

**El Director NO llama todavía a un LLM.** Las conclusiones son fixtures explícitos. Las aprobaciones son locales al navegador y no ejecutan cambios externos. Supabase y autenticación están disponibles para copias privadas de información; Agents SDK y conectores de negocio se incorporan en etapas futuras. La demo pública no debe recibir datos sensibles, claves ni datos de clientes.

## Ejecutar

Requisitos: Node.js 22 o superior y npm.

```bash
npm ci
npm run dev
```

## Verificar

```bash
npm test
npm run build
npm start
```

Las pruebas verifican cálculos, denominadores cero, entradas inválidas, conciliación de fixtures, bloqueos, aprobación explícita y prohibición de implementar en V0.

## Deployment Vercel

Proyecto previsto: `agencia-ia-purfect` en `nilomellone-bots-projects`.

La **raíz del proyecto** es esta carpeta: aquí están `package.json` y `package-lock.json`. En el repositorio de GitHub deben quedar en la raíz, no dentro de una segunda carpeta `agencia-ia-purfect`.

Configuración:

- Framework: Next.js.
- Root Directory: raíz del repositorio, vacío o `.`.
- Install Command: `npm ci`.
- Build Command: `npm run build`.
- Output Directory: valor predeterminado de Next.js; no configurarlo como `out`.
- No hacen falta variables de entorno para esta V0.

El error previo `No Next.js version detected` y la captura de un deployment de un solo archivo indican que Vercel no estaba recibiendo un proyecto Next.js completo o no estaba construyendo desde su raíz. El ajuste exacto remoto debe confirmarse con acceso al proyecto. Este paquete incluye Next.js en dependencies y el build local pasa.

Flujo: verificar localmente → conectar exclusivamente este proyecto → desplegar preview → verificar interfaz y consola → promover a producción → verificar dominio. No modificar otros repositorios ni aplicaciones de Purfect.

## Datos y cálculos

Todos los importes del motor están en ARS netos de IVA, descuentos y devoluciones; corresponden al mismo período. Los costos variables excluyen pauta para evitar descontarla dos veces.

- Contribución = ventas − costos variables sin pauta.
- Margen de contribución = contribución / ventas.
- Resultado operativo = contribución − costos fijos − pauta.
- Equilibrio = (costos fijos + pauta) / margen, con margen positivo.
- ROAS atribuido = ventas atribuidas / pauta; no equivale a incrementalidad.
- MER = ventas totales / pauta.
- Piso ROAS de contribución = 1 / margen. Excluye cobertura de costos fijos y beneficio objetivo.
- Techo CAC de contribución = ticket × margen, bajo supuesto explícito de clientes nuevos. No es CAC máximo rentable completo.

Sin denominador válido se devuelve `null`, nunca infinito. No se infiere utilidad neta sin impuestos y gastos completos. Los indicadores del Inicio y las campañas concilian para los 14 días de la fixture. El selector de 7 días filtra la serie; Finanzas usa un escenario mensual separado y claramente rotulado.

## Organización del código

- `src/app`: rutas, layouts, CSS y metadatos.
- `src/components`: interfaz y proveedor local de demostración.
- `src/services`: métricas determinísticas y fixtures.
- `src/schemas`: validación Zod y Decision Case.
- `src/policies`: transiciones, bloqueos y aprobación.
- `src/workflows`: orquestación demo y expediente inicial.
- `src/evals`: pruebas de invariantes financieras y de permisos.

## Persistencia y límites de seguridad

LocalStorage, clave `purfect-agency-demo-v1`, esquema versionado validado con Zod. Se captura el fallo de almacenamiento y se informa en pantalla. No se sincroniza entre dispositivos; no es auditoría inviolable ni control de acceso para datos reales. No hay endpoints de escritura externos ni credenciales.

Antes de datos reales: autenticación, organizaciones y usuarios, autorización del servidor, Supabase con RLS, auditoría persistente, snapshots inmutables, idempotencia, validación de permisos y separación entre proponer/aprobar/ejecutar.

## Arquitectura objetivo (próxima etapa)

Manager / Blackboard: ingesta, normalización, SQL/TypeScript, validación y permisos determinísticos. Director del servidor consulta especialistas con `agent.asTool()` del OpenAI Agents SDK TypeScript, bajo un expediente y un snapshot compartido. No habrá conversación libre entre especialistas. Analytics y Finanzas pueden bloquear; el Director no puede anular el bloqueo. Operations añadirá límites de capacidad más adelante.

La integración de Supabase se limita al acceso y las copias privadas de información. No se instalaron dependencias de IA sin uso. No se implementaron tablas vacías ni conectores simulados presentados como activos. pgvector se reserva para una necesidad real de recuperación documental.

## Referencias técnicas

- [Instalación oficial de Next.js](https://nextjs.org/docs/app/getting-started/installation)
- [Tailwind en Next.js](https://nextjs.org/docs/app/getting-started/css)


## Centro de información (V0.2)

`/informacion` permite guardar el perfil comercial, catálogo CSV, métricas diarias CSV y documentos pegados como texto. Cada CSV tiene plantilla descargable, validación de todas las filas y confirmación de reemplazo de la tabla elegida. Los importes usan ARS netos de IVA y punto decimal, sin miles. Fechas ISO reales y únicas; SKU únicos. Se rechazan números negativos, infinitos y filas ambiguas.

El Inicio ofrece «Mis datos cargados» y «Ejemplo demo». Los totales y la serie de datos propios se calculan desde la carga; no se inventan canales, recomendaciones ni utilidad sin costos fijos. El Director y las otras vistas siguen siendo simulaciones explícitas y NO interpretan la información cargada.

Guardado separado en `purfect-business-v1`, esquema Zod versionado. Hasta 2000 productos, 3660 días, 50 documentos y 2 MB totales. Exportación y restauración JSON validadas. Una escritura fallida no reemplaza el estado guardado ni muestra éxito. La corrupción de un guardado bloquea la sobrescritura automática. Los documentos se muestran como texto sin ejecutar HTML.

La carga inicial es local. La V0.3 añade una copia privada manual por usuario en Supabase. No hay extracción de PDF/Word, conexión con Drive ni IA real. Preview y producción usan guardados separados por origen: cargar la información definitiva en la URL de producción y conservar respaldos. No ingresar credenciales ni información personal de clientes; el uso de datos sensibles compartidos requiere la siguiente etapa de autenticación y Supabase/RLS.


## Copia privada Supabase (V0.3)

Proyecto dedicado: `mvxjxzadpdgaqkbccwmw`, organización PURFECT_ IA. Solo se aplica `src/db/private-information.sql`; el esquema genérico de decisiones es una propuesta y no debe exponerse sin políticas de organización/aprobación.

`/acceso` usa email y contraseña de un usuario habilitado en Supabase Auth. No hay registro público en la interfaz. La cuenta de administración de Supabase no crea un usuario de la Agencia: habilitar el primer acceso en Authentication > Users > Add user > Create new user. El dueño elige su contraseña allí y la usa en `/acceso`; nunca guardarla en archivos o compartirla por chat.

El Centro de información ofrece guardar una copia privada y restaurarla entre dispositivos. Es una acción explícita; no hay sincronización automática. Cada usuario tiene su propia fila; no hay espacio compartido entre distintos usuarios todavía. La copia local persiste al cerrar sesión: es un equipo de confianza y permite exportar antes de transferir información.

El endpoint `/api/informacion` valida el JWT con Auth, rechaza anónimos y valida los datos con Zod. La tabla aplica RLS por propietario, no tiene privilegios para anon, y las actualizaciones comprueban revisión para evitar sobrescrituras concurrentes. No usa service_role. URL y clave publishable son públicas por diseño y se pueden sustituir con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.

La lógica de dominio depende del contrato BusinessStore; el adaptador Supabase está aislado en integrations. La conexión SQL Database sigue disponible para futuros servicios. Supabase Auth usa su propio almacenamiento de sesión; las credenciales no pasan por los formularios de información ni se guardan en el repositorio.
