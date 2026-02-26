//Marcar con atributo selected elementos al hacerlos click
//Para q el css les ponga el estilo de imagen seleccionada

const elementos = document.querySelectorAll('.proy2D-img');
let currentImage = null;

document.addEventListener('click', function(e) {

    const esClickEnVideo = currentImage && currentImage === e.target;

    if (esClickEnVideo) return;

    let NothingSelected = true;
    elementos.forEach(elemento => {
        
        const esClickEnEsteElemento = elemento === e.target || elemento.contains(e.target);

        const estabaSeleccionadoAntes = elemento.classList.contains('selected');

        const seleccionado = !estabaSeleccionadoAntes && esClickEnEsteElemento;
        elemento.classList.toggle('selected', seleccionado);

        
        if(seleccionado){
            NothingSelected= false;
            DeleteteCurrentImage();
            CreateImage(elemento.src);
        }
    });

    if(NothingSelected) DeleteteCurrentImage();
});


function DeleteteCurrentImage() {
    if(currentImage !== null){
        currentImage.remove();
        currentImage = null;
    }
}

function CreateImage(src) {
    currentImage = document.createElement('img');
    
    // 2. Configurar TODOS los atributos ANTES de append
    currentImage.src = src;
    currentImage.className = 'proy2D-bigImage';
    // 3. Añadir al DOM
    document.body.appendChild(currentImage);
}