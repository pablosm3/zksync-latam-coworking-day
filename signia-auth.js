/**
 * Signia Auth Configuration for ZKsync LATAM Cowork Day
 * Adapted from Next.js implementation to vanilla JavaScript
 */

// ✅ CONFIGURACIÓN DE SIGNIA AUTH - ZKsync LATAM
// Detectar entorno automáticamente
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const baseUrl = isDevelopment ? 'http://localhost:3000' : 'https://zksynclatam.terolabs.xyz';

const SIGNIA_CONFIG = {
    clientId: 'a32c0de5-5701-4228-b846-3de45df3c2fb',    // Client ID de Signia Auth
    issuer: 'https://zksynclatam.signiaauth.com',          // Servidor de Signia Auth
    redirectUri: `${baseUrl}/callback.html`,               // Callback automático (dev/prod)
    scopes: ['openid', 'profile', 'email']
};

console.log('🔐 Signia Auth Config:', {
    environment: isDevelopment ? 'Development' : 'Production',
    redirectUri: SIGNIA_CONFIG.redirectUri,
    issuer: SIGNIA_CONFIG.issuer
});

// Configuración del cliente OIDC
class SigniaAuthClient {
    constructor(config) {
        this.config = config;
        this.isAuthenticated = false;
        this.user = null;
        this.accessToken = null;
        this.init();
    }

