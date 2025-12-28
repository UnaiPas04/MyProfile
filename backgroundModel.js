document.addEventListener('DOMContentLoaded', function() {
    // 1. BUSCAR CONTENEDOR DEL CANVAS (crear uno si no existe)
    let container = document.getElementById('canvas-container');

    // 2. CONFIGURAR ESCENA
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();
    scene.background = new THREE.Color(0x060005);
    
    // 3. CONFIGURAR CÁMARA
    const camera = new THREE.PerspectiveCamera(
        75, // Campo de visión
        container.clientWidth / container.clientHeight, // Relación aspecto
        0.1, // Plano cercano
        1000 // Plano lejano
    );
    camera.position.z = 5;

    // 4. CONFIGURAR RENDERIZADOR
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    
    // Añadir el canvas al contenedor
    container.appendChild(renderer.domElement);

    // 5. AGREGAR ILUMINACIÓN
    // Luz ambiental (suave)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Luz direccional (para sombras)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // 6. GEOMETRÍA
    const loader = new THREE.FBXLoader();
    let model = null;
    let mixer = null;

    loadFBX('FBXs/noisySphere.fbx');
    function loadFBX(name){
        loader.load(name, 
            function(fbxModel) {
                console.log('FBX cargado:', name);
                // Escalar y posicionar el modelo si es necesario
                
                fbxModel.position.set(0, 0, 0);
                
                // Agregar a la escena
                scene.add(fbxModel);
                model = fbxModel;
                scaleModelByWidth(container.clientWidth);
                // Verificar si tiene animaciones
                if (fbxModel.animations && fbxModel.animations.length > 0) {
                    setupAnimation(fbxModel);
                }
            }, 
            function(progress) {
                // Progreso de carga
                console.log('Cargando: ' + (progress.loaded / progress.total * 100) + '%');
            }, 
            function(error) {
                console.error('Error cargando FBX:', error);
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshPhongMaterial({ 
                    color: 0x0066ff,
                    shininess: 100
                });
                const cube = new THREE.Mesh(geometry, material);
                cube.castShadow = true;
                scene.add(cube);
                model = cube;
            }
        );
    }

    // 6.1 CONFIGURAR ANIMACIÓN AUTOMÁTICA
    function setupAnimation(fbxModel) {
        // Crear AnimationMixer
        mixer = new THREE.AnimationMixer(fbxModel);
        
        // Obtener la primera animación del modelo
        const clips = fbxModel.animations;
        if (clips.length > 0) {
            const action = mixer.clipAction(clips[0]);
            
            // Configurar loop infinito
            action.loop = THREE.LoopRepeat;
            action.repetitions = Infinity;
            
            // Reproducir
            action.play();
        }
    }

    // 7. CONTROLES DE ÓRBITA
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Suavizado
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI; // Permitir rotación completa

    // 8. MANEJAR REDIMENSIONAMIENTO DE VENTANA
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);

        scaleModelByWidth(container.clientWidth);
    });
    function scaleModelByWidth(screenWidth) {
        if (!model) return;
        
        // Calcular escala proporcional al ancho
        // Fórmula: escala = (ancho_referencia / ancho_actual) * escala_base
        let targetScale = (screenWidth / 3000) * 0.17;
        
        // Aplicar escala uniforme
        model.scale.set(targetScale, targetScale, targetScale);
    }

    // 9. ANIMACIÓN
    function animate() {
        requestAnimationFrame(animate);

        if(model == null) return;
        //model.rotation.x += 0.01;
       // model.rotation.y += 0.005;
        
        if (mixer) {
            const delta = clock.getDelta(); // Necesitarás crear un reloj
            mixer.update(delta);
        }
        // Actualizar controles
        controls.update();
        
        // Renderizar
        renderer.render(scene, camera);
    }
    
    // Iniciar animación
    animate();
});