//Marcar con atributo selected elementos al hacerlos click
//Para q el css les ponga el estilo de imagen seleccionada

const elementos = document.querySelectorAll('.proy3D-img');

document.addEventListener('click', function(e) {

    elementos.forEach(elemento => {
        const esClickEnEsteElemento = elemento === e.target || elemento.contains(e.target);

        const estabaSeleccionadoAntes = elemento.classList.contains('selected');

        elemento.classList.toggle('selected', !estabaSeleccionadoAntes && esClickEnEsteElemento);
    });
});