document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.querySelector('.submit-btn');
    
    // Agregar efectos visuales a los inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Manejar el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener los datos del formulario
        const formData = new FormData(form);
        const data = {
            tlHandle: formData.get('tlHandle'),
            lumaEmail: formData.get('lumaEmail')
        };
        
        // Validar los datos
        if (!validateForm(data)) {
            return;
        }
        
        // Cambiar el estado del botón
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        // Simular envío de datos (aquí puedes agregar la lógica real)
        setTimeout(() => {
            console.log('Datos enviados:', data);
            showSuccessMessage();
            
            // Resetear el formulario
            form.reset();
            
            // Restaurar el botón
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar';
        }, 2000);
    });
    
    function validateForm(data) {
        let isValid = true;
        
        // Validar TL Handle
        if (!data.tlHandle || data.tlHandle.trim().length < 3) {
            showError('tlHandle', 'El TL Handle debe tener al menos 3 caracteres');
            isValid = false;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.lumaEmail || !emailRegex.test(data.lumaEmail)) {
            showError('lumaEmail', 'Ingresa un email válido');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.parentElement;
        
        // Remover errores anteriores
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Agregar clase de error
        field.classList.add('error');
        
        // Crear mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
        
        // Remover error cuando el usuario empiece a escribir
        field.addEventListener('input', function() {
            this.classList.remove('error');
            const errorMsg = this.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    }
    
    function showSuccessMessage() {
        // Crear mensaje de éxito
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
                <span>¡Datos enviados exitosamente!</span>
            </div>
        `;
        
        // Insertar antes del formulario
        form.parentNode.insertBefore(successDiv, form);
        
        // Remover mensaje después de 5 segundos
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
    
    // Agregar animación de escritura al título
    const title = document.querySelector('h1');
    const titleText = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < titleText.length) {
            title.textContent += titleText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    setTimeout(typeWriter, 500);
}); 