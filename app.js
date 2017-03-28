/**
VAR
**/

/*Colors*/
var Colors = {

	green: 0xa3c9a8,
	brown: 0xb44b39,
	black: 0x2c363f,
	chocolat: 0x2d1606,
	blue: 0x39aeaa,
	beige: 0xddd8c4,
	bittersweet: 0xff6f59,
	leaf: 0x496F5D,
	white: 0xa49789

};

/*Materials*/
var blackMat = new THREE.MeshPhongMaterial( {

		color: Colors.black,
		shading: THREE.FlatShading
		
	} );
var	greenMat = new THREE.MeshLambertMaterial( {

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
var	leafMat = new THREE.MeshPhongMaterial( {

		color: Colors.leaf,
		shininess: 0,
		shading: THREE.FlatShading

	} ); 
var	beigeMat = new THREE.MeshPhongMaterial( {

		color: Colors.beige,
		shading: THREE.FlatShading
		
	} ); 
var	bittersweetMat = new THREE.MeshPhongMaterial( {

		color: Colors.bittersweet,
		shading: THREE.FlatShading
		
	} ); 
var	whiteMat = new THREE.MeshPhongMaterial( {

		color: Colors.white,
		shading: THREE.FlatShading
		
	} ); 

var materials = [
		
	brownMat,
	greenMat,
	blackMat,
	chocolatMat,
	leafMat,
	beigeMat,
	bittersweetMat

];

/*Scene, Lights, Camera, Renderer*/
var scene, 
	ambientLight, shadowLight,
	camera, fov, aspectRatio, nearPlane, farPlane,
	renderer, container,
	camPosStart, camPosEnd;

/*Screen size*/	
var	wWidth, wHeight; 

/*Utils*/
var Rabbit, Forest, Ground, Eggs, timer, distance;
var groundRotation = 0;
var	delta = 0;
var speed = 4; 
var maxSpeed = 44;
var gameStatus;

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

	wWidth = window.innerWidth;
	wHeight = window.innerHeight; 

	//Create scene
	scene = new THREE.Scene();

	scene.fog = new THREE.Fog( 0xd6eae6, 150, 400 );

	//Create camera
	aspectRatio = wWidth / wHeight;
	fov = 80;
	nearPlane = 1;
	farPlane = 4000;

	camera = new THREE.PerspectiveCamera(

		fov,
		aspectRatio,
		nearPlane,
		farPlane

	);

	camera.position.x = 0;
	camera.position.y = 30;
	camera.position.z = 150;

	//Create renderer
	renderer = new THREE.WebGLRenderer( {alpha: true, antialias: true} );

	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( wWidth, wHeight );
	renderer.shadowMap.enabled = true;

	container = document.getElementById( 'world' );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', windowResize, false );

	document.addEventListener( "mousedown", mouseEvent, false );

	timer = new THREE.Clock();

};

//Resize
function windowResize(){

	wWidth = window.innerWidth;
	wHeight = window.innerHeight; 

	renderer.setSize( wWidth, wHeight );

	camera.aspect = wWidth / wHeight;
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
	shadowLight.shadow.camera.far = 2000;

	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;
	
	scene.add( ambientLight );
	scene.add( shadowLight );

}

//Ground
function createGround(){

		var geomShadow = new THREE.SphereGeometry( 600, 64, 64 );
		var geom = new THREE.SphereGeometry( 600, 64, 64 );

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

		//ground.rotation.z += 0.05;

}

function mouseEvent( event ){

	rabbit.jump();

}

function updateGroundRot(){

	groundRotation += delta * .05 * speed;
	groundRotation = groundRotation % ( Math.PI * 2 );

	ground.rotation.z = groundRotation;

}

//Rabbit
Rabbit = function(){

	this.status = "rabbitRun";
	this.runningCycle = 0;

	this.mesh = new THREE.Group();
	this.body = new THREE.Group();

	this.mesh.add( this.body );

	var geomTorso, geomTail, geomAss, geomCheek, geomHead, geomNose, geomFrontPaw, geomBackPaw, geomEar, geomEye, geomIris;

	//Torso
	geomTorso = new THREE.CubeGeometry( 7, 7, 10 , 1 );

	this.torso = new THREE.Mesh( geomTorso, beigeMat );
	this.torso.position.y = 7;
	this.torso.position.z = 0;
	this.torso.castShadow = true;

	this.body.add( this.torso );

	//Ass
	geomAss = new THREE.CubeGeometry( 9, 9, 5, 1 );

	this.ass = new THREE.Mesh( geomAss, beigeMat);
	this.ass.position.y = 0;
	this.ass.position.z = -3;
	this.ass.castShadow = true;

	this.torso.add( this.ass );

	//Tail
	geomTail = new THREE.CubeGeometry( 3, 3 , 3, 1 );
	geomTail.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, -2 ) );

	this.tail = new THREE.Mesh( geomTail, beigeMat );
	this.tail.position.y = 5;
	this.tail.position.z = -4;
	this.tail.castShadow = true;
	this.torso.add( this.tail );

	//Head
	geomHead = new THREE.CubeGeometry( 10, 10, 12, 1 );
	geomHead.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 7 ) );

	this.head = new THREE.Mesh( geomHead, beigeMat );
	this.head.position.y = 10;
	this.head.position.z = 2;
	this.head.castShadow = true;

	this.body.add( this.head );

	//Cheek
	geomCheek = new THREE.CubeGeometry( 1, 4, 4, 1 );

	this.cheekR = new THREE.Mesh( geomCheek, bittersweetMat );
	this.cheekR.position.x = -5;
	this.cheekR.position.y = -2.5;
	this.cheekR.position.z = 7;
	this.cheekR.castShadow = true;

	this.head.add( this.cheekR );

	this.cheekL = this.cheekR.clone();
	this.cheekL.position.x = -this.cheekR.position.x;

	this.head.add( this.cheekL );

	//Nose
	geomNose = new THREE.CubeGeometry( 6, 6, 2, 1 );

	this.nose = new THREE.Mesh( geomNose, bittersweetMat );
	this.nose.position.y = 2.5;
	this.nose.position.z = 13;
	this.nose.castShadow = true;

	this.head.add( this.nose );


	//Front Paws
	geomFrontPaw = new THREE.CubeGeometry( 2, 2, 2, 1 );

	this.pawFrontR = new THREE.Mesh( geomFrontPaw, beigeMat );
	this.pawFrontR.position.x = -2;
	this.pawFrontR.position.y = 1.5;
	this.pawFrontR.position.z = 6;
	this.pawFrontR.castShadow = true;

	this.body.add( this.pawFrontR );

	this.pawFrontL = this.pawFrontR.clone();
	this.pawFrontL.position.x = -this.pawFrontR.position.x;
	this.pawFrontL.castShadow = true;

	this.body.add( this.pawFrontL );

	geomBackPaw = new THREE.CubeGeometry( 2, 2, 6, 1 );

	this.pawBackR = new THREE.Mesh( geomBackPaw, beigeMat );
	this.pawBackR.position.x = -5;
	this.pawBackR.position.y = 1.5;
	this.pawBackR.position.z = 0;
	this.pawBackR.castShadow = true;

	this.body.add( this.pawBackR );

	this.pawBackL = this.pawBackR.clone();
	this.pawBackL.position.x = -this.pawBackR.position.x;
	this.pawBackL.castShadow = true;

	this.body.add( this.pawBackL );

	//Ears
	geomEar = new THREE.CubeGeometry( 8, 20, 2, 1 );

	geomEar.vertices[6].x += 2;
	geomEar.vertices[6].z += .5;
	geomEar.vertices[7].x += 2;
	geomEar.vertices[7].z -= .5;
	geomEar.vertices[2].x -= 2;
	geomEar.vertices[2].z -= .5;
	geomEar.vertices[3].x -= 2;
	geomEar.vertices[3].z += .5;

	geomEar.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 9, 0 ) );

	this.earR = new THREE.Mesh( geomEar, beigeMat );
	this.earR.position.x = -2;
	this.earR.position.y = 5;
	this.earR.position.z = 2.5;
	this.earR.rotation.z = Math.PI / 10;
	this.earR.castShadow = true;

	this.head.add( this.earR );

	this.earL = this.earR.clone();
	this.earL.position.x = -this.earR.position.x;
	this.earL.rotation.z = -this.earR.rotation.z;
	this.earL.castShadow = true;

	this.head.add( this.earL );

	//Eyes
	geomEye = new THREE.CubeGeometry( 2, 4, 4 );

	this.eyeR = new THREE.Mesh( geomEye, whiteMat );
	this.eyeR.position.x = -5;
	this.eyeR.position.y = 2.9;
	this.eyeR.position.z = 5.5;
	this.eyeR.castShadow = true;

	this.head.add( this.eyeR );

	//Iris
	geomIris = new THREE.CubeGeometry( .5, 2, 2 );

	this.iris = new THREE.Mesh( geomIris, blackMat );
	this.iris.position.x = -1.2;
	this.iris.position.y = 1;
	this.iris.position.z = 1;
	this.eyeR.add( this.iris );

	this.eyeL = this.eyeR.clone();
	this.eyeL.children[0].position.x = this.iris.position.x;
	this.eyeL.position.x = -this.eyeR.position.x;


	this.head.add( this.eyeL );

	this.body.traverse( function( object ){

		if( object instanceof THREE.Mesh ){

			object.castShadow = true;
			object.receiveShadow = true;

		}

	});

}

