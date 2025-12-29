document.addEventListener('DOMContentLoaded', function() {
    // 1. BUSCAR CONTENEDOR DEL CANVAS (crear uno si no existe)
    let container = document.getElementById('canvas-container');

    // 2. CONFIGURAR ESCENA
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();
    scene.background = new THREE.Color(0x060005);
    
    // 3. CONFIGURAR CÁMARA
    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = 5; // Tamaño del frustum (ajustable)

    const camera = new THREE.OrthographicCamera(
        -frustumSize * aspect / 2,  // left
        frustumSize * aspect / 2,   // right
        frustumSize / 2,            // top
        -frustumSize / 2,           // bottom
        0.01,                        // near
        1000                        // far
    );
    camera.position.z = 50;

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
    //const loader = new THREE.FBXLoader();
    const geometry = new THREE.SphereGeometry(1, 32, 32);

    // const waveShaderMaterial = new THREE.MeshBasicMaterial({
    //     color: 0x330088,        // Color hexadecimal
    //     wireframe: true,       // Mostrar como malla alámbrica
    //     transparent: true,      // Activar transparencia
    //     opacity: 1,          // Opacidad (0 a 1)
    //     side: THREE.FrontSide  // THREE.FrontSide, BackSide, DoubleSide
    // });
    
    // Crear material de shader personalizado
    const waveShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            color: { value: new THREE.Color(0x330088) },
            // Variables controlables
            waveSpeedX: { value: 1 },
            waveSpeedY: { value: 1 }, 
            waveSpeedZ: { value: 1 },
            waveAmpX: { value: 0.1 },
            waveAmpY: { value: 0.1 },
            waveAmpZ: { value: 0.1 },
            waveFreqX: { value: 20.0 },
            waveFreqY: { value: 20.0 },
            waveFreqZ: { value: 20.0 },
            wavePhaseX: { value: 0.0 },
            wavePhaseY: { value: 0 },
            wavePhaseZ: { value: 0.0 },
        },
        vertexShader: `
            uniform float time;
            uniform float waveSpeedX, waveSpeedY, waveSpeedZ;
            uniform float waveAmpX, waveAmpY, waveAmpZ;
            uniform float waveFreqX, waveFreqY, waveFreqZ;
            uniform float wavePhaseX, wavePhaseY, wavePhaseZ;
            uniform float radialSpeed, radialAmp, radialFreq;
            
            void main() {
                vec3 pos = position;
                
                // Ondas por eje con variables controlables
                float waveX = sin(pos.x * waveFreqX + time * waveSpeedX + wavePhaseX) * waveAmpX;
                float waveY = cos(pos.y * waveFreqY + time * waveSpeedY + wavePhaseY) * waveAmpY;
                float waveZ = sin(pos.z * waveFreqZ + time * waveSpeedZ + wavePhaseZ) * waveAmpZ;
                
                pos.x += waveX;
                pos.y += waveY;
                pos.z += waveZ;
                
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            void main() {
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        wireframe: true,
        transparent: false,
        side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, waveShaderMaterial);
    scene.add(mesh);
    // 7. MANEJAR REDIMENSIONAMIENTO DE VENTANA

    resize();
    window.addEventListener('resize', function() {
        resize();
    });
    function resize(){
        // Actualizar aspect ratio
        const aspect = container.clientWidth / container.clientHeight;
        const frustumSize = 5; // Mismo valor que arriba
        
        // Actualizar los parámetros de la cámara ortográfica
        camera.left = -frustumSize * aspect / 2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = -frustumSize / 2;
        
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        
        scaleModelByWidth(container.clientWidth, container.clientHeight);
    }
    function scaleModelByWidth(screenWidth, screenHeight) {
        if (!mesh) return;
        
        // Calcular escala proporcional al ancho
        let aspectRatio = screenWidth / screenHeight;
        let targetScale = aspectRatio * 2 ;
        mesh.scale.set(targetScale, targetScale, targetScale);
        // let t = screenWidth/300;
        // let z = (1-(t))*1 +(t)*0.2;
        // mesh.position.set(0, 0, z);
    }

    // 8. ANIMACIÓN
    function animate() {
        requestAnimationFrame(animate);

        Update(clock.getDelta());
    }

    function Update(delta){

        //waveShaderMaterial.uniforms.time.value += delta; 
        // Renderizar
        if(mesh == null)return;
        var rotVel = [0.2,0.2];
        mesh.rotation.x += rotVel[0]* delta;
        mesh.rotation.y += rotVel[1] * delta;

        waveShaderMaterial.uniforms.time.value += delta; 

        renderer.render(scene, camera);
    }
    
    // Iniciar animación
    animate();
});