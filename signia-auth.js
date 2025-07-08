/**
 * Signia Auth Configuration for ZKsync LATAM Cowork Day
 * Vanilla JavaScript implementation using OAuth2/OIDC standards
 */

// ✅ CONFIGURACIÓN CORRECTA DE SIGNIA AUTH - ZKsync LATAM
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const baseUrl = isDevelopment ? 'http://localhost:3000' : 'https://zksynclatam.terolabs.xyz';

const SIGNIA_CONFIG = {
    clientId: 'a32c0de5-5701-4228-b846-3de45df3c2fb',     // ✅ Client ID correcto
    redirectUri: `${baseUrl}/oidc-callback`,                // ✅ Callback OIDC estándar
    issuer: 'https://zksynclatam.signiaauth.com',           // ✅ Issuer correcto
    scopes: ['openid', 'profile', 'email'],
    
    // Endpoints estándar OAuth2/OIDC
    endpoints: {
        authorization: 'https://zksynclatam.signiaauth.com/auth/realms/zksynclatam/protocol/openid-connect/auth',
        token: 'https://zksynclatam.signiaauth.com/auth/realms/zksynclatam/protocol/openid-connect/token',
        userinfo: 'https://zksynclatam.signiaauth.com/auth/realms/zksynclatam/protocol/openid-connect/userinfo'
    }
};

console.log('🔐 Signia Auth Config (ZKsync LATAM):', {
    environment: isDevelopment ? 'Development' : 'Production',
    clientId: SIGNIA_CONFIG.clientId,
    redirectUri: SIGNIA_CONFIG.redirectUri,
    issuer: SIGNIA_CONFIG.issuer,
    authEndpoint: SIGNIA_CONFIG.endpoints.authorization
});

// Cliente OIDC para ZKsync LATAM
class ZKsyncSigniaAuthClient {
    constructor(config) {
        this.config = config;
        this.isAuthenticated = false;
        this.user = null;
        this.accessToken = null;
        this.init();
    }

    init() {
        this.checkAuthState();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.login());
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    checkAuthState() {
        const storedToken = localStorage.getItem('zksync_signia_token');
        const storedUser = localStorage.getItem('zksync_signia_user');

        if (storedToken && storedUser) {
            this.accessToken = storedToken;
            this.user = JSON.parse(storedUser);
            this.isAuthenticated = true;
            console.log('✅ Usuario autenticado desde localStorage:', this.user.name);
        }
    }

    login() {
        try {
            console.log('🔐 Iniciando autenticación con Signia Auth...');
            this.showLoadingState();

            const authUrl = this.buildAuthUrl();
            console.log('🔗 Redirigiendo a:', authUrl);
            
            window.location.href = authUrl;
        } catch (error) {
            console.error('❌ Error en login:', error);
            this.hideLoadingState();
            alert('Error al iniciar sesión. Por favor, intenta de nuevo.');
        }
    }

