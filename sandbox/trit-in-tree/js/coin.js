'use strict';

// once everything is loaded, we run our Three.js stuff.
function init() {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();
        // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 30;
    camera.position.y = -60;
    camera.position.z = 30;
    camera.up.set( 0, 0, 1 ); // This makes the Z axis to point upwards
    camera.lookAt(scene.position);

    // show axes in the screen
    var axes = new THREE.AxesHelper(20);
    scene.add(axes);

    // create a render and set the size
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(window.innerWidth, window.innerHeight);

        // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);


    // lighting - two directional lights from the left and right
    let color = 0xffffff;
    let intensity = 1.5;
    var directionalLightLeft = new THREE.DirectionalLight(color, intensity);
    directionalLightLeft.position.y = -60;
    directionalLightLeft.position.z = 60;
    directionalLightLeft.position.x = -60;
    var directionalLightRight = new THREE.DirectionalLight(color, intensity);
    directionalLightRight.position.y = -60;
    directionalLightRight.position.z = -60;
    directionalLightRight.position.x = 60;
    scene.add(directionalLightLeft);
    //scene.add(directionalLightRight);


    // Coin and flight params
    var coinRadius = 8;
    var coinHeight = 1.3;
    var coinSegments = 32;

    // From
    var coinStartX =  0;
    var coinStartY =  0;
    var coinStartZ =  0;

    // To
    var coinStopX =  0;
    var coinStopY =  0;
    var coinStopZ =  coinHeight;

    // Flight length
    var flightLength = 3000;
    var flightRotations = 6;

    // Coin
    var coinBase = new IOTACoin();
    coinBase.setRadius(8);
    //var coinGeometry = coinBase.generateCoinGeometry();
    var coin = coinBase.createCoin();

    coin.rotation.x = 0; //-0.5 * Math.PI;
    coin.rotation.y -= 0; //3;
    coin.rotation.z -= 0; // -0.5 * Math.PI;;
    //coin.rotation.z = 0.3 * Math.PI;
    coin.position.set(coinStartX, coinStartY, coinStartZ);
    scene.add(coin);


    // add the output of the renderer to the html element
    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    // add the download link


    var renderScene = function() {
        // rotate the cube around its axes
        //line.rotation.x -= 0.03;
        // render using requestAnimationFrame
        coin.rotation.x -= 0.01;
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }
    renderScene();

}

window.onload = init;






