// once everything is loaded, we run our Three.js stuff.
/**********************************************************
Init section -
 Prepare the scene
  - load scene assets
  - draw scene
  - initiate animation loop

Running section
  - touch callbacks
  - socket callbacks

Animation functions

*/

function init() {

    var spinnerSpin = -1;

    var spinDirection = +1;
    var tweenSpin =  new TWEEN.Tween({rotation: 0});
    tweenSpin.to({ rotation: 2 * Math.PI }, 10000);
    tweenSpin.easing(TWEEN.Easing.Linear.None);
    tweenSpin.repeat(Infinity);
    tweenSpin.start();

    var outputWindow = document.getElementById("WebGL-output");

    var hammertime = new Hammer(outputWindow);


    hammertime.on('swipe', function(ev) {
        if (ev.direction == Hammer.DIRECTION_LEFT) {
            spinnerSpin -= 1;
            console.log("Swipe Left " + spinnerSpin);
        };
        if (ev.direction == Hammer.DIRECTION_RIGHT) {
            spinnerSpin += 1;
            console.log("Swipe Right " + spinnerSpin);
        };
    });


    hammertime.on('press', function(ev) {
        breaks = setInterval(function(){ slowdown() }, 100);
    });


    hammertime.on('pressup', function(ev) {
        clearInterval(breaks);
    });



    function slowdown() {
        if (spinnerSpin <= -1) { spinnerSpin += 1};
        if (spinnerSpin >= 1) { spinnerSpin -= 1};
        if (spinnerSpin == 0) { clearInterval(breaks)};
        console.log("SlowDown " + spinnerSpin);
    }

    var rotWorldMatrix;

    function rotateAroundWorldAxis(object, axis, radians) {
        rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        rotWorldMatrix.multiply(object.matrix);        // pre-multiply
        object.matrix = rotWorldMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);
    }

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
    var planeGeometry = new THREE.PlaneGeometry(200, 200);
    var planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // rotate and position the plane
    //plane.rotation.x =  * Math.PI;
    plane.receiveShadow = true;

    // add the plane to the scene
    scene.add(plane);

    // position and point the camera to the center of the scene
    camera.position.x = 60;
    camera.position.y = -120;
    camera.position.z = 120;
    camera.up.set( 0, 0, 1 );
    camera.lookAt(scene.position);


    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // Enable Shadows
    renderer.shadowMap.enabled = true;
    // add spotlight for the shadows
    var pointColor = "#ffffff";
    var directionalLight = new THREE.SpotLight(pointColor);
    directionalLight.position.set(0, 0, 120);
    directionalLight.castShadow = true;
    /*directionalLight.shadow.camera.near = 2;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
*/
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
            //spinner.scale.set(0.4, 0.4, 0.4);
            spinner.rotation.x = -0.03* Math.PI;
            spinner.position.set(0, 0, 10);
            spinner.castShadow = true;
            scene.add(spinner);
            outputWindow.appendChild(renderer.domElement);

            tweenSpin.onUpdate(function() {
                //console.log("tweenSpin.onUpdate called");
                //console.log(this.rotation);
                rotateAroundWorldAxis(spinner, new THREE.Vector3(0,0,1), spinnerSpin * Math.PI/180);
            });

            // render the scene



            function renderScene (time) {
                // rotate the cube around its axes
                //spinner.rotation.z -= 0.03;
                // render using requestAnimationFram
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
                tweenSpin.update(time);
                //console.log("Called  TWEEN.update");
                //rotateAroundWorldAxis(spinner, new THREE.Vector3(0,0,1), (spinnerSpin + 0.1) * Math.PI/180);
            }
            renderScene();


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
