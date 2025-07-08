# 🔐 Configuración de Signia Auth - ZKsync LATAM Cowork Day

## 📋 Configuración Requerida

Para que la autenticación funcione correctamente, necesitas configurar las siguientes credenciales en el archivo `signia-auth.js`:

### 1. Client ID y Issuer URL

Reemplaza estas líneas en `signia-auth.js`:

```javascript
const SIGNIA_CONFIG = {
    clientId: 'TU_CLIENT_ID',           // ⚠️ REEMPLAZAR
    issuer: 'TU_ISSUER_URL',            // ⚠️ REEMPLAZAR
    redirectUri: 'http://localhost:3000/callback.html',
    scopes: ['openid', 'profile', 'email']
};
```

### 2. Dónde obtener las credenciales:

- **Client ID**: Dashboard de Signia Auth > Tu aplicación > Client ID
- **Issuer URL**: Dashboard de Signia Auth > Tu aplicación > Issuer URL

### 3. Configurar Callback URL en Signia Auth Dashboard:

Asegúrate de que estas URLs estén configuradas como callbacks autorizados:

- **Desarrollo**: `http://localhost:3000/callback.html`
- **Producción**: `https://zksynclatam.terolabs.xyz/callback.html`

## 🚀 Flujo de Autenticación

1. **Página de Inicio**: `welcome.html` - Página pública con botón de login
2. **Autenticación**: Usuario hace clic en "Iniciar Sesión con Signia"
3. **Callback**: `callback.html` - Procesa el retorno de autenticación
4. **Página Protegida**: `index.html` - Formulario de registro (requiere autenticación)

## 📁 Estructura de Archivos

```
zksync-cowork-day/
├── welcome.html          # Página de bienvenida (pública)
├── index.html            # Formulario de registro (protegida)
├── callback.html         # Callback de autenticación
├── signia-auth.js        # Cliente de autenticación
├── script.js             # Funcionalidad del formulario
├── styles.css            # Estilos
└── zksync-light.png      # Logo oficial
```

## 🔧 Configuración para Producción

Para producción, actualizar en `signia-auth.js`:

```javascript
const SIGNIA_CONFIG = {
    clientId: 'TU_CLIENT_ID_PRODUCCION',
    issuer: 'TU_ISSUER_URL_PRODUCCION',
    redirectUri: 'https://zksynclatam.terolabs.xyz/callback.html', // ⚠️ HTTPS
    scopes: ['openid', 'profile', 'email']
};
```

## 🎯 Páginas Disponibles

- **`/welcome.html`**: Página de bienvenida con login
- **`/index.html`**: Formulario de registro (requiere autenticación)
- **`/callback.html`**: Procesa callback de autenticación

## ⚠️ Importante

- **Puerto 3000**: El proyecto DEBE correr en puerto 3000 para desarrollo
- **HTTPS en producción**: Cambiar a HTTPS para el deployment
- **Credenciales**: No commitear credenciales reales al repositorio

## 🚀 Comandos para Desarrollo

```bash
# Iniciar servidor local en puerto 3000
python3 -m http.server 3000

# O usar cualquier servidor estático en puerto 3000
npx serve -p 3000 .
```

## 🔐 Estados de Autenticación

- **No autenticado**: Redirige a `/welcome.html`
- **Autenticando**: Muestra `/callback.html`
- **Autenticado**: Accede a `/index.html`

## 📞 Soporte

Si tienes problemas:

1. Verifica las credenciales en `signia-auth.js`
2. Confirma que el callback esté configurado en Signia Auth Dashboard
3. Revisa la consola del navegador para errores
4. Asegúrate de usar puerto 3000 en desarrollo 