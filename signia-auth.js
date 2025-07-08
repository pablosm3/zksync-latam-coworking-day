/**
 * Signia Auth Configuration for ZKsync LATAM Cowork Day
 * Adapted from Next.js implementation to vanilla JavaScript
 */

// ⚠️ CONFIGURACIÓN REQUERIDA - Reemplazar con valores reales
const SIGNIA_CONFIG = {
    clientId: 'TU_CLIENT_ID',           // Obtener del Dashboard de Signia Auth
    issuer: 'TU_ISSUER_URL',            // URL del servidor de Signia Auth
    redirectUri: 'http://localhost:3000/callback.html',  // ⚠️ Debe coincidir con puerto 3000
    scopes: ['openid', 'profile', 'email']
};

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
        // Simular intercambio de código por tokens
        // En una implementación real, esto se haría con el servidor de Signia Auth
        console.log('Exchanging code for tokens:', code);
        
        // Mock response - en producción esto viene del servidor
        return {
            access_token: 'mock_access_token_' + Date.now(),
            id_token: 'mock_id_token_' + Date.now(),
            token_type: 'Bearer',
            expires_in: 3600
        };
    }

    async processTokens(tokens) {
        // Guardar tokens
        this.accessToken = tokens.access_token;
        localStorage.setItem('signia_access_token', tokens.access_token);

        // Procesar ID token para obtener información del usuario
        // En una implementación real, decodificarías el JWT
        this.user = {
            sub: 'user_' + Date.now(),
            name: 'Usuario Demo',
            email: 'demo@example.com',
            picture: null
        };

        localStorage.setItem('signia_user', JSON.stringify(this.user));
        this.isAuthenticated = true;
    }

    logout() {
        // Limpiar estado de autenticación
        this.clearAuthState();
        
        // Redirigir a la página de bienvenida
        window.location.href = '/welcome.html';
    }

    clearAuthState() {
        this.isAuthenticated = false;
        this.user = null;
        this.accessToken = null;
        
        // Limpiar localStorage
        localStorage.removeItem('signia_access_token');
        localStorage.removeItem('signia_user');
        localStorage.removeItem('signia_auth_state');
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