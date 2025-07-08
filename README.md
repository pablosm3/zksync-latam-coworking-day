# 🚀 ZKsync LATAM Cowork Day

Un sitio web responsive con autenticación Signia para el registro de participantes en el evento ZKsync LATAM Cowork Day.

## 🔐 Autenticación

Este proyecto utiliza **Signia Auth** para proporcionar autenticación sin contraseñas y segura.

## Características

- **🔐 Autenticación Signia**: Autenticación sin contraseñas segura y moderna
- **📱 Diseño Responsive**: Se adapta perfectamente a dispositivos móviles, tablets y desktop
- **🎨 Interfaz Moderna**: Diseño limpio inspirado en ZKsync con gradientes y animaciones suaves
- **🏷️ Logo Oficial**: Logo oficial de ZKsync integrado
- **🎯 Paleta ZKsync**: Colores azules oficiales de la marca
- **✅ Validación en Tiempo Real**: Validación de formularios con mensajes de error claros
- **🎭 Animaciones**: Efectos visuales atractivos para mejorar la experiencia del usuario
- **♿ Accesibilidad**: Cumple con las mejores prácticas de accesibilidad web
- **🔒 Páginas Protegidas**: Control de acceso basado en autenticación

## Campos del Formulario

1. **TL Handle**: Handle de Twitter/X del participante
2. **Email de LUMA**: Email utilizado para la inscripción en LUMA

## Tecnologías Utilizadas

- HTML5
- CSS3 (Flexbox, Grid, Animaciones)
- JavaScript (ES6+)
- Diseño Mobile-First

## 📁 Estructura del Proyecto

```
zksync-cowork-day/
├── welcome.html          # 🏠 Página de bienvenida (pública)
├── index.html            # 📝 Formulario de registro (protegida)
├── callback.html         # 🔄 Callback de autenticación
├── signia-auth.js        # 🔐 Cliente de autenticación Signia
├── script.js             # ⚙️ Lógica del formulario
├── styles.css            # 🎨 Estilos CSS
├── zksync-light.png      # 🏷️ Logo oficial de ZKsync
├── config.md             # ⚚️ Configuración de Signia Auth
└── README.md             # 📚 Documentación
```

## 🚀 Flujo de Navegación

1. **`/welcome.html`** → Página pública con botón de autenticación
2. **Signia Auth** → Autenticación sin contraseñas
3. **`/callback.html`** → Procesa retorno de autenticación
4. **`/index.html`** → Formulario de registro (requiere autenticación)

## 🔧 Configuración Inicial

### 1. Configurar Signia Auth

Edita `signia-auth.js` y reemplaza las credenciales:

```javascript
const SIGNIA_CONFIG = {
    clientId: 'TU_CLIENT_ID',           // ⚠️ Dashboard de Signia Auth
    issuer: 'TU_ISSUER_URL',            // ⚠️ URL del servidor Signia
    redirectUri: 'http://localhost:3000/callback.html',
    scopes: ['openid', 'profile', 'email']
};
```

### 2. Configurar Callback en Signia Auth Dashboard

Agregar estas URLs como callbacks autorizados:
- **Desarrollo**: `http://localhost:3000/callback.html`
- **Producción**: `https://zksynclatam.terolabs.xyz/callback.html`

## 🚀 Cómo Usar

1. **Desarrollo**: Iniciar servidor en puerto 3000
   ```bash
   python3 -m http.server 3000
   ```
2. **Acceder**: Ir a `http://localhost:3000/welcome.html`
3. **Autenticarse**: Hacer clic en "Iniciar Sesión con Signia"
4. **Registrarse**: Completar formulario en `index.html`

## Personalización

Para personalizar el sitio:

1. **Colores**: Modifica las variables de color en `styles.css`
2. **Campos**: Actualiza los campos del formulario en `index.html`
3. **Validación**: Modifica las reglas de validación en `script.js`
4. **Procesamiento**: Implementa el backend para procesar los datos del formulario

## ✅ Próximos Pasos

- [x] Aplicar diseño y paleta de colores de ZKsync
- [x] Simplificar formulario a solo 2 campos (TL Handle y Email LUMA)  
- [x] Integrar logo oficial de ZKsync
- [x] Implementar autenticación con Signia Auth
- [x] Crear páginas de bienvenida y callback
- [x] Agregar protección de páginas
- [ ] **⚠️ Configurar credenciales reales de Signia Auth**
- [ ] Implementar backend para procesamiento de datos autenticados
- [ ] Agregar integración con base de datos de usuarios
- [ ] Implementar confirmación por email post-registro
- [ ] Agregar validaciones específicas del evento
- [ ] Agregar analytics y tracking de usuarios

## 📖 Documentación Adicional

Para configuración detallada de Signia Auth, consulta:
- **`config.md`** - Configuración paso a paso
- **`SIGNIA-AUTH-SETUP.md`** - Documentación completa de Signia Auth

## Soporte

Para cualquier pregunta o problema, contacta al equipo de desarrollo. 