Rabbit.prototype.run = function(){

	this.status = "rabbitRun";

	var s = Math.min( speed, maxSpeed );

	this.runningCycle += delta * s * .5;
	this.runningCycle = this.runningCycle %  ( Math.PI * 2 );

	var rC = this.runningCycle;

	var a = 4;
	var d = .2;

	//Body
	this.body.position.y = 6 + Math.sin( rC - Math.PI / 2 ) * a;
	this.body.rotation.x = .2 + Math.sin( rC - Math.PI / 2 ) * a * .1;

	this.torso.rotation.x =  Math.sin( rC - Math.PI / 2 ) * a * .1;
	this.torso.position.y =  7 + Math.sin( rC - Math.PI / 2 ) * a * .5;

	//Head
	this.head.position.z = 2 + Math.sin( rC - Math.PI / 2 ) * a * .5;
	this.head.position.y = 8 + Math.cos( rC - Math.PI / 2 ) * a * .7;
	this.head.rotation.x = -.2 + Math.sin( rC + Math.PI ) * a * .1;

	//Ears
	this.earL.rotation.x = Math.cos(-Math.PI / 2 + rC ) * ( a * .2 );
	this.earR.rotation.x = Math.cos( -Math.PI / 2 + .2 + rC ) * ( a * .3 );

	//Eyes
	this.eyeR.scale.y = .7 +  Math.abs( Math.cos( -Math.PI / 4 + rC * .5) ) * .6;
	this.eyeL.scale.y = .7 +  Math.abs( Math.cos( -Math.PI / 4 + rC * .5) ) * .6;

	//Tail
	this.tail.rotation.x = Math.cos( Math.PI / 2 + rC ) * a * .3;

	//Paws
	this.pawFrontR.position.y = 1 + Math.sin( rC ) * a ; 
	this.pawFrontR.rotation.x = Math.cos( rC ) * Math.PI / 4;
	this.pawFrontR.position.z = 6 - Math.cos( rC )* a * 2;

	this.pawFrontL.position.y = 1 + Math.sin( d + rC ) * a; 
	this.pawFrontL.rotation.x = Math.cos( rC ) * Math.PI / 4;
	this.pawFrontL.position.z = 6 - Math.cos( d + rC ) * a * 2;

	this.pawBackR.position.y = 1+ Math.sin( Math.PI + rC ) * a; 
	this.pawBackR.rotation.x = Math.cos( rC + Math.PI * 1.5 ) * Math.PI / 2;
	this.pawBackR.position.z = -Math.cos( Math.PI + rC ) * a ; 

	this.pawBackL.position.y = 1 + Math.sin( Math.PI + rC ) *  a ; 
	this.pawBackL.rotation.x = Math.cos( rC + Math.PI * 1.5 ) * Math.PI / 2;
	this.pawBackL.position.z = -Math.cos( Math.PI + rC ) * a ; 
	
}

