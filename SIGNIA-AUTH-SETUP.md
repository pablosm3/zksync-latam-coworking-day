# 🔐 Guía de Implementación: Signia Auth en Next.js

Esta guía te ayudará a implementar Signia Auth en tu proyecto Next.js con la misma configuración que usamos en FIDELI.

## 📋 Requisitos Previos

- Next.js 13+ con App Router
- TypeScript (recomendado)
- Node.js 18+
- **Puerto 3000 disponible** (obligatorio para callback)

## 🔧 Credenciales Necesarias

Antes de comenzar, necesitarás obtener las siguientes credenciales de Signia Auth:

```typescript
// Credenciales que necesitas configurar:
const oidcClient = new OIDCClient({
  clientId: 'TU_CLIENT_ID',              // Obtener de Signia Auth Dashboard
  redirectUri: 'http://localhost:3000/oidc-callback',
  issuer: 'TU_ISSUER_URL',               // URL del servidor de Signia Auth
  scopes: ['openid', 'profile', 'email']
});
```

**📝 Dónde obtener las credenciales:**
- `clientId`: Dashboard de Signia Auth > Tu aplicación > Client ID
- `issuer`: Dashboard de Signia Auth > Tu aplicación > Issuer URL
- `redirectUri`: Debe estar configurado en Signia Auth Dashboard como callback autorizado

---

## 🚀 Paso 1: Instalación de Dependencias

```bash
npm install @getsignia/signia-auth-sdk@^0.1.5 @getsignia/signia-auth-ui-react@^0.1.5
```

---

## 🏗️ Paso 2: Crear el AuthProvider

Crear archivo `components/AuthProvider.tsx`:

```typescript
'use client';

import React from 'react';
import { OIDCClient } from '@getsignia/signia-auth-sdk';
import { SigniaAuthProvider } from '@getsignia/signia-auth-ui-react';

// Initialize OIDC client with discovery support
const oidcClient = new OIDCClient({
  clientId: 'TU_CLIENT_ID', // ⚠️ Reemplazar con tu Client ID real
  redirectUri: 'http://localhost:3000/oidc-callback',
  issuer: 'TU_ISSUER_URL', // ⚠️ Reemplazar con tu Issuer URL real
  scopes: ['openid', 'profile', 'email']
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SigniaAuthProvider client={oidcClient}>
      {children}
    </SigniaAuthProvider>
  );
}
```

---

## 🎯 Paso 3: Configurar el Layout Principal

Modificar `app/layout.tsx` para incluir el AuthProvider:

```typescript
import type { Metadata } from 'next'
import { AuthProvider } from '@/components/AuthProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tu App',
  description: 'Tu descripción',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

---

## 🔐 Paso 4: Implementar Autenticación en Páginas

Ejemplo de página principal con autenticación (`app/page.tsx`):

```typescript
"use client"

import { useSigniaAuth, LoginButton, LogoutButton } from '@getsignia/signia-auth-ui-react'

export default function Home() {
  const { user, isAuthenticated, isLoading } = useSigniaAuth()

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Pantalla de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
          <LoginButton>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Iniciar Sesión con Signia
            </button>
          </LoginButton>
        </div>
      </div>
    )
  }

  // Pantalla principal autenticada
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">¡Bienvenido!</h1>
          <div className="space-y-2">
            <p><strong>Nombre:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>ID:</strong> {user?.sub}</p>
          </div>
          <div className="mt-6">
            <LogoutButton>
              <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Cerrar Sesión
              </button>
            </LogoutButton>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 📋 Paso 5: Crear Hook Personalizado para Sincronización

Crear `hooks/use-user-sync.ts`:

```typescript
import { useSigniaAuth } from '@getsignia/signia-auth-ui-react';

export function useUserSync() {
  const { user, isAuthenticated, isLoading } = useSigniaAuth();

  // Aquí puedes agregar lógica para sincronizar con tu base de datos
  // Por ejemplo, crear usuarios automáticamente en primera autenticación
  
  return { user, isAuthenticated, isLoading };
}
```

