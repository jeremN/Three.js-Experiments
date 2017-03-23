var Colors = {

	green: 0x7abf8e,
	brown: 0xb44b39,
	black: 0x100707

};

var blackMat = new THREE.MeshPhongMaterial( {

		color: Colors.black,
		shading: THREE.FlatShading
		
	} ),
	greenMat = new THREE.MeshPhongMaterial( {

		color: Colors.green,
		shininess: 0,
		shading: THREE.FlatShading
		
	} ), 
	chocolatMat = new THREE.MeshPhongMaterial( {

		color: Colors.brown,
		shading: THREE.FlatShading

	} );

var scene, 
	camera, fov, aspectRatio, nearPlane, farPlane,
	gWidth = window.innerWidth,
	gHeight = window.innerHeight, 
	renderer, container;

var Bunny, Forest, Ground;


//Create scene
function createScene(){

	//Create scene
	scene = new THREE.Scene();

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

function windowResize(){

		renderer.setSize( gWidth, gHeight ).
		camera.aspect = gWidth / gHeight;
		camera.updateProjectionMatrix();

};

//Lights
var hemisphereLight, ambientLight;

function createLight(){

	
	
}