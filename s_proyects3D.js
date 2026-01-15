//Marcar con atributo selected elementos al hacerlos click
//Para q el css les ponga el estilo de imagen seleccionada

const elementos = document.querySelectorAll('.proy3D-img');
let currentVideo = null;

document.addEventListener('click', function(e) {

    const esClickEnVideo = currentVideo && currentVideo === e.target;

    if (esClickEnVideo) return;

    let NothingSelected = true;
    elementos.forEach(elemento => {
        
        const esClickEnEsteElemento = elemento === e.target || elemento.contains(e.target);

        const estabaSeleccionadoAntes = elemento.classList.contains('selected');

        const seleccionado = !estabaSeleccionadoAntes && esClickEnEsteElemento;
        elemento.classList.toggle('selected', seleccionado);

        
        if(seleccionado){
            NothingSelected= false;
            DeleteteCurrentVideo();
            CreateVideo(ConvertRoute_Gif2MP4(elemento.src));
        }
    });

    if(NothingSelected) DeleteteCurrentVideo();
});


function DeleteteCurrentVideo() {
    if(currentVideo !== null){
        currentVideo.remove();
        currentVideo = null;
    }
}

function ConvertRoute_Gif2MP4(src){
    return src.replace('.gif', '.mp4');
}

function CreateVideo(src) {
    // 1. Crear elemento
    currentVideo = document.createElement('video');
    
    // 2. Configurar TODOS los atributos ANTES de append
    currentVideo.src = src;
    currentVideo.className = 'proy3D-video';
    currentVideo.controls = true;
    currentVideo.autoplay = true;    // Recomendado
    currentVideo.muted = true;       // Necesario para autoplay
    // 3. Añadir al DOM
    document.body.appendChild(currentVideo);
    
    // 4. Opcional: Forzar carga
    currentVideo.load();
    
    console.log('Video creado:', currentVideo.outerHTML);
}