// once everything is loaded, we run our Three.js stuff.
function init() {

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 60;
    camera.position.y = -120;
    camera.position.z = 60;
    camera.up.set( 0, 0, 1 ); // This makes the Z axis to point upwards
    camera.lookAt(scene.position);

    // create a render and set the size
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // show axes in the screen
    var axes = new THREE.AxesHelper(20);
    scene.add(axes);

    // create the ground plane
    var planeGeometry = new THREE.CircleGeometry(80, 256);
    var planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // rotate and position the plane
    //plane.rotation.x =  * Math.PI;
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
    directionalLight.intensity = 0.9;
    directionalLight.castShadow = true;

    scene.add(directionalLight);
    //var helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
    //scene.add(helper);


    // Coin and flight params
    var coinRadius = 5;
    var coinHeight = 2;
    var coinSegments = 32;

    // From
    var coinStartX =  -30;
    var coinStartY =  600;
    var coinStartZ =  -100;

    // To
    var coinStopX =  0;
    var coinStopY =  0;
    var coinStopZ =  coinHeight;

    // Flight length
    var flightLength = 3000;
    var flightRotations = 6;

    // Coin
    var coinGeometry = new THREE.CylinderGeometry(coinRadius, coinRadius, coinHeight, coinSegments);
    var coinMaterial = new THREE.MeshPhongMaterial({color: 0xeeeeee});
    var coin = new THREE.Mesh(coinGeometry, coinMaterial);
    coin.rotation.x = -0.5 * Math.PI;
    coin.position.set(coinStartX, coinStartY, coinStartZ);
    //coin.position.y = 600;
    //coin.position.z = -100;
    // add the sphere to the scene
    coin.castShadow = true;
    scene.add(coin);
    var coin2 = new THREE.Mesh(coinGeometry, coinMaterial);
    coin2.rotation.x = -0.5 * Math.PI;
    scene.add(coin2);



    var tweenXY = new TWEEN.Tween({x:coinStartX , y:coinStartY});
    var tweenRot = new TWEEN.Tween({rot: 0});
    var tweenZ = new TWEEN.Tween({z:coinStartZ});

    tweenXY.to({x:coinStopX, y:coinStopY}, flightLength);
    tweenRot.to({rot:  (flightRotations + 0.5) * Math.PI}, flightLength);
    tweenZ.to({z:  coinStopZ}, flightLength);

    tweenXY.easing(TWEEN.Easing.Quartic.Out);
    tweenRot.easing(TWEEN.Easing.Quartic.Out);
    tweenZ.easing(TWEEN.Easing.Back.Out);
    tweenXY.onUpdate(function() {
        coin.position.x = this.x;
        coin.position.y = this.y;
    });
    tweenRot.onUpdate(function() {
        coin.rotation.x = this.rot;
    });
    tweenZ.onUpdate(function() {
        coin.position.z = this.z;
    });
    tweenZ.start();
    tweenXY.start();
    tweenRot.start();


    // add the output of the renderer to the html element
    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    // render the scene

    var renderScene = function() {
        // rotate the cube around its axes
        //line.rotation.y -= 0.03;
        // render using requestAnimationFrame
        TWEEN.update();
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    renderScene();

}

window.onload = init;


