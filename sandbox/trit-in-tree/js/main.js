// Main scene
/**********************************************************
 Preload
 - load scene assets

 Init
 Prepare the scene
 - draw scene
 - initiate animation loop

 Running section
 - touch callbacks
 - socket callbacks

 Animation functions

 Event responders

 */

function load_assets() {
    // TODO: load the coin
    var coin_model = new IOTACoin();
    // Load the spinner
    var loader = new THREE.ObjectLoader(); // instantiate a loader
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
            var spinner_model = new THREE.Mesh(spinnerGeometry, spinnerMaterial);
            init_scene(spinner_model,coin_model);
        },
        function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },

        // onError callback
        function (err) {
             console.error('Error loading asset: spinner');
        }
    );
}



function init_scene(spinner,coinModel) {

    var spinnerSpin = -0;

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
    var renderer = new THREE.WebGLRenderer( { alpha: true } );



    renderer.setSize(window.innerWidth, window.innerHeight);
    // show axes in the screen
    var axes = new THREE.AxesHelper(20);
    scene.add(axes);

    // create the ground plane
    //var planeGeometry = new THREE.PlaneGeometry(200, 200);
    //var planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
    //var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // rotate and position the plane
    //plane.rotation.x =  * Math.PI;
    //plane.receiveShadow = true;

    // add the plane to the scene
    //scene.add(plane);

    // position and point the camera to the center of the scene
    camera.up.set( 0, 0, 1 );
    camera.position.x = 60;
    camera.position.y = -90;
    camera.position.z = 5;
    
    
    scene.position.x = 0;
    scene.position.y = 0;
    scene.position.z = 5;

    camera.lookAt(scene.position);


    // add subtle ambient lighting

    var light = new THREE.AmbientLight( 0x404040, 0.3 ); // soft white light
    scene.add( light );

    // Enable Shadows
    renderer.shadowMap.enabled = true;
    // add spotlight for the shadows
    var pointColor = "#d4af37";
    var dl1 = new THREE.SpotLight(pointColor);
    dl1.position.set(-40, 40, 60);
    dl1.angle = Math.PI;
    dl1.castShadow = true;
    dl1.intensity = 0.7;
    dl1.castShadow = true;

    scene.add(dl1);
    //var helper = new THREE.DirectionalLightHelper( dl1, 5 );
    //scene.add(helper);
    var dl2 = new THREE.SpotLight(pointColor);
    dl2.position.set(60, -60, 20);
    dl2.castShadow = true;
    dl2.angle = Math.PI;
    dl2.intensity = 0.7;
    dl2.castShadow = true;
    scene.add(dl2);
    //var helper = new THREE.DirectionalLightHelper( dl2, 5 );
    //scene.add(helper);

    var baseZ = -10;
    //spinner.rotation.x = -0.03* Math.PI;
    spinner.position.set(0, 0, baseZ);
    //spinner.castShadow = true;
    spinner.receiveShadow = true;
    scene.add(spinner);

    
    var coinRadius = 12;
    coinModel.setRadius(coinRadius);
    var coinThickness = 1.4 * 0.18 * coinRadius;
    var spinnerThickness = 10;
    var mergedCoins = new THREE.Geometry();
    var coins = [];
    var arms = ['F','S','G','I'];
    var counts = [0,2,3,5];
    var armsBase = [[0,35,spinnerThickness],[-30.3,-17.5,spinnerThickness],[30.3,-17.5,spinnerThickness],[0,0,spinnerThickness]];
    var modelSimpleCoinGeometry = coinModel.generateSimpleCoinGeometry();
    var modelCoinGeometry = coinModel.generateCoinGeometry();
    console.log('Generating coins');
    for (var arm = 0; arm < 4; arm++) {
        for (var j = 0; j <= counts[arm] - 1; j++) {
            if (j < counts[arm] - 1) {
                var coinGeometry = modelSimpleCoinGeometry.clone();
            } else {
                var coinGeometry = modelCoinGeometry.clone();
                
            }
            var ex = excentricity(arms[arm], j, 'RRRJZNOVAWGUSGCYMMKGMXCOPZSBTFKZXJBZYMWKBRDTBXUIQSFAUVCLSHIPOWLMWXXLPANLS9LT99999', 0.7);
            var ex2 = excentricity(arms[arm], j, 'OMJBAVFKFJICOATDXNLVYXPZITONOZVULIKFYLZPCXMJFBTLRJQXLVPADIGWAILIMCBYTKEIDOYAWWROK', 0.2);
            coinGeometry.translate(armsBase[arm][0] + ex[0] + ex2[0], armsBase[arm][1] + ex[1] + ex2[1], baseZ + spinnerThickness + j * coinThickness);
            console.log('Adding individual coin');
            mergedCoins.merge(coinGeometry);
        }
    }
    var mergedCoinsMesh = new THREE.Mesh(mergedCoins, coinModel.coinMaterial);
    console.log('Adding coins to the scene');
    scene.add(mergedCoinsMesh);
    console.log('Coins added');


    outputWindow.appendChild(renderer.domElement);

    tweenSpin.onUpdate(function() {
        //console.log("tweenSpin.onUpdate called");
        //console.log(this.rotation);
        rotateAroundWorldAxis(spinner, new THREE.Vector3(0,0,1), spinnerSpin * Math.PI/180);
        rotateAroundWorldAxis(mergedCoinsMesh, new THREE.Vector3(0,0,1), spinnerSpin * Math.PI/180);
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

    // add the output of the renderer to the html element

}



window.onload = load_assets();

function excentricity(arm, index, key, offset ) {
    var TRYTE_VALUES = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var keyFourth = Math.floor(key.length/4);
    var i = -1;
    if (arm == 'F') i = 0;
    if (arm == 'S') i = 1;
    if (arm == 'G') i = 2;
    if (arm == 'I') i = 3;
    if (i == -1) throw ( 'Unexpected arm ' + arm );
    var j = ( index % keyFourth ) + i * keyFourth;
    var tryte = TRYTE_VALUES.indexOf(key[j]);
    var t0 = (tryte % 3) -1 ;
    var t1 = Math.floor(tryte / 3 ) % 3 -1;
    var t2 = Math.floor(tryte / 9 ) % 3;
    return [offset * t0 * t2 , offset * t0 * t2];
}
