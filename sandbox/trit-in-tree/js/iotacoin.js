class IOTACoin {
    constructor() {
        this.setRadius(3); // default radius
        this.coinMaterial = new THREE.MeshStandardMaterial({
            //color: 0xd4af37,
            color: 0xe4cd81,
            roughness: 0.5,
            metalness: 1.0,
        });
        
    }

    setRadius(radius) {
        this.coinRadius = radius;
        this.coinThickness = 0.18 * this.coinRadius;
        this.coinHeight = 1.4 * this.coinThickness;
    }
    
    

    generateCoinGeometry() {
        
        let iotaLogo = [[1.010675,5.8035,1.3333],[0.288975,6.4334,1.5833],[-0.258252,9.1363,1.9167],[-0.622412,13.4363,2.1667],[-0.896055,18.6758,2.6667],[-1.12482,25.3088,3.0833],[0.854255,10.2774,1.1667],[0.525458,11.4631,1.4167],[0.222082,13.2419,1.5],[-0.084902,15.7233,2],[-0.373166,18.9724,2.25],[-0.639163,23.0502,2.6667],[0.855821,14.2363,1],[0.672247,15.6565,1.1667],[0.4744,17.3305,1.4167],[0.265103,19.0833,1.5833],[0.035418,21.1799,1.9167],[-0.202233,23.6486,2.1667]]
        let coinThickness = this.coinThickness;
        let logoScale = 0.16 * this.coinRadius;
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

        
        let logoGeometry = new THREE.ExtrudeGeometry(shapes, extrudeOptions);
        let logoMesh = new THREE.Mesh(logoGeometry, this.coinMaterial);
        let logoMesh2 = new THREE.Mesh(logoGeometry, this.coinMaterial);

        // scale and position the logo mesh to jut out of the coin
        logoMesh.position.z -= (extrudeThickness / 2) * logoScale; // center
        logoMesh.position.z += (coinThickness / 2); // offset to edge
        logoMesh.position.z -= (textThickness / 2) * logoScale; // adjust
        logoMesh.scale.set(logoScale, logoScale, logoScale);

        // scale and position the logo mesh to jut out of the coin
        
        logoMesh2.position.z -= (extrudeThickness / 2) * logoScale; // center
        logoMesh2.position.z -= (coinThickness / 2) - 0.4; // offset to edge
        logoMesh2.position.z -= (textThickness / 2) * logoScale; // adjust
        logoMesh2.scale.set(logoScale, logoScale, logoScale);
        

        // assemble the coin geometry out of the constituent geometries/meshes
        let coinGeometry = new THREE.Geometry();

        coinGeometry.merge(cylGeometry);
        coinGeometry.merge(outerRingGeometry);
        //coinGeometry.mergeMesh(outerRingMesh);
        coinGeometry.mergeMesh(logoMesh);
        coinGeometry.mergeMesh(logoMesh2);
        return coinGeometry;
    }

    generateSimpleCoinGeometry() {
        let coinThickness = 0.18 * this.coinRadius;
        function getRingGeometry(radius, height) {
            var outerRadius = 1.1*radius;
            var innerRadius = radius;
            var height = height*1.4;

            var arcShape = new THREE.Shape();
            arcShape.moveTo(outerRadius * 2, outerRadius);
            arcShape.absarc(outerRadius, outerRadius, outerRadius, 0, Math.PI * 2, false);

            /*
            var holePath = new THREE.Path();
            holePath.moveTo(outerRadius + innerRadius, outerRadius);
            holePath.absarc(outerRadius, outerRadius, innerRadius, 0, Math.PI * 2, true);
            arcShape.holes.push(holePath);
            */
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

        var outerRingGeometry = getRingGeometry(this.coinRadius, coinThickness);

        let cylGeometry  = new THREE.CylinderGeometry(
            this.coinRadius, this.coinRadius, coinThickness, 64
        );
        cylGeometry.rotateX(Math.PI / 2);
        outerRingGeometry.rotateX(Math.PI / 2);

        // assemble the coin geometry out of the constituent geometries/meshes
        let coinGeometry = new THREE.Geometry();

        coinGeometry.merge(cylGeometry);
        coinGeometry.merge(outerRingGeometry);
        //coinGeometry.mergeMesh(outerRingMesh);
        return coinGeometry;
    }
};
