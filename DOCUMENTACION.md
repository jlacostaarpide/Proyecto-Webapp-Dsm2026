# CineApp DSM - Documentación Técnica del Proyecto

Este documento describe la arquitectura, los componentes y las características de React utilizadas en el desarrollo de la aplicación CineApp DSM, una plataforma de Video on Demand (VOD) desarrollada como proyecto de la asignatura DSM de Yoel Agirretxe y Juan Lacosta.

- **Repositorio GitHub**: https://github.com/jlacostaarpide/Proyecto-Webapp-Dsm2026
- **Despliegue en Firebase Hosting**: https://webapp-react-dsm2026.web.app/

---

## Arquitectura y Características de React

El proyecto utiliza una arquitectura basada en componentes funcionales, aprovechando las capacidades modernas de React para gestionar el estado y los efectos secundarios.

### 1. Gestión del Estado Global (Context API)

Se ha implementado **`AuthContext`** para gestionar el estado de autenticación en toda la aplicación. Esto evita el problema del *prop drilling* (pasar props manualmente por múltiples niveles) y permite que cualquier componente acceda al estado de sesión directamente.

`App.jsx` envuelve toda la aplicación en el proveedor:

```jsx
<AuthContext.Provider value={{ login, username, idToken, userId, onLogout: handleLogout }}>
  <Header />
  <main>...</main>
  <Footer />
</AuthContext.Provider>
```

Los componentes que necesitan el estado de sesión lo consumen con `useContext(AuthContext)`, como `Header.jsx`, `MovieDetail.jsx` o `Favorites.jsx`.

### 2. Hooks de React

- **`useState`**: Gestiona estados locales en todos los componentes. Se usa para el texto de búsqueda, filtros de categorías, datos del formulario, comentarios, valoraciones, estado de favoritos, etc.
- **`useEffect`**: Ejecuta efectos secundarios asincrónicos. Se utiliza para:
  - Cargar ratings, comentarios y favoritos desde Firebase al montar un componente.
  - Comprobar si el usuario ya ha votado o comentado.
  - Restaurar la sesión desde `localStorage` al iniciar la aplicación.
- **`useContext`**: Consume el `AuthContext` para obtener `login`, `username`, `idToken` y `userId` sin necesidad de props.
- **`useParams`**: Extrae el parámetro dinámico `:id` de la URL en `MovieDetail.jsx` para identificar qué película mostrar.
- **`useNavigate`**: Realiza redirecciones programáticas, por ejemplo al enviar un comentario sin sesión iniciada o al hacer logout.

### 3. Props y flujo de datos entre componentes

En React, los datos fluyen de componentes padres a hijos mediante **props**. En este proyecto, `App.jsx` actúa como componente raíz y distribuye los datos necesarios:

- `Home` recibe `peliculas` (el array completo) para renderizar el catálogo y el carrusel.
- `MovieDetail` recibe `peliculas` para localizar la película activa por `id` y calcular las recomendaciones.
- `Favorites` recibe `peliculas` para cruzarlos con los IDs favoritos del usuario guardados en Firebase.
- `Login` recibe `onLogin`, una función callback que, al ejecutarse, actualiza el estado global en `App.jsx` (patrón *lifting state up*).

Este patrón permite que los componentes hijos notifiquen cambios al padre sin acoplarse directamente.

### 4. Renderizado condicional

El proyecto hace un uso intensivo del renderizado condicional para adaptar la interfaz al estado del usuario:

- **`Header.jsx`**: Muestra "Login / Registro" si el usuario no está autenticado, o el nombre de usuario y el botón de logout si lo está.
- **`MovieDetail.jsx`**: Muestra el formulario de comentarios solo si el usuario está logueado y aún no ha comentado. Si ya comentó, muestra un aviso. Si no ha iniciado sesión, muestra un enlace al login.
- **`MovieDetail.jsx`**: El botón de favoritos cambia su texto, color e icono según el estado de `isFavorite`.
- **`Favorites.jsx`**: Redirige automáticamente a `/login` si el usuario no está autenticado, actuando como ruta protegida.
- **`Login.jsx` / `Register.jsx`**: Muestran una pantalla de éxito en lugar del formulario cuando la operación se completa correctamente.

### 5. Componentes controlados (Controlled Components)

Los formularios utilizan el patrón de **componentes controlados**: el valor de cada `<input>` o `<textarea>` está enlazado a una variable de estado mediante `value`, y se actualiza con `onChange`. Esto garantiza que React sea siempre la fuente de verdad del formulario.

Ejemplo en `Login.jsx` — un único `handleChange` gestiona todos los campos del formulario usando el atributo `name`:

```jsx
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

<Form.Control name="email" value={formData.email} onChange={handleChange} />
<Form.Control name="password" value={formData.password} onChange={handleChange} />
```

Este mismo patrón se aplica en `Register.jsx`, `Contact.jsx` y el formulario de comentarios en `MovieDetail.jsx`.

