// JavaScript para funcionalidades adicionales
document.addEventListener('DOMContentLoaded', function() {
    
    const buttons = document.querySelectorAll('.nav-button');
    
    buttons.forEach(button => {
        // Efecto visual adicional al pasar el mouse
        button.addEventListener('mouseenter', function() {
            
            // new Audio('hover-sound.mp3').play();
            
            this.style.cursor = 'pointer';
        });
        
        // Mostrar en consola al hacer clic
        button.addEventListener('click', function(e) {
            
        });
    });
});