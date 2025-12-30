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
    
    // Crear material de shader personalizado
    const waveShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            color1: { value: new THREE.Color(0x330088) },
            color2: { value: new THREE.Color(0x8500a5) },
            colorSpeed: {value: 80.0 },
            // Variables controlables
            waveSpeed: { value: 0.8 },
            waveAmp: { value: 0.1 },
            waveFreq: { value: 20.0 },

            wavePhaseX: { value: 0.0 },
            wavePhaseY: { value: 0.0 },
            wavePhaseZ: { value: 0.0 },
        },
        vertexShader: `
            uniform float time;
            uniform float waveSpeed;
            uniform float waveAmp;
            uniform float waveFreq;
            uniform float wavePhaseX, wavePhaseY, wavePhaseZ;
            
            void main() {
                vec3 pos = position;

                float WS_Oscilated = sin(time * 3.0) * waveSpeed;

                // Ondas por eje con variables controlables
                float waveX = sin(pos.x * waveFreq + WS_Oscilated + wavePhaseX) * waveAmp;
                float waveY = cos(pos.y * waveFreq + WS_Oscilated + wavePhaseY) * waveAmp;
                float waveZ = sin(pos.z * waveFreq + WS_Oscilated + wavePhaseZ) * waveAmp;
                
                pos.x += waveX;
                pos.y += waveY;
                pos.z += waveZ;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform float colorSpeed;

            void main() {
            
                float T = sin(time * colorSpeed) / 2.0 + 1.0;

                float colorX = T * color1.x + (1.0 - T)* color2.x;
                float colorY = T * color1.y + (1.0 - T)* color2.y;
                float colorZ = T * color1.z + (1.0 - T)* color2.z;

                vec3 color;
                color.x = colorX;
                color.y = colorY;
                color.z = colorZ;

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
        let t = aspectRatio*1;
        let targetScale = t * 1.5 + (1-t)*0.7;
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
    const mouseTracker = new MouseTracker();
    function Update(delta){

        //waveShaderMaterial.uniforms.time.value += delta; 
        
        if(mesh == null) return;

        //Rotacion segun mouse
        let normalizedMouseX = mouseTracker.getX(); //[0-1]
        let normalizedMouseY = mouseTracker.getY(); //[0-1]
        let mouseX= normalizedMouseX*2-1; //[-1, 1]
        let mouseY= normalizedMouseY*2-1; //[-1, 1]

        var rotVel = [0.4*mouseY,0.4*mouseX];
        mesh.rotation.x += rotVel[0]* delta;
        mesh.rotation.y += rotVel[1] * delta;

        //Ruido animado
        waveShaderMaterial.uniforms.time.value += delta; 

        let freq = 6 * (1 - Math.abs (mouseX * mouseY)) + 4;
        waveShaderMaterial.uniforms.waveFreq.value = freq; 

        renderer.render(scene, camera);
    }
    
    // Iniciar animación
    animate();
});