### 6. Enrutamiento (React Router v7)

Se utiliza un sistema de rutas dinámico para separar las vistas de la aplicación:

| Ruta | Componente | Tipo |
|------|-----------|------|
| `/` | `Home` | Pública |
| `/login` | `Login` | Pública |
| `/register` | `Register` | Pública |
| `/movie/:id` | `MovieDetail` | Dinámica |
| `/favorites` | `Favorites` | Protegida |
| `/contact` | `Contact` | Pública |
| `/legal` | `LegalNotice` | Pública |
| `*` | `ErrorPage` | Comodín (404) |

### 7. Persistencia de Datos (Google Firebase)

Se ha integrado toda la persistencia en la nube mediante la **API REST de Firebase** usando **Axios**:

- **Firebase Authentication**: Gestión real de usuarios con el Identity Toolkit de Google.
- **Firebase Realtime Database**: Almacenamiento en tiempo real de favoritos, valoraciones y comentarios.
- **Seguridad**: Las peticiones a datos privados (favoritos) incluyen el `idToken` en la URL (`?auth={idToken}`) para autenticación.
- **Persistencia de sesión**: Los tokens (`idToken`, `userId`, `email`) se guardan en `localStorage` para que la sesión sobreviva a recargas de página.

---

## Descripción de Componentes

### Componentes de Interfaz (UI)

#### `Header.jsx`
Barra de navegación fija en la parte superior de todas las páginas. Utiliza `useContext(AuthContext)` para leer el estado de autenticación y renderiza contenido diferente según el caso:
- **Usuario no autenticado**: Muestra los enlaces "Login" y "Registro".
- **Usuario autenticado**: Muestra el enlace "Mis Favoritos", el nombre del usuario y un botón de logout.

Al hacer logout llama a `onLogout()` del contexto (que limpia el estado en `App.jsx` y el `localStorage`) y redirige al inicio con `useNavigate`.

#### `Footer.jsx`
Pie de página estático presente en todas las vistas. Contiene el copyright de la aplicación y enlaces a las páginas de Aviso Legal y Contacto.

#### `Peliculas.jsx`
Componente contenedor que recibe un array `peliculas` como prop y lo renderiza en una cuadrícula responsive con el sistema de grid de React Bootstrap (`Row` y `Col`). Configura el número de columnas según el tamaño de pantalla: 1 en móvil, 2 en tablet, 4 en escritorio.

#### `Pelicula.jsx`
Tarjeta individual de película. Recibe los datos de una película como props y muestra: imagen, título, categoría, descripción recortada y botón de acceso a la ficha. Además, al montarse ejecuta un `useEffect` que consulta Firebase para obtener en tiempo real la nota media y el número de comentarios, mostrándolos como badges dinámicos.

---

### Páginas (Vistas principales)

#### `Home.jsx`
Página principal y punto de entrada al catálogo. Recibe el array `peliculas` como prop y gestiona dos estados locales:
- `categoriaActiva` (`useState`): Categoría seleccionada actualmente.
- `searchQuery` (`useState`): Texto introducido en el buscador.

El array de películas filtradas se calcula directamente en el render combinando ambos filtros:

```jsx
const peliculasFiltradas = peliculas.filter(p => {
  const matchesCategory = categoriaActiva === 'Todas' || p.categoria === categoriaActiva;
  const matchesSearch = p.titulo.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesCategory && matchesSearch;
});
```

Las categorías del filtro se generan dinámicamente con `Set` para evitar duplicados. Incluye un **carrusel** (componente `Carousel` de React Bootstrap) con las 3 primeras películas y un estado vacío con botón para resetear los filtros.

#### `MovieDetail.jsx`
El componente más complejo del proyecto. Recibe `peliculas` como prop y usa `useParams` para obtener el `:id` de la URL, localizando la película activa. Gestiona 9 estados locales independientes y realiza 3 llamadas a Firebase en el mismo `useEffect`:

- **Valoraciones**: Sistema interactivo de 5 estrellas. `hoverRating` controla el efecto visual previo al clic. `averageRating` y `totalRatings` se calculan a partir de los datos de Firebase. `hasVoted` (comprobado por `userId`) bloquea votos duplicados. Si el usuario no ha iniciado sesión, redirige al login.
- **Favoritos**: Al montar el componente consulta Firebase para saber si la película ya es favorita (`isFavorite`). El botón toggle ejecuta `PUT true` para añadir o `DELETE` para quitar, y el estado se actualiza localmente sin recargar la página.
- **Comentarios**: Carga los comentarios existentes desde Firebase y comprueba con `hasCommented` (comparando `username`) si el usuario ya escribió uno. Los nuevos comentarios se publican con `POST`. El hilo se muestra en orden cronológico inverso con `.slice().reverse()`.
- **Recomendaciones**: Array derivado calculado filtrando `peliculas` por la misma categoría y excluyendo la película actual, mostrando hasta 4 sugerencias.