---

## 🔄 Paso 6: Crear Página de Callback OIDC

Crear `app/oidc-callback/page.tsx`:

```typescript
"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSigniaAuth } from '@getsignia/signia-auth-ui-react'

export default function OIDCCallbackPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useSigniaAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirigir a la página principal después de autenticación exitosa
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Procesando autenticación...</p>
      </div>
    </div>
  )
}
```

---

## ⚙️ Paso 7: Configurar Servidor de Desarrollo

**⚠️ IMPORTANTE**: La aplicación DEBE correr en puerto 3000 para que funcione el callback.

En `package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "dev:clean": "lsof -ti:3000 | xargs kill -9 2>/dev/null || echo 'Puerto 3000 libre' && next dev -p 3000",
    "kill-port": "lsof -ti:3000 | xargs kill -9 2>/dev/null || echo 'Puerto 3000 libre'",
    "build": "next build",
    "start": "next start"
  }
}
```

---

## 🔧 Paso 8: Integración con Base de Datos (Opcional)

Para sincronizar usuarios con tu base de datos, crear `app/api/users/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, name } = body;

    // Aquí puedes agregar lógica para sincronizar con tu base de datos
    // Por ejemplo, crear o actualizar usuario en tu DB
    
    console.log('Usuario autenticado:', { id, email, name });
    
    // Ejemplo de sincronización con base de datos:
    // const user = await prisma.user.upsert({
    //   where: { id },
    //   update: { email, name, last_login: new Date() },
    //   create: { id, email, name, auth_provider: 'signia' }
    // });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## 📋 Paso 9: Comandos para Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo (puerto 3000 obligatorio)
npm run dev

# Acceder a la aplicación
# http://localhost:3000
```

---

## 🎯 Características de Esta Implementación

✅ **Autenticación sin contraseñas** con Signia Auth  
✅ **Login/Logout automático** con componentes React  
✅ **Información del usuario** disponible en toda la app  
✅ **Callback OIDC** manejado automáticamente  
✅ **Estados de carga** y manejo de errores  
✅ **Puerto 3000 requerido** para callback redirect URI  
✅ **Integración lista** para sincronizar con base de datos  

---

## 🔐 Hooks Disponibles

### `useSigniaAuth()`

```typescript
const { user, isAuthenticated, isLoading } = useSigniaAuth();

// user: Objeto con información del usuario (name, email, sub)
// isAuthenticated: Boolean indicando si está autenticado
// isLoading: Boolean indicando si está cargando
```

### Componentes Disponibles

- `<LoginButton>` - Botón para iniciar sesión
- `<LogoutButton>` - Botón para cerrar sesión
- `<SigniaAuthProvider>` - Provider principal (ya configurado)

---

## 🚨 Puntos Importantes

1. **Puerto 3000**: Obligatorio para el callback OIDC
2. **Credenciales**: Reemplazar `TU_CLIENT_ID` y `TU_ISSUER_URL` con valores reales
3. **Callback URL**: Debe estar configurado en Signia Auth Dashboard
4. **HTTPS en producción**: Cambiar `redirectUri` a HTTPS en producción

---

## 🔧 Configuración de Producción

Para producción, cambiar en `components/AuthProvider.tsx`:

```typescript
const oidcClient = new OIDCClient({
  clientId: 'TU_CLIENT_ID',
  redirectUri: 'https://tudominio.com/oidc-callback', // ⚠️ Cambiar a HTTPS
  issuer: 'TU_ISSUER_URL',
  scopes: ['openid', 'profile', 'email']
});
```

---

## 📞 Soporte

Si tienes problemas con la implementación:

1. Verifica que las credenciales estén correctas
2. Confirma que el puerto 3000 esté disponible
3. Revisa que la callback URL esté configurada en Signia Auth Dashboard
4. Consulta los logs del navegador para errores específicos

---

**¡Listo!** Con esta guía tendrás Signia Auth funcionando en tu proyecto Next.js. 