Rabbit.prototype.jump = function(){

	if( this.status === "jump" ){

		return;
	}

	this.status = "jump";

	var _this = this;
	var tSpeed = 20 / speed;
	var jHeight = 60;

	TweenMax.to( this.earL.rotation, tSpeed, { x: "+= .3", ease: Back.easeOut } );
	TweenMax.to( this.earR.rotation, tSpeed, { x: "-= .3", ease: Back.easeOut } );

	TweenMax.to( this.pawFrontL.rotation, tSpeed, { x:"+= .7", ease: Back.easeOut } );
	TweenMax.to( this.pawFrontR.rotation, tSpeed, { x:"-= .7", ease: Back.easeOut } );
	TweenMax.to( this.pawBackL.rotation, tSpeed, { x:"+= .7", ease: Back.easeOut } );
	TweenMax.to( this.pawBackR.rotation, tSpeed, { x:"-= .7", ease: Back.easeOut } );

	TweenMax.to( this.tail.rotation, tSpeed, {x: "+= 1", ease: Back.easeOut } ); 

	TweenMax.to( this.mesh.position, tSpeed / 2, { y: jHeight, ease: Power2.easeOut } );
	TweenMax.to( this.mesh.position, tSpeed / 2, { y: 0, ease: Power4.easeIn, delay: tSpeed * .5, onComplete: function(){

			_this.status = "rabbitRun";

		}
		
	} );

}