#### `Login.jsx`
Formulario de inicio de sesión. Gestiona los campos como componente controlado con un único `handleChange` que usa `e.target.name` como clave dinámica. Al enviar el formulario realiza un `POST` al endpoint `signInWithPassword` de Firebase Identity Toolkit. Si la respuesta es correcta, llama a la prop `onLogin` con el `idToken` y `localId`, actualizando el estado global en `App.jsx`. Distingue y muestra mensajes de error específicos para credenciales incorrectas, cuenta deshabilitada o demasiados intentos.

#### `Register.jsx`
Formulario de registro de nuevos usuarios. Realiza validaciones en cliente antes de llamar a la API: las contraseñas deben coincidir y tener al menos 6 caracteres. Si la validación pasa, hace un `POST` al endpoint `signUp` de Firebase. Detecta el error `EMAIL_EXISTS` para informar al usuario de que el correo ya está registrado. Al completarse con éxito muestra una pantalla de confirmación con enlace al login.

#### `Favorites.jsx`
Página protegida que muestra las películas favoritas del usuario activo. Usa `useContext(AuthContext)` para obtener `login`, `userId` e `idToken`. En el `useEffect`, si el usuario no está autenticado, redirige a `/login` con `useNavigate`. Si lo está, realiza un `GET` a Firebase a `/favorites/{userId}` para obtener los IDs de las películas favoritas, los cruza con el array `peliculas` recibido por prop y actualiza el estado `favoritePeliculas`. Muestra el grid de películas o un estado vacío si el usuario aún no tiene favoritos.

#### `Contact.jsx`
Página estática con formulario de contacto (nombre, email, mensaje). Gestiona los campos como componente controlado con `useState`. Al enviar muestra una pantalla de confirmación. Es una página estática para cumplir con los requisitos de información de la aplicación.

#### `LegalNotice.jsx`
Página estática con tres secciones de información legal: Aviso Legal (cumplimiento LSSICE), Política de Privacidad (cumplimiento GDPR) y Política de Cookies. Incluye un aviso de uso educativo.

#### `ErrorPage.jsx`
Página de error 404. Se activa automáticamente con la ruta comodín `path="*"` en `App.jsx`, capturando cualquier URL no reconocida. Muestra un mensaje de error claro y un enlace para volver al inicio.

---

## Estructura de Datos en Firebase

La aplicación utiliza **Firebase Realtime Database** como backend en la nube. Los datos se organizan en tres colecciones principales:

### Valoraciones (`/ratings`)
```json
{
  "ratings": {
    "{movieId}": {
      "{userId}": 4
    }
  }
}
```
Cada película tiene un nodo con el `userId` de cada votante como clave y su puntuación numérica (1-5) como valor. Esto garantiza un único voto por usuario por película. La media se calcula en cliente sumando todos los valores y dividiendo entre el total.

### Comentarios (`/comments`)
```json
{
  "comments": {
    "{movieId}": {
      "{autoId}": {
        "username": "nombre_usuario",
        "text": "Texto del comentario",
        "date": "17/3/2026"
      }
    }
  }
}
```
Firebase genera automáticamente un ID único para cada comentario al usar `POST`. Se verifica si el usuario ya comentó comparando su `username` con los comentarios existentes.

### Favoritos (`/favorites`)
```json
{
  "favorites": {
    "{userId}": {
      "{movieId}": true
    }
  }
}
```
Cada usuario tiene su propio nodo con los IDs de sus películas favoritas como claves y `true` como valor. Para añadir se usa `PUT true` y para eliminar `DELETE`. Las peticiones a `/favorites` requieren el `idToken` de Firebase como autenticación (`?auth={idToken}`).

---

## Tecnologías Utilizadas

| Tecnología | Versión | Uso en el proyecto |
|-----------|---------|-------------------|
| **React** | 19.2.4 | Biblioteca principal para la interfaz de usuario |
| **Vite** | 8.0.0 | Herramienta de construcción y servidor de desarrollo |
| **React Router** | 7.13.1 | Enrutamiento SPA, rutas dinámicas y navegación programática |
| **React Bootstrap** | 2.10.10 | Componentes UI responsive (Navbar, Carousel, Card, Alert...) |
| **Bootstrap** | 5.3.8 | Sistema de grid y estilos base |
| **Axios** | 1.13.6 | Cliente HTTP para comunicación con la API REST de Firebase |
| **Firebase SDK** | 12.10.0 | Configuración de proyecto y despliegue en Firebase Hosting |
| **Firebase Realtime DB** | (Cloud) | Base de datos en tiempo real para ratings, comentarios y favoritos |
| **Firebase Auth** | (Cloud) | Autenticación de usuarios mediante Identity Toolkit |
| **CSS3** | — | Estilos personalizados, efectos hover y diseño dark mode |
