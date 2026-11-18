# TechSolutions SRL — Implementación de cloud computing

Proyecto académico para la asignatura Infraestructura Tecnológica.

## Arquitectura

- **GitHub:** repositorio y control de versiones.
- **GitHub Pages:** alojamiento de la interfaz web estática.
- **Supabase Auth:** autenticación de usuarios.
- **Supabase Database:** almacenamiento de los registros de empleados.
- **Row Level Security (RLS):** protege la tabla y exige una sesión autenticada.

## Archivos

- `index.html`: estructura de la aplicación.
- `styles.css`: diseño adaptable.
- `config.js`: URL y clave pública de Supabase.
- `app.js`: autenticación y operaciones del directorio.
- `supabase/schema.sql`: tabla, políticas RLS y permisos.

## Configuración

1. Crea un proyecto en https://supabase.com/.
2. En **SQL Editor**, ejecuta el contenido de `supabase/schema.sql`.
3. En **Project Settings > API** (o Connect), copia la Project URL y la clave publicable (`publishable`) o `anon` (`anon public`).
4. Pega esos valores en `config.js`. No uses la clave `service_role` ni una clave secreta.
5. En **Authentication > URL Configuration**, agrega la URL publicada de GitHub Pages como Site URL y Redirect URL si corresponde.
6. En **Authentication > Users**, crea al menos un usuario de prueba con correo y contraseña.
7. Sube todos los archivos y carpetas de este proyecto a un repositorio GitHub.
8. En el repositorio, abre **Settings > Pages**. Selecciona **Deploy from a branch**, rama `main`, carpeta `/(root)` y guarda.
9. Espera a que GitHub Pages publique el sitio y abre la URL que aparece en Settings > Pages.

## Pruebas para la demostración

1. Inicia sesión con el usuario de prueba.
2. Abre Resumen y comprueba el indicador de empleados.
3. Entra en Empleados y registra un empleado ficticio.
4. Busca el registro y elimínalo.
5. Recarga la página e inicia sesión nuevamente para comprobar que los datos persisten.

## Seguridad y alcance

La clave `anon`/publishable puede utilizarse en el navegador únicamente porque la tabla está protegida con RLS. Nunca publiques la clave `service_role`, contraseñas ni secretos. La política SQL incluida es adecuada para una demostración académica: todos los usuarios autenticados pueden consultar, insertar y eliminar empleados. No representa un esquema completo de roles empresariales.

## Costos y limpieza

Consulta los límites y precios vigentes de GitHub y Supabase antes de publicar. Al terminar la demostración, elimina los recursos que no necesites desde el panel de Supabase. GitHub Pages publica contenido estático; la autenticación y los datos se gestionan en Supabase.
