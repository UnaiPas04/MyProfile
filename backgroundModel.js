document.addEventListener('DOMContentLoaded', function() {
    // 1. BUSCAR CONTENEDOR DEL CANVAS (crear uno si no existe)
    let container = document.getElementById('canvas-container');
    
    // 2. CONFIGURAR ESCENA
    const scene = new THREE.Scene();
    
    // COLOR DE FONDO VERDE
    scene.background = new THREE.Color(0x00ff00); // Verde puro
    // O también: scene.background = new THREE.Color('green');
    
    // 3. CONFIGURAR CÁMARA
    const camera = new THREE.PerspectiveCamera(
        75, // Campo de visión
        container.clientWidth / container.clientHeight, // Relación aspecto
        0.1, // Plano cercano
        1000 // Plano lejano
    );
    camera.position.z = 5;
    camera.position.y = 2;

    // 4. CONFIGURAR RENDERIZADOR
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true // Permitir transparencia si fuera necesario
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    
    // Añadir el canvas al contenedor
    container.appendChild(renderer.domElement);

    // 5. CREAR CUBO
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    // Material con color azul para contrastar con fondo verde
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x0066ff,
        shininess: 100
    });
    
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    scene.add(cube);

    // 6. AGREGAR ILUMINACIÓN
    // Luz ambiental (suave)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Luz direccional (para sombras)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

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
    });

    // 9. ANIMACIÓN
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotar el cubo
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.005;
        
        // Actualizar controles
        controls.update();
        
        // Renderizar
        renderer.render(scene, camera);
    }
    
    // Iniciar animación
    animate();
});