Rabbit.prototype.nod = function(){

	var _this = this;
	var sP = .8 + Math.random();

	var headRotY, 
		earLRotX, earRRotX,
		tailRotX, tailRotZ, 

	//Head
	headRotY = -Math.PI / 5 + Math.random() * Math.PI / 2;

	TweenMax.to( this.head.rotation, sP, { y: headRotY, ease: Power4.easeInOut, onComplete: function(){

			_this.nod();

		}

	} );

	//Tail
	tailRotX = tailRotZ = Math.PI / 4 + Math.random() * Math.PI / 4;

	TweenMax.to( this.tail.rotation, sP, { x: tailRotX, ease: Power4.easeInOut } );
	TweenMax.to( this.tail.rotation, sP, { z: tailRotZ, ease: Power4.easeInOut } );


	//Ears
	earLRotX = earRRotX = Math.PI / 8 + Math.random() * Math.PI / 8; 

	TweenMax.to( this.earL.rotation, sP, { x: earLRotX, ease: Power4.easeInOut } );
	TweenMax.to( this.earR.rotation, sP, { x: earRRotX, ease: Power4.easeInOut } );

	//Eyes
	if ( Math.random() > .8 ){

		TweenMax.to( [ this.eyeR.scale, this.eyeL.scale ], sP / 10, {y: 0, ease: Power1.easeInOut, yoyo: true, repeat: 1 } );
		
	}

	//Nose
	if ( Math.random() > .2 ){

		TweenMax.to( this.nose.scale, sP / 5, { y: .9, ease: Power1.easeInOut, yoyo: true, repeat: 3 } );

	}

}

function createRabbit(){

	rabbit = new Rabbit();
	rabbit.mesh.rotation.y = Math.PI / 2;
	
	scene.add( rabbit.mesh );
	rabbit.nod();

}

//Eggs
Eggs = function(){

	this.angle = 0;
	this.mesh = new THREE.Group();

	var geomEgg = new THREE.CylinderGeometry( 2, 2, 10, 4 , 2 );

	geomEgg.vertices[4].x += 3;
	geomEgg.vertices[4].z += 3;
	geomEgg.vertices[5].x += 3;
	geomEgg.vertices[5].z -= 3;
	geomEgg.vertices[6].x -= 3;
	geomEgg.vertices[6].z -= 3;
	geomEgg.vertices[7].x -= 3;
	geomEgg.vertices[7].z += 3;

	this.body = new THREE.Mesh( geomEgg, chocolatMat );

	var geomRuban = new THREE.CubeGeometry( 6, 10, 1 , 1 );

	geomRuban.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 5, 0 ) );

	geomRuban.vertices[1].x -= 1;
	geomRuban.vertices[2].x -= 1;
	geomRuban.vertices[6].x += 1;
	geomRuban.vertices[7].x += 1;

	this.rubanR = new THREE.Mesh( geomRuban, bittersweetMat );

	this.rubanR.position.x = 1;
	this.rubanR.position.y = 3;
	this.rubanR.position.z = -1;
	this.rubanR.rotation.z = -.7;

	this.rubanL = this.rubanR.clone();

	this.rubanL.scale.set( 1, .75, .5, 1 );
	this.rubanL.position.x = -this.rubanR.position.x;
	this.rubanL.rotation.z = -this.rubanR.rotation.z;


	this.mesh.add( this.body );
	this.mesh.add( this.rubanR );
	this.mesh.add( this.rubanL );

	this.body.traverse( function( object ){

		if( object instanceof THREE.Mesh ){

			object.castShadow = true;
			object.receiveShadow = true;

		}

	} );
}

function createEggs(){

	easterEgg = new Eggs();
	scene.add( easterEgg.mesh );

}

function updateEggPos(){

	//easterEgg.mesh.rotation.y += delta * 10;
	easterEgg.mesh.position.y = 50 + Math.random() * 50;
	easterEgg.mesh.position.x = Math.random() * 50;

}

//Forest
Forest = function(){

	var fHeight = 600;
	var tGeom = new THREE.CylinderGeometry( 2, 2, fHeight, 6, 1 );

	tGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 0, fHeight / 2, 0 ) );

	this.mesh = new THREE.Mesh( tGeom, greenMat );
	this.mesh.castShadow = true;

}

var fTrees = new THREE.Group();

