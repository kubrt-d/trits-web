// once everything is loaded, we run our Three.js stuff.
function init() {

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var cdist = 30;
    camera.position.x = cdist;
    camera.position.y = -2*cdist;
    camera.position.z = cdist;
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

    // Add dir light
    var directionalLight = new THREE.SpotLight({color: 0xffffff});
    directionalLight.position.set(-120, -120, 120);
    directionalLight.distance = 0;
    directionalLight.intensity = 1;
    scene.add(directionalLight);

    // rotate and position the plane
    //plane.rotation.x =  * Math.PI;
    plane.receiveShadow = true;

    // add the plane to the scene
    scene.add(plane);

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // Enable Shadows
    renderer.shadowMap.enabled = false;


    // Coin params
    var coinRadius = 5;
    var coinHeight = 2;
    var coinSegments = 32;

    var coinGeometry = new THREE.CylinderGeometry(coinRadius, coinRadius, coinHeight, coinSegments);
    var coinMaterial = new THREE.MeshPhongMaterial({color: 0xeeeeee});

    var arms = ['F','S','G'];
    var armsBase = [[-14,-14,0],[14,-14,0],[0,20,0]];
    for (var arm = 0; arm < 3; arm++) {
        for (var j = 0; j < 18; j++ ) {
            var ex = excentricity(arms[arm],j,'RRRJZNOVAWGUSGCYMMKGMXCOPZSBTFKZXJBZYMWKBRDTBXUIQSFAUVCLSHIPOWLMWXXLPANLS9LT99999',0.2);
            var ex2 = excentricity(arms[arm],j,'OMJBAVFKFJICOATDXNLVYXPZITONOZVULIKFYLZPCXMJFBTLRJQXLVPADIGWAILIMCBYTKEIDOYAWWROK',0.05);
            var coin = new THREE.Mesh(coinGeometry, coinMaterial);
            coin.rotation.x = -0.5 * Math.PI;
            coin.position.set(armsBase[arm][0]+ex[0]+ex2[0], armsBase[arm][1]+ex[1]+ex2[1], j*coinHeight);
            scene.add(coin);
        }
    }



    //coin.position.y = 600;
    //coin.position.z = -100;
    // add the sphere to the scene

    // add the output of the renderer to the html element
    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    // render the scene
    renderer.render(scene, camera);

}

window.onload = init;

/* Calculate coin excentricity using ternary trits from the (game) address as shifts
*
* @arm - one of "F", "S" or "G"
* @index - positive integer - coin index in the pile
* @index - IOTA address 
* @offset - Offset distance
*/

function excentricity(arm, index, key, offset ) {
    var TRYTE_VALUES = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var keyThird = Math.floor(key.length/3);
    var i = -1;
    if (arm == 'F') i = 0;
    if (arm == 'S') i = 1;
    if (arm == 'G') i = 2;
    if (i == -1) throw ( 'Unexpected arm ' + arm );
    var j = ( index % keyThird ) + i * keyThird;
    var tryte = TRYTE_VALUES.indexOf(key[j]);
    var t0 = (tryte % 3) -1 ;
    var t1 = Math.floor(tryte / 3 ) % 3 -1;
    var t2 = Math.floor(tryte / 9 ) % 3;
    return [offset * t0 * t2 , offset * t0 * t2];
}