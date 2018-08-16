function TRIT() {
    // Scene
    var tritScene = new THREE.Scene();
    // Output element
    var tritOutputWindow = document.getElementById("WebGL-output");
    // Hammer
    var tritHammer = new Hammer(tritOutputWindow);
    // Renderer
    var tritRenderer = new THREE.WebGLRenderer({alpha: true});
    // Camera
    var tritCamera =  new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Spinner - the main object
    var tritSpinner;
    // Spinner spin
    var tritSpin = new TWEEN.Tween({rotation: 0});
    // Direction
    var tritSpinningSpeed = 0;
    var spinDirection = +1;

    //Debug mode
    var debug_mode = true;


    function init_scene(spinnerModel, coinModel) {

        // Prepare the scene
        prepareScene();
        // Assign the spinner model
        addSpinner(spinnerModel);
        // Add mouse and touch functionality
        addHammer();
        // Add spinnig animation
        addSpinning();
        // Add initial coins
        addCoins(coinModel);

        tritOutputWindow.appendChild(tritRenderer.domElement);

        function renderScene(time) {
            // rotate the cube around its axes
            //spinner.rotation.z -= 0.03;
            // render using requestAnimationFram
            requestAnimationFrame(renderScene);
            tritRenderer.render(tritScene, tritCamera);
            tritSpin.update(time);
            //console.log("Called  TWEEN.update");
            //rotateAroundWorldAxis(spinner, new THREE.Vector3(0,0,1), (spinnerSpin + 0.1) * Math.PI/180);
        }

        renderScene();

        // add the output of the renderer to the html element

    }
    // Prepare the scene including camera and lighting
    function prepareScene(){
        // Setup the camera
        tritCamera.up.set(0, 0, 1);
        tritCamera.position.set(60,-90,40);
        // Setup the scene position
        tritScene.position.set(0,0,5);
        // Point the camera at the scene
        tritCamera.lookAt(tritScene.position);
        // Setup the renderer size
        tritRenderer.setSize(window.innerWidth, window.innerHeight);
        // Add Ambient light
        let light = new THREE.AmbientLight(0x404040, 0.3); // soft  light
        // Enable Shadows
        tritRenderer.shadowMap.enabled = false;
        // Add spotlight for the shadows
        //let pointColor = "#d4af37";
        let pointColor = "#ffebad";
        let dl1 = new THREE.SpotLight(pointColor, 0.7);
        dl1.position.set(-40, 40, 60);
        dl1.angle = Math.PI;
        dl1.castShadow = true;
        dl1.intensity = 0.7;
        dl1.castShadow = true;
        tritScene.add(dl1);
        let dl2 = new THREE.SpotLight(pointColor,0.7);
        dl2.position.set(60, -60, 20);
        dl2.castShadow = true;
        dl2.angle = Math.PI;
        dl2.intensity = 0.7;
        dl2.castShadow = true;
        tritScene.add(dl2);
        //var helper = new THREE.DirectionalLightHelper( dl2, 5 );
        //scene.add(helper);
        tritScene.add(light, dl1, dl2);

        if (debug_mode) {
            let axes = new THREE.AxesHelper(20);
            tritScene.add(axes);
        }

    }

    // Add spinner
    function addSpinner(sm) {
        tritSpinner = sm;
        var baseZ = -10;
        tritSpinner.position.set(0, 0, baseZ);
        tritSpinner.rotation.x = -0.03* Math.PI;
        tritSpinner.receiveShadow = true;
        tritScene.add(tritSpinner);
    }

    // Add coins - TODO: parameters
    function addCoins(cm) {
        var silverCoinMaterial = new THREE.MeshStandardMaterial({
            color: 0xdddddd,
            roughness: 0.5,
            metalness: 1.0,
        });
        var coinRadius = 12;
        cm.setRadius(coinRadius);
        var coinThickness = 1.4 * 0.18 * coinRadius;
        var spinnerThickness = 10;
        var mergedCoins = new THREE.Geometry();
        var coins = [];
        var arms = ['F', 'S', 'G', 'I'];
        var counts = [0, 2, 3, 5];
        var armsBase = [[0, 35, spinnerThickness], [-30.3, -17.5, spinnerThickness], [30.3, -17.5, spinnerThickness], [0, 0, spinnerThickness]];
        var modelSimpleCoinGeometry = cm.generateSimpleCoinGeometry();
        var modelCoinGeometry = cm.generateCoinGeometry();
        d('Generating coins');
        for (var arm = 0; arm < 4; arm++) {
            for (var j = 0; j <= counts[arm] - 1; j++) {
                if (j < counts[arm] - 1) {
                    var coinGeometry = modelSimpleCoinGeometry.clone();
                } else {
                    var coinGeometry = modelCoinGeometry.clone();

                }
                var ex = excentricity(arms[arm], j, 'RRRJZNOVAWGUSGCYMMKGMXCOPZSBTFKZXJBZYMWKBRDTBXUIQSFAUVCLSHIPOWLMWXXLPANLS9LT99999', 0.7);
                var ex2 = excentricity(arms[arm], j, 'OMJBAVFKFJICOATDXNLVYXPZITONOZVULIKFYLZPCXMJFBTLRJQXLVPADIGWAILIMCBYTKEIDOYAWWROK', 0.2);
                coinGeometry.translate(armsBase[arm][0] + ex[0] + ex2[0], armsBase[arm][1] + ex[1] + ex2[1], spinnerThickness + j * coinThickness);
                d('Adding individual coin');
                //mergedCoins.merge(coinGeometry);
                let x = Math.floor(Math.random() * 4);
                if (x == 0 ) {
                    CoinMesh = new THREE.Mesh(coinGeometry, silverCoinMaterial);
                } else {
                    CoinMesh = new THREE.Mesh(coinGeometry, cm.coinMaterial);
                }
                tritSpinner.add(CoinMesh);
            }
        }
        d('Adding coins to the scene');
        // Add coins as children od the spinner object
        //var mergedCoinsMesh = new THREE.Mesh(mergedCoins, cm.coinMaterial);
        //tritSpinner.add(mergedCoinsMesh);
        d('Coins added');
    }

    // Setup some mouse and touch screen events
    function addHammer() {
        tritHammer.on('swipe', function (ev) {
            if (ev.direction == Hammer.DIRECTION_LEFT) {
                tritSpinningSpeed -= 1;
                d("Swipe Left " + tritSpinningSpeed);
            }
            if (ev.direction == Hammer.DIRECTION_RIGHT) {
                tritSpinningSpeed += 1;
                d("Swipe Right " + tritSpinningSpeed);
            }
        });


        tritHammer.on('press', function (ev) {
            breaks = setInterval(function () {
                slowDown()
            }, 100);
        });


        tritHammer.on('pressup', function (ev) {
            clearInterval(breaks);
        });

    }

    // Setup spinning functionality
    function addSpinning() {
        tritSpin.to({rotation: 2 * Math.PI}, 10000);
        tritSpin.easing(TWEEN.Easing.Linear.None);
        tritSpin.repeat(Infinity);
        tritSpin.onUpdate(function () {
            //console.log("tweenSpin.onUpdate called");
            //console.log(this.rotation);
            rotateAroundWorldAxis(tritSpinner, new THREE.Vector3(0, 0, 1), tritSpinningSpeed * Math.PI / 180);
            //rotateAroundWorldAxis(mergedCoinsMesh, new THREE.Vector3(0, 0, 1), spinnerSpin * Math.PI / 180);
        });
        tritSpin.start();
    }

    // Function for an incremental slowdown of the rotation
    function slowDown() {
        if (tritSpinningSpeed <= -1) {
            tritSpinningSpeed += 1
        }
        if (tritSpinningSpeed >= 1) {
            tritSpinningSpeed -= 1
        }
        if (tritSpinningSpeed == 0) {
            clearInterval(breaks)
        }
        console.log("SlowDown " + tritSpinningSpeed);
    }

    // Rotate object around the world axis instead of it's own axis
    function rotateAroundWorldAxis(object, axis, radians) {
        rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        rotWorldMatrix.multiply(object.matrix);        // pre-multiply
        object.matrix = rotWorldMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);
    }

    // Deterministically calculate excentricity of coins in the pile
    function excentricity(arm, index, key, offset) {
        var TRYTE_VALUES = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var keyFourth = Math.floor(key.length / 4);
        var i = -1;
        if (arm == 'F') i = 0;
        if (arm == 'S') i = 1;
        if (arm == 'G') i = 2;
        if (arm == 'I') i = 3;
        if (i == -1) throw ('Unexpected arm ' + arm);
        var j = (index % keyFourth) + i * keyFourth;
        var tryte = TRYTE_VALUES.indexOf(key[j]);
        var t0 = (tryte % 3) - 1;
        var t1 = Math.floor(tryte / 3) % 3 - 1;
        var t2 = Math.floor(tryte / 9) % 3;
        return [offset * t0 * t2, offset * t0 * t2];
    }

    // Print debug message using console
    function d(message) {
        if (debug_mode) console.log(message);
    }

    function loadAssets() {
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
                var mesh = (obj.children[0].clone());
                var spinnerGeometry = mesh.geometry;

                var spinnerMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
                var spinner_model = new THREE.Mesh(spinnerGeometry, spinnerMaterial);
                init_scene(spinner_model, coin_model);
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

    function markArms(s) {

    }

    loadAssets();
}

window.onload = TRIT();
