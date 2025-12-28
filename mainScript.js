// JavaScript para funcionalidades adicionales
document.addEventListener('DOMContentLoaded', function() {
    
    const buttons = document.querySelectorAll('.nav-button');
    
    buttons.forEach(button => {
        // Efecto visual adicional al pasar el mouse
        button.addEventListener('mouseenter', function() {
            
            // new Audio('hover-sound.mp3').play();
            
            // Cambiar cursor
            this.style.cursor = 'pointer';
        });
        
        // Mostrar en consola al hacer clic
        button.addEventListener('click', function(e) {
            const pageName = this.querySelector('h4').textContent;
            console.log(`Navegando a: ${this.getAttribute('href')} (${pageName})`);
            
        });
    });
});