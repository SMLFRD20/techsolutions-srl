# TechSolutions SRL

## Implementación de Cloud Computing en un ambiente empresarial.

Sergio Lugo (24-0951) | Aarón Beltre (24-1033) | Yahiris Enc. (24-1045)

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