    init() {
        // Verificar si hay una sesión activa
        this.checkAuthState();
        
        // Configurar event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listener para el botón de login
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.login());
        }

        // Event listener para el botón de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    checkAuthState() {
        // Verificar si hay tokens guardados en localStorage
        const storedToken = localStorage.getItem('signia_access_token');
        const storedUser = localStorage.getItem('signia_user');

        if (storedToken && storedUser) {
            this.accessToken = storedToken;
            this.user = JSON.parse(storedUser);
            this.isAuthenticated = true;
            
            // Verificar si el token sigue siendo válido
            this.validateToken();
        }
    }

    async validateToken() {
        try {
            // Aquí puedes agregar validación del token con el servidor
            // Por ahora, asumimos que el token es válido
            console.log('Token validation successful');
        } catch (error) {
            console.error('Token validation failed:', error);
            this.clearAuthState();
        }
    }

    login() {
        try {
            // Mostrar estado de carga
            this.showLoadingState();

            // Construir URL de autorización
            const authUrl = this.buildAuthUrl();
            
            // Redirigir a la página de autenticación
            window.location.href = authUrl;
        } catch (error) {
            console.error('Login error:', error);
            this.hideLoadingState();
            alert('Error al iniciar sesión. Por favor, intenta de nuevo.');
        }
    }

    buildAuthUrl() {
        const params = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            response_type: 'code',
            scope: this.config.scopes.join(' '),
            state: this.generateState()
        });

        // Guardar state en localStorage para verificación
        localStorage.setItem('signia_auth_state', params.get('state'));

        return `${this.config.issuer}/auth?${params.toString()}`;
    }

    generateState() {
        // Generar un estado aleatorio para seguridad
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    async handleCallback(code, state) {
        try {
            // Verificar state
            const storedState = localStorage.getItem('signia_auth_state');
            if (state !== storedState) {
                throw new Error('Invalid state parameter');
            }

            // Intercambiar código por tokens
            const tokens = await this.exchangeCodeForTokens(code);
            
            // Procesar tokens
            await this.processTokens(tokens);
            
            // Redirigir a la página principal
            window.location.href = '/index.html';
        } catch (error) {
            console.error('Callback error:', error);
            alert('Error en la autenticación. Por favor, intenta de nuevo.');
            window.location.href = '/welcome.html';
        }
    }

    async exchangeCodeForTokens(code) {
        try {
            console.log('🔄 Exchanging authorization code for tokens...');
            
            // Realizar solicitud de token a Signia Auth
            const tokenResponse = await fetch(`${this.config.issuer}/oauth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: this.config.clientId,
                    code: code,
                    redirect_uri: this.config.redirectUri
                })
            });

            if (!tokenResponse.ok) {
                const errorData = await tokenResponse.text();
                throw new Error(`Token exchange failed: ${tokenResponse.status} - ${errorData}`);
            }

            const tokens = await tokenResponse.json();
            console.log('✅ Tokens received successfully');
            
            return tokens;
        } catch (error) {
            console.error('❌ Token exchange error:', error);
            throw error;
        }
    }

    async processTokens(tokens) {
        try {
            console.log('🔄 Processing tokens and extracting user info...');
            
            // Guardar tokens
            this.accessToken = tokens.access_token;
            localStorage.setItem('signia_access_token', tokens.access_token);
            
            if (tokens.id_token) {
                localStorage.setItem('signia_id_token', tokens.id_token);
            }

            // Decodificar ID token para obtener información del usuario
            if (tokens.id_token) {
                this.user = this.decodeJWT(tokens.id_token);
            } else {
                // Fallback: obtener info del usuario usando userinfo endpoint
                this.user = await this.fetchUserInfo();
            }

            localStorage.setItem('signia_user', JSON.stringify(this.user));
            this.isAuthenticated = true;
            
            console.log('✅ User authenticated:', {
                name: this.user.name,
                email: this.user.email,
                sub: this.user.sub
            });
        } catch (error) {
            console.error('❌ Token processing error:', error);
            throw error;
        }
    }

    // Función para decodificar JWT (simple, sin verificación de firma)
    decodeJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            
            return {
                sub: payload.sub,
                name: payload.name || payload.preferred_username || 'Usuario',
                email: payload.email,
                picture: payload.picture,
                given_name: payload.given_name,
                family_name: payload.family_name
            };
        } catch (error) {
            console.error('❌ JWT decode error:', error);
            throw new Error('Failed to decode user information');
        }
    }

    // Función para obtener información del usuario del endpoint userinfo
    async fetchUserInfo() {
        try {
            const response = await fetch(`${this.config.issuer}/userinfo`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`UserInfo request failed: ${response.status}`);
            }

            const userInfo = await response.json();
            
            return {
                sub: userInfo.sub,
                name: userInfo.name || userInfo.preferred_username || 'Usuario',
                email: userInfo.email,
                picture: userInfo.picture,
                given_name: userInfo.given_name,
                family_name: userInfo.family_name
            };
        } catch (error) {
            console.error('❌ UserInfo fetch error:', error);
            throw error;
        }
    }

    logout() {
        // Limpiar estado de autenticación
        this.clearAuthState();
        
        // Redirigir a la página de bienvenida
        window.location.href = '/welcome.html';
    }

    clearAuthState() {
        console.log('🚪 Clearing authentication state...');
        
        this.isAuthenticated = false;
        this.user = null;
        this.accessToken = null;
        
        // Limpiar localStorage
        localStorage.removeItem('signia_access_token');
        localStorage.removeItem('signia_id_token');
        localStorage.removeItem('signia_user');
        localStorage.removeItem('signia_auth_state');
        
        console.log('✅ Authentication state cleared');
    }

    showLoadingState() {
        const loginBtn = document.getElementById('loginBtn');
        const loadingMessage = document.getElementById('loadingMessage');
        
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.style.display = 'none';
        }
        
        if (loadingMessage) {
            loadingMessage.style.display = 'block';
        }
    }

    hideLoadingState() {
        const loginBtn = document.getElementById('loginBtn');
        const loadingMessage = document.getElementById('loadingMessage');
        
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.style.display = 'block';
        }
        
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }
    }
}

// Función para verificar autenticación en páginas protegidas
function checkAuthentication() {
    const authClient = new SigniaAuthClient(SIGNIA_CONFIG);
    
    if (!authClient.isAuthenticated) {
        // Redirigir a la página de bienvenida si no está autenticado
        window.location.href = '/welcome.html';
        return false;
    }
    
    return authClient.user;
}

// Función para mostrar información del usuario
function displayUserInfo(user) {
    // Actualizar el título con el nombre del usuario
    const title = document.querySelector('h1');
    if (title && user.name) {
        title.textContent = `¡Bienvenido, ${user.name}!`;
    }
    
    // Puedes agregar más lógica aquí para mostrar información del usuario
    console.log('Usuario autenticado:', user);
}

// Inicializar cliente de autenticación
document.addEventListener('DOMContentLoaded', function() {
    window.signiaAuth = new SigniaAuthClient(SIGNIA_CONFIG);
    
    // Si estamos en una página protegida, verificar autenticación
    if (window.location.pathname.includes('index.html')) {
        const user = checkAuthentication();
        if (user) {
            displayUserInfo(user);
        }
    }
});

// Exportar para uso global
window.SigniaAuthClient = SigniaAuthClient;
window.checkAuthentication = checkAuthentication; 