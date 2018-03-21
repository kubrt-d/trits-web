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
    //scene.add(axes);

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(100, 100);
    var planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;

    // add the plane to the scene
    scene.add(plane);

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position and point the camera to the center of the scene
    camera.position.x = -60;
    camera.position.y = 60;
    camera.position.z = 60;
    camera.lookAt(scene.position);

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
    //var helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
    //scene.add(helper);

    // Load the spinner
    // instantiate a loader
    var loader = new THREE.ObjectLoader();

    // load a resource
    loader.load(
        // resource URL
        '/work/assets/spinner-coarse.json',

        // onLoad callback
        // Here the loaded data is assumed to be an object
        function (obj) {
            // Add the loaded object to the scene
            mesh = (obj.children[0].clone());
            spinnerGeometry = mesh.geometry;
            var spinnerMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
            var spinner = new THREE.Mesh(spinnerGeometry, spinnerMaterial);
            spinner.scale.set(0.4, 0.4, 0.4);
            spinner.rotation.x = -0.5 * Math.PI;
            spinner.position.set(0, 10, 0);
            spinner.castShadow = true;
            scene.add(spinner);
            document.getElementById("WebGL-output").appendChild(renderer.domElement);

            // render the scene
            var step = 0;
            renderScene();
            function renderScene() {
                // rotate the cube around its axes
                spinner.rotation.z -= 0.03;
                // render using requestAnimationFrame
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            }
        },

        // onProgress callback
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },

        // onError callback
        function (err) {
            console.error('An error happened');
        }
    );

    // add the output of the renderer to the html element

}


window.onload = init;