function createForest(){

	var nTrees = 150;

	for( var i = 0; i < nTrees; i++ ){

		var p = i * ( Math.PI * 2 ) / nTrees;
		var t = Math.PI / 2;

		t += ( Math.random() > .05) ? .25 + Math.random() * .25 : - .35 -  Math.random() * .3 ;

		var newTree = new Trees();

		newTree.mesh.position.x = Math.sin( t ) * Math.cos( p ) * 600;
		newTree.mesh.position.y = Math.sin( t ) * Math.sin( p ) * 590;
		newTree.mesh.position.z = Math.cos( t ) * 200;

		var v = newTree.mesh.position.clone();
		var a = new THREE.Vector3( 0, 1, 0 );

		newTree.mesh.quaternion.setFromUnitVectors( a, v.clone().normalize() );

		ground.add( newTree.mesh );

	}
	
}

//Trees
Trees = function(){

	this.mesh = new THREE.Object3D();
	this.trunk = new Trunk();
	this.mesh.add( this.trunk.mesh );

}

Trunk = function(){

	var tHeight = 90 + Math.random() * 400;
	var topRradius = 1 + Math.random() * 8;
	var bottomRadius = 5 + Math.random() * 12;
	var mats = materials;
	var matTrunk = blackMat;
	var nHSegments = 8;
	var nVSegments = 8;
	var geom = new THREE.CylinderGeometry( topRradius, bottomRadius, tHeight, nHSegments, nVSegments );

	geom.applyMatrix( new THREE.Matrix4().makeTranslation( 0, tHeight / 2, 0 ) );

	this.mesh = new THREE.Mesh( geom, matTrunk );

	for( var i = 0; i  < geom.vertices.length; i++ ){

		var noise = Math.random();
		var PInoise = Math.random() * Math.PI;
		var formula = -noise + Math.random() * noise * 2;
		var v = geom.vertices[i];

		v.x += formula;
		v.y += formula;
		v.z += formula;

		geom.computeVertexNormals();

		//Branch
		if( Math.random() > .8 && v.y > 10 && v.y < tHeight - 10 ){

			var h = Math.random() * 1.5 + Math.random() * 15;
			var thickness = 2 + Math.random();
			var geomBranch = new THREE.CylinderGeometry( thickness / 2, thickness, h, 6, 1);

			geomBranch.applyMatrix( new THREE.Matrix4().makeTranslation( 0, h / 2, 0) );


			var branch = new THREE.Mesh( geomBranch, matTrunk );

			branch.position.x = v.x / 2;
			branch.position.y = v.y;
			branch.position.z = v.z / 2;

			var v = new THREE.Vector3( v.x, 2, v.z );
			var axis = new THREE.Vector3( 0, 1, 0 );

			branch.quaternion.setFromUnitVectors( axis, v.clone().normalize() );

			this.mesh.add( branch );

		}

		//Leaf
		if ( Math.random() > .8 ){

			var size = Math.random() * 12;
			var geomLeaf = new THREE.OctahedronGeometry( size, 1 );
			var matLeaf = mats[ Math.floor( Math.random() * mats.length) ];
			var leaf = new THREE.Mesh( geomLeaf, matLeaf );

			leaf.position.x = v.x;
			leaf.position.y = v.y;
			leaf.position.z = v.z;
			leaf.rotation.x = PInoise;
			leaf.rotation.y = PInoise;
		
			this.mesh.add( leaf );
		}

	}

	this.mesh.castShadow = true;

}

//Particles


//Obstacles


//Game
function loop(){

	delta = timer.getDelta();

	//Updates
	updateGroundRot();
	//updateEggPos();


	if( rabbit.status === "rabbitRun" ){

		rabbit.run();
	
	}
	else{

		rabbit.nod();
	}

	renderer.render( scene, camera );
	requestAnimationFrame( loop );
}

window.addEventListener( "load", init, false );

function init( event ){

	//Load Scene & Lights
	createScene();
	createLight();

	//Load Ground & Forest background
	createGround();
	createForest();

	//Load Game props
	createRabbit();
	createEggs();

	//Render
	loop();

}

function resetGame(){

	scene.add( rabbit.mesh );

	rabbit.mesh.position.x = 0;
	rabbit.mesh.position.y = 0;
	rabbit.mesh.position.z = 0;

	speed = 12;
	gameStatus = "play";
	rabbit.status = "run";
	rabbit.nod();

}

function updateDistance(){

	distance += delta * speed;

	var d = distance / 2;

	fieldDistance.innerHTML = Math.floor( d );

}

/*
TODO

Add score, add bonus - malus, add life, add gameover resetGame and replay, add highscore field and save name, add collision

BONUS : add particles
MAYBE : add monster?
*/
