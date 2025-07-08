# 🔐 Configuración de Signia Auth - ZKsync LATAM Cowork Day

## ✅ Configuración Completada

La autenticación con Signia Auth ya está completamente configurada y lista para usar.

### 🔧 Credenciales Configuradas

```javascript
const SIGNIA_CONFIG = {
    clientId: 'a32c0de5-5701-4228-b846-3de45df3c2fb',    // ✅ Configurado
    issuer: 'https://zksynclatam.signiaauth.com',          // ✅ Configurado
    redirectUri: 'auto-detected',                          // ✅ Auto-detecta dev/prod
    scopes: ['openid', 'profile', 'email']               // ✅ Configurado
};
```

### 🔗 URLs de Callback Configuradas

Las siguientes URLs deben estar configuradas en el Dashboard de Signia Auth como callbacks autorizados:

- **Desarrollo**: `http://localhost:3000/callback.html` 
- **Producción**: `https://zksynclatam.terolabs.xyz/callback.html`

✅ **Auto-detección**: El sistema detecta automáticamente el entorno y usa la URL correcta.

### 🔌 Endpoints de Signia Auth

- **Issuer**: `https://zksynclatam.signiaauth.com`
- **Authorization**: `https://zksynclatam.signiaauth.com/auth`
- **Token**: `https://zksynclatam.signiaauth.com/oauth/token`
- **UserInfo**: `https://zksynclatam.signiaauth.com/userinfo`

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