    buildAuthUrl() {
        const state = this.generateState();
        const nonce = this.generateNonce();
        
        // Guardar state y nonce para validación
        localStorage.setItem('zksync_signia_state', state);
        localStorage.setItem('zksync_signia_nonce', nonce);

        const params = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            response_type: 'code',
            scope: this.config.scopes.join(' '),
            state: state,
            nonce: nonce
        });

        return `${this.config.endpoints.authorization}?${params.toString()}`;
    }

    generateState() {
        return this.generateRandomString(32);
    }

    generateNonce() {
        return this.generateRandomString(32);
    }

    generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async handleCallback(code, state) {
        try {
            console.log('🔄 Procesando callback de autenticación...');
            
            // Validar state
            const storedState = localStorage.getItem('zksync_signia_state');
            if (state !== storedState) {
                throw new Error('Estado inválido - posible ataque CSRF');
            }

            // Intercambiar código por tokens
            const tokens = await this.exchangeCodeForTokens(code);
            
            // Procesar tokens y obtener usuario
            await this.processTokens(tokens);
            
            // Limpiar datos temporales
            localStorage.removeItem('zksync_signia_state');
            localStorage.removeItem('zksync_signia_nonce');
            
            console.log('✅ Autenticación completada exitosamente');
            
            // Redirigir a la página principal
            window.location.href = '/index.html';
            
        } catch (error) {
            console.error('❌ Error en callback:', error);
            alert(`Error de autenticación: ${error.message}`);
            window.location.href = '/welcome.html';
        }
    }

    async exchangeCodeForTokens(code) {
        try {
            console.log('🔄 Intercambiando código por tokens...');
            
            const response = await fetch(this.config.endpoints.token, {
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

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
            }

            const tokens = await response.json();
            console.log('✅ Tokens recibidos correctamente');
            return tokens;
            
        } catch (error) {
            console.error('❌ Error en intercambio de tokens:', error);
            throw error;
        }
    }

    async processTokens(tokens) {
        try {
            console.log('🔄 Procesando tokens y obteniendo información del usuario...');
            
            this.accessToken = tokens.access_token;
            localStorage.setItem('zksync_signia_token', tokens.access_token);
            
            // Obtener información del usuario
            if (tokens.id_token) {
                this.user = this.decodeJWT(tokens.id_token);
            } else {
                this.user = await this.fetchUserInfo();
            }

            // Guardar usuario
            localStorage.setItem('zksync_signia_user', JSON.stringify(this.user));
            this.isAuthenticated = true;
            
            console.log('✅ Usuario autenticado:', {
                name: this.user.name,
                email: this.user.email,
                id: this.user.sub
            });
            
        } catch (error) {
            console.error('❌ Error procesando tokens:', error);
            throw error;
        }
    }

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
            console.error('❌ Error decodificando JWT:', error);
            throw new Error('Error al decodificar información del usuario');
        }
    }

    async fetchUserInfo() {
        try {
            console.log('🔄 Obteniendo información del usuario...');
            
            const response = await fetch(this.config.endpoints.userinfo, {
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
            console.error('❌ Error obteniendo UserInfo:', error);
            throw error;
        }
    }

    logout() {
        console.log('🚪 Cerrando sesión...');
        
        // Limpiar estado local
        this.clearAuthState();
        
        // Redirigir a welcome
        window.location.href = '/welcome.html';
    }

    clearAuthState() {
        this.isAuthenticated = false;
        this.user = null;
        this.accessToken = null;
        
        // Limpiar localStorage
        localStorage.removeItem('zksync_signia_token');
        localStorage.removeItem('zksync_signia_user');
        localStorage.removeItem('zksync_signia_state');
        localStorage.removeItem('zksync_signia_nonce');
    }

    showLoadingState() {
        const loginBtn = document.getElementById('loginBtn');
        const loadingMessage = document.getElementById('loadingMessage');
        
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<div class="loading"></div> Autenticando...';
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
            loginBtn.innerHTML = 'Iniciar Sesión con Signia';
        }
        
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }
    }
}

// Inicializar cliente de autenticación
let signiaAuthClient;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Signia Auth Client...');
    signiaAuthClient = new ZKsyncSigniaAuthClient(SIGNIA_CONFIG);
    
    // Hacer el cliente disponible globalmente
    window.signiaAuthClient = signiaAuthClient;
});

// Función para verificar autenticación (usada en páginas protegidas)
function checkAuthentication() {
    if (!signiaAuthClient || !signiaAuthClient.isAuthenticated) {
        console.log('❌ Usuario no autenticado, redirigiendo a welcome...');
        window.location.href = '/welcome.html';
        return false;
    }
    return true;
}

// Función para mostrar información del usuario
function displayUserInfo(user) {
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    
    if (userNameElement) {
        userNameElement.textContent = user.name;
    }
    
    if (userEmailElement) {
        userEmailElement.textContent = user.email;
    }
}

// Exportar funciones para uso global
window.checkAuthentication = checkAuthentication;
window.displayUserInfo = displayUserInfo; 