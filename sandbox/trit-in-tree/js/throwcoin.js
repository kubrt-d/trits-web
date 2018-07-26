// once everything is loaded, we run our Three.js stuff.
function init() {

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var dist = 10;
    camera.position.x = 3 * dist;
    camera.position.y = -12 * dist;
    camera.position.z = 6 * dist;
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
    directionalLight.position.set(0, 60, 60);
    directionalLight.castShadow = true;
    directionalLight.intensity = 1;


    var helper = new THREE.CameraHelper( directionalLight.shadow.camera );
    scene.add( helper );

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
    var coinBase = new Coin();
    coinBase.setRadius(8);
    var coin = coinBase.createCoin();
    var coin2 = coinBase.createCoin();
    /*var coinGeometry = new THREE.CylinderGeometry(coinRadius, coinRadius, coinHeight, coinSegments);
    var coinMaterial = new THREE.MeshPhongMaterial({color: 0xeeeeee});
    var coin = new THREE.Mesh(coinGeometry, coinMaterial);*/
    //coin.rotation.x = -0.5 * Math.PI;
    coin.position.set(coinStartX, coinStartY, coinStartZ);
    //coin.position.y = 600;
    //coin.position.z = -100;
    // add the sphere to the scene
    coin.castShadow = true;
    scene.add(coin);

    //coin2.rotation.x = -0.5 * Math.PI;
    scene.add(coin2);



    var tweenXY = new TWEEN.Tween({x:coinStartX , y:coinStartY});
    var tweenRot = new TWEEN.Tween({rot: 0});
    var tweenZ = new TWEEN.Tween({z:coinStartZ});

    tweenXY.to({x:coinStopX, y:coinStopY}, flightLength);
    tweenRot.to({rot:  (flightRotations) * Math.PI}, flightLength);
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


class Coin {
    constructor() {
        this.setRadius(3); // default radius
        this.coinMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            roughness: 0.7,
            metalness: 1,
        });

    }

    setRadius(radius) {
        this.coinRadius = radius;
        this.coinGeometry = this.generateCoinGeometry();
    }

    generateCoinGeometry() {
        let iotaLogo = [[1.010675,5.8035,1.3333],[0.288975,6.4334,1.5833],[-0.258252,9.1363,1.9167],[-0.622412,13.4363,2.1667],[-0.896055,18.6758,2.6667],[-1.12482,25.3088,3.0833],[0.854255,10.2774,1.1667],[0.525458,11.4631,1.4167],[0.222082,13.2419,1.5],[-0.084902,15.7233,2],[-0.373166,18.9724,2.25],[-0.639163,23.0502,2.6667],[0.855821,14.2363,1],[0.672247,15.6565,1.1667],[0.4744,17.3305,1.4167],[0.265103,19.0833,1.5833],[0.035418,21.1799,1.9167],[-0.202233,23.6486,2.1667]]
        //let iotaLogo = [[1.010675,30.8035,1.3333]];
        let coinThickness = 0.18 * this.coinRadius;
        let textScale = 0.16 * this.coinRadius;
        let extrudeThickness = coinThickness / 6;
        let bevelThickness = 0.1;
        let textThickness = extrudeThickness + bevelThickness;
        let extrudeOptions = {
            amount: extrudeThickness,
            steps: 1,
            curveSegments: 24,
            bevelEnabled: true,
            bevelSize: bevelThickness,
            bevelThickness: bevelThickness,
            bevelSegments: 2,
        };

        // create the base coin geometry
        //let ringGeometry = new THREE.RingGeometry(
        //    this.coinRadius, (0.1 * this.coinRadius), 8, 64
        //);
        function drawOuterRingShape(radius) {
            // create a basic shape
            var shape = new THREE.Shape();
            shape.absellipse(0, 0, radius*1.1, radius*1.1, 0, Math.PI * 2, true);
            // add 'eye' hole one
            var hole1 = new THREE.Path();
            hole1.absellipse(0, 0, radius, radius, 0, Math.PI * 2, true);
            shape.holes.push(hole1);
            // return the shape
            return shape;
        }

        function getRingGeometry(radius, height) {
            var outerRadius = 1.1*radius;
            var innerRadius = radius;
            var height = height*1.4;

            var arcShape = new THREE.Shape();
            arcShape.moveTo(outerRadius * 2, outerRadius);
            arcShape.absarc(outerRadius, outerRadius, outerRadius, 0, Math.PI * 2, false);

            var holePath = new THREE.Path();
            holePath.moveTo(outerRadius + innerRadius, outerRadius);
            holePath.absarc(outerRadius, outerRadius, innerRadius, 0, Math.PI * 2, true);
            arcShape.holes.push(holePath);

            var geometry = new THREE.ExtrudeGeometry(arcShape, {
                amount: height,
                bevelEnabled: false,
                steps: 1,
                curveSegments: 64
            });
            geometry.center();
            geometry.rotateX(Math.PI * -.5);

            return geometry; // TheJim01: just return the geometry
        }

        var extrudeSettings = {
            amount: coinThickness * 1.02,
            bevelEnabled: false,
            curveSegments: 64
        };
        //var outerRingGeometry = new THREE.ExtrudeGeometry(drawOuterRingShape(this.coinRadius), extrudeSettings);
        var outerRingGeometry = getRingGeometry(this.coinRadius, coinThickness);

        let cylGeometry  = new THREE.CylinderGeometry(
            this.coinRadius, this.coinRadius, coinThickness, 64
        );
        cylGeometry.rotateX(Math.PI / 2);
        outerRingGeometry.rotateX(Math.PI / 2);
        // create the "IOTA logo" mesh
        var sin_rot1 = Math.sin(2*Math.PI/3);
        var sin_rot2 = Math.sin(4*Math.PI/3);
        var cos_rot1 = Math.cos(2*Math.PI/3);
        var cos_rot2 = Math.cos(4*Math.PI/3);

        var shapes = [];
        var l = iotaLogo.length;
        for (var i = 0; i < l; i++) {
            var shape = new THREE.Shape();
            var shape2 = new THREE.Shape();
            var shape3 = new THREE.Shape();
            var alpha = Math.abs(iotaLogo[i][0]);
            var dir = 1;
            var distance = iotaLogo[i][1];
            var diameter = iotaLogo[i][2];
            var a = distance * Math.sin(alpha);
            var b = Math.sqrt(distance*distance - a*a);
            var ratio = 0.15;
            if (iotaLogo[i][0] < 0) dir = -1;
            var x = dir*ratio*a;
            var y = ratio*b;
            shape.moveTo(x,y);
            shape.arc(0, 0, ratio*diameter);
            shape2.moveTo(x*cos_rot1 - y*sin_rot1, y*cos_rot1 + x*sin_rot1);
            shape2.arc(0, 0, ratio*diameter);
            shape3.moveTo(x*cos_rot2 - y*sin_rot2, y*cos_rot2 + x*sin_rot2);
            shape3.arc(0, 0, ratio*diameter);

            //x' = x cos f - y sin f
            //y' = y cos f + x sin f

            shapes.push(shape);
            shapes.push(shape2);
            shapes.push(shape3);
        }

        // Outer Ring
        shapes.push(drawOuterRingShape());


        let oneGeometry = new THREE.ExtrudeGeometry(shapes, extrudeOptions);
        let oneMesh = new THREE.Mesh(oneGeometry, this.coinMaterial);



        // scale and position the "1" mesh to jut out of the coin
        oneMesh.position.z -= (extrudeThickness / 2) * textScale; // center
        oneMesh.position.z += (coinThickness) / 2; // offset to edge
        oneMesh.position.z -= (textThickness / 2) * textScale; // adjust
        oneMesh.scale.set(textScale, textScale, textScale);

        // assemble the coin geometry out of the constituent geometries/meshes
        let coinGeometry = new THREE.Geometry();

        coinGeometry.merge(cylGeometry);
        coinGeometry.merge(outerRingGeometry);
        //coinGeometry.mergeMesh(outerRingMesh);
        coinGeometry.mergeMesh(oneMesh);
        return coinGeometry;
    }

    createCoin() {
        return new THREE.Mesh(this.coinGeometry, this.coinMaterial);
    }
};


