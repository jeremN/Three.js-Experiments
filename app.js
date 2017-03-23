/**
Variables
**/

/*Colors*/
var Colors = {

	green: 0xa3c9a8,
	brown: 0xb44b39,
	black: 0x2c363f,
	chocolat: 0x2d1606,
	blue: 0x39aeaa,
	beige: 0xddd8c4,
	bittersweet: 0xff6f59


};

/*Materials*/
var blackMat = new THREE.MeshPhongMaterial( {

		color: Colors.black,
		shading: THREE.FlatShading
		
	} );
var	greenMat = new THREE.MeshPhongMaterial( {

		color: Colors.green,
		
	} ); 
var	greenMatShadow = new THREE.MeshPhongMaterial( {

		color: Colors.green,
		shininess: 1,
		specular: 0x000000,
		transparent: true,
		opacity: .5
	
	} ); 
var	chocolatMat = new THREE.MeshPhongMaterial( {

		color: Colors.chocolat,
		shading: THREE.FlatShading

	} );
var	brownMat = new THREE.MeshPhongMaterial( {

		color: Colors.brown,
		shading: THREE.FlatShading

	} );

var materials = [
		
	brownMat,
	greenMat,
	blackMat,
	greenMatShadow,
	chocolatMat

];

/*Scene, Lights, Camera, Renderer*/
var scene, 
	ambientLight, shadowLight,
	camera, fov, aspectRatio, nearPlane, farPlane,
	renderer, container;

/*Screen size*/	
var	gWidth = window.innerWidth;
var	gHeight = window.innerHeight; 

/*Utils*/
var Bunny, Forest, Ground;

/*Mouse position*/
var mousePos = { 

	x: 0, 
	y: 0

};

/**
GAME
**/

//Create scene
function createScene(){

	//Create scene
	scene = new THREE.Scene();

	scene.fog = new THREE.Fog( 0xd6eae6, 150, 350 );

	//Create camera
	aspectRatio = gWidth / gHeight;
	fov = 60;
	nearPlane = 1;
	farPlane = 10000;

	camera = new THREE.PerspectiveCamera({

		fov,
		aspectRatio,
		nearPlane,
		farPlane

	});

	camera.position.x = 0;
	camera.position.y = 100;
	camera.position.z = 200;

	//Create renderer
	renderer = new THREE.WebGLRenderer( {alpha: true, antialias: true} );

	renderer.setSize( gWidth, gHeight );
	renderer.shadowMap.enabled = true;

	container = document.getElementById( 'world' );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', windowResize, false );

};

//Resize
function windowResize(){

		renderer.setSize( gWidth, gHeight );
		camera.aspect = gWidth / gHeight;
		camera.updateProjectionMatrix();

};

//Lights
function createLight(){

	ambientLight = new THREE.AmbientLight( 0xffffff, .5 );

	shadowLight = new THREE.DirectionalLight( 0xffffff, .7 );

	shadowLight.position.set( 150, 350, 350 );
	shadowLight.castShadow = true;
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 3000;

	shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;
	
	scene.add( ambientLight );
	scene.add( shadowLight );

}

//Ground
function createGround(){

		var geomShadow = new THREE.SphereGeometry( 600, 60, 60 );
		var geom = new THREE.SphereGeometry( 600, 60, 60 );

		var matShadow = greenMatShadow;
		var mat = greenMat;

		groundShadow = new THREE.Mesh( geomShadow, matShadow );
		groundShadow.receiveShadow = true;

		groundFloor = new THREE.Mesh( geom, mat );
		groundFloor.receiveShadow = true;

		ground = new THREE.Group();
		ground.position.y = -600;

		ground.add( groundShadow );
		ground.add( groundFloor );
		scene.add( ground );

}

//Trees
Trees = function(){

	this.mesh = new THREE.Object3d();
	this.trunk = new Trunk();
	this.mesh.add( this.trunk.mesh );

}

Trunk = function(){

	var tHeight = 50 + Math.random() * 150;
	var topRradius = 1 + Math.random() * 5;
	var bottomRadius = 5 + Math.random() * 5;
	var mats = materials;
	var matTrunk = blackMat;
	var nHSegments = 3;
	var nVSegments = 3;
	var geom = new THREE.CylinderGeometry( topRradius, bottomRadius, tHeight, nHSegments, nVSegments );

	geom.applyMatrix( new THREE.matrix4().makeTranslation( 0, tHeight / 2, 0 ) );

	this.mesh = new THREE.Mesh( geom, matTrunk );

	for( var i = 0; i  < geom.vertices.length; i++ ){

		var v = geom.vertices[i];
		var noise = Math.random() * Math.PI * 2;
		var formula = -noise + Math.random() * noise;

		v.x += formula;
		v.y += formula;
		v.z += formula;

		geom.computeVertexNormals();
	}

	//Leaf
	if ( Math.random() > .7 ){

		var size = Math.random() * 3;
		var geomLeaf = new THREE.CubeGeometry( size, size, size, 1 );
		var matLeaf = greenMat;
		var leaf = new THREE.Mesh( geomLeaf, matLeaf );

		leaf.position.x = v.x;
		leaf.position.y = v.y + 4;
		leaf.position.y = v.y + 4;
	}
}

function loop(){

	renderer.render( scene, camera );
	requestAnimationFrame( loop );
}

function init(){

	createScene();
	createLight();
	createGround();

	loop();
}

init();

//window.addEventListener( "load", init, false );