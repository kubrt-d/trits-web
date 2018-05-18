// once everything is loaded, we run our Three.js stuff.
function init() {

        // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render and set the size
    var renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // show axes in the screen
    var axes = new THREE.AxesHelper(20);
    scene.add(axes);

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(100, 100);
    var planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -10;
    plane.receiveShadow = true;

    // add the plane to the scene
    scene.add(plane);

   
    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // Enable Shadows
    renderer.shadowMap.enabled = true;
    // add spotlight for the shadows
    var pointColor = "#ffffff";
    var directionalLight = new THREE.SpotLight(pointColor);
    directionalLight.position.set(-40, 60, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 2;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;

    directionalLight.distance = 0;
    directionalLight.intensity = 0.5;
    directionalLight.castShadow = true;

    scene.add(directionalLight);
    
    
        lineGeometry = new THREE.BoxGeometry(0.1,0.1,10);
        var lineMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});
        var line = new THREE.Mesh(lineGeometry, lineMaterial);
        // position the sphere
        line.position.x = 0;
        line.position.y = 0;
        line.position.z = 0;
        line.castShadow = true;
        line.rotation.x =  0.1*Math.PI;;
        scene.add(line);
        // position and point the camera to the center of the scene
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);

        // add the output of the renderer to the html element
        document.getElementById("WebGL-output").appendChild(renderer.domElement);

        // render the scene
        renderer.render(scene, camera);
        renderScene();
            function renderScene() {
                // rotate the cube around its axes
                line.rotation.y -= 0.03;
                // render using requestAnimationFrame
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            }

}


window.onload = init;
