/**
VAR
**/

//Colors
var Colors = {

	green: 0xa3c9a8,
	brown: 0xb44b39,
	black: 0x2c363f,
	chocolat: 0x2d1606,
	blue: 0x39aeaa,
	beige: 0xddd8c4,
	bittersweet: 0xff6f59,
	leaf: 0x496F5D,
	white: 0xa49789,
	rock: 0xDDD1C7

};

//Materials
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
var rockMat = new THREE.MeshPhongMaterial( {

		color: Colors.black,
		shading: THREE.FlatShading

	} );

var materials = [
		
	brownMat,
	greenMat,
	blackMat,
	chocolatMat,
	leafMat,
	beigeMat,
	bittersweetMat,
	rockMat

];

//Scene, Lights, Camera, Renderer
var scene, 
	ambientLight, shadowLight,
	camera, fov, aspectRatio, nearPlane, farPlane,
	renderer, container;
var	camPosStart = 150; 
var camPosEnd = 250;

//Screen size
var	wWidth = window.innerWidth;
var	wHeight = window.innerHeight; 

//Utils
var Rabbit, Forest, Ground, Eggs, goldEggs, Rock, 
	windParticles, bonusParticles, 
	timer, distance, gameStatus, sInterval;
var groundRotation = 0;
var	delta = 0;
var speed = 4; 
var maxSpeed = 60;
var score = 0;
var life = 1;
var level = 1;
var collideEgg = 20;
var collideRock = 10;
var fEmitter = 32;
var freq = 3500;
var fTrees = new THREE.Group();

var scoreField = document.getElementById( "sField" );
var	lifeField = document.getElementById( "lField" );
var gameOverField = document.getElementById( "over" );
var parent = document.getElementById( "startInstruction" );
var startField = parent.getElementsByTagName( "p" )[0];
var submitName = document.getElementById( "subName" );

/**
SCENE
**/

function createScene(){

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
	camera.position.z = camPosStart;

	camera.lookAt( 0, 30, 0 );

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


/**
LIGHT
**/

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


/**
MODELS
**/

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
		if ( Math.random() > .85 ){

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

//Forest
Forest = function(){

	var fHeight = 600;
	var tGeom = new THREE.CylinderGeometry( 2, 2, fHeight, 6, 1 );

	tGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 0, fHeight / 2, 0 ) );

	this.mesh = new THREE.Mesh( tGeom, greenMat );
	this.mesh.castShadow = true;

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

		if ( this.status === "sit" ){

			TweenMax.killTweensOf(this.body.rotation);
			TweenMax.killTweensOf(this.torso.rotation);
			TweenMax.killTweensOf(this.ass.rotation);

		}

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

		if( this.status === "jump" ) return;

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

		if( this.status === "rabbitRun" ){

			TweenMax.killTweensOf( this.head.rotation );
		}


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

	Rabbit.prototype.sit = function(){

		TweenMax.killTweensOf( rabbit.body.position );
		TweenMax.killTweensOf( rabbit.body.rotation );
		TweenMax.killTweensOf( rabbit.torso.position );
		TweenMax.killTweensOf( rabbit.torso.rotation );
		TweenMax.killTweensOf( rabbit.ass.position );
		TweenMax.killTweensOf( rabbit.ass.rotation );

		var _this = this;
		var sP = 1.2;
		this.status = "sit";

		TweenMax.to( this.body.rotation, sP, { y: -.7, ease: Power4.easeOut } );
		TweenMax.to( this.torso.rotation, sP, { x: -.4, ease: Power4.easeOut } );
		TweenMax.to( this.ass.rotation, sP, { x: .5, ease: Power4.easeOut, onComplete: function(){

				_this.nod();

			} 

		} );

		TweenMax.to( this.body.position, sP, { y: 0, ease: Power4.easeOut } );

		TweenMax.to( this.pawBackR.rotation, sP, { x: -4, ease: Power4.easeOut } );
		TweenMax.to( this.pawBackR.position, sP, { y: 1, ease: Power4.easeOut } );
		TweenMax.to( this.pawBackL.rotation, sP, { x: -4, ease: Power4.easeOut } );
		TweenMax.to( this.pawBackL.position, sP, { y: 1, ease: Power4.easeOut } );

		TweenMax.to( this.pawFrontR.position, sP, { y: 1, ease: Power4.easeOut } );
		TweenMax.to( this.pawFrontL.position, sP, { y: 1, ease: Power4.easeOut } );

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


//Rock
Rock = function(){


	this.angle = 0;
	this.status = "ready";

	this.mesh = new THREE.Group();

	var geomBase = new THREE.CubeGeometry( 9, 9, 9, 1 );
	var geomMiddle = new THREE.CubeGeometry( 5, 5, 5, 1 );
	var geomTop = new THREE.CubeGeometry( 3, 3, 3, 1 );

	var geometry = [ geomBase, geomMiddle, geomTop ];
	var size = 2 + Math.random() * 10;

	geometry.forEach( function( y ){

		for( var i = 0, l = y.vertices.length; i < l; i++ ){

			if( Math.random() > .5 ){

				y.vertices[i].x += size * -0.25 + Math.random() * size * 0.5;
				y.vertices[i].y += size * -0.25 + Math.random() * size * 0.5;
				y.vertices[i].z += size * -0.25 + Math.random() * size * 0.5;
				
			}
			else{

				y.vertices[i].x -= size * 0.25 + Math.random() * size * -0.5;
				y.vertices[i].y -= size * 0.25 + Math.random() * size * -0.5;
				y.vertices[i].z -= size * 0.25 + Math.random() * size * -0.5;

			}

		}

	} );

	this.base = new THREE.Mesh( geomBase, rockMat );

	this.middle = new THREE.Mesh( geomMiddle, rockMat );
	this.middle.position.y = 3;

	this.top = new THREE.Mesh( geomTop, rockMat );
	this.top.position.y = 1;

	this.mesh.add( this.base );
	this.base.add( this.middle );
	this.middle.add( this.top );

	this.mesh.traverse( function( object ) {

		if( object instanceof THREE.Mesh ){

			object.castShadow = true;
			object.receiveShadow = true;

		}

	} );

}

//Particles
bonusParticles = function(){

	this.mesh = new THREE.Group();

	var bigParticles = new THREE.CubeGeometry( 8, 8, 8, 1 );
	var smallParticles = new THREE.CubeGeometry( 3, 3, 3, 1 );

	this.particles = [];

	for( var i = 0; i < 8; i++ ){

		var particlesChoco = new THREE.Mesh( bigParticles, chocolatMat );
		var particlesBitter = new THREE.Mesh( smallParticles, bittersweetMat );

		this.particles.push( particlesChoco, particlesBitter );

		this.mesh.add( particlesChoco );
		this.mesh.add( particlesBitter );

	}

}

	bonusParticles.prototype.explode = function(){

		var _this = this;
		var eSpeed = .25;

		for( var i = 0; i < this.particles.length; i++ ){

			var formul = -50 + Math.random() * 100;
			var pS = this.particles[i];

			var tx = formul;
			var ty = formul;
			var tz = formul;

			pS.position.set( 0, 0 ,0 );
			pS.scale.set( .9, .9, .9 );
			pS.visible = true;

			var e = eSpeed + Math.random() * .25;

			TweenMax.to( pS.position, e, {x: tx, y: ty, z:tz, ease: Power4.easeOut } );
			TweenMax.to( pS.scale, e, { x: .05, y: .05, z: .05, ease: Power4.easeOut, onComplete: hideParticles, onCompleteParams: [pS] } );

		}
		
	}

function hideParticles( p ){

	p.visible = false;

}

/**
PROPS
**/

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

//Forest
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

//Rabbit
function createRabbit(){

	rabbit = new Rabbit();
	rabbit.mesh.rotation.y = Math.PI / 2;
	
	scene.add( rabbit.mesh );
	rabbit.nod();

}

//Eggs
function createEggs(){

	easterEgg = new Eggs();
	scene.add( easterEgg.mesh );

}

//Rock
function createRock(){

	obstacle = new Rock();

	obstacle.base.rotation.y = -Math.PI / 4;
	obstacle.mesh.scale.set( 1.2, 1.2, 1.2 );
	obstacle.mesh.position.y = 605;

	scene.add( obstacle.mesh ); 

}

//Particles
function createBonusParticles(){

	bParticles = new bonusParticles();
	bParticles.mesh.visible = false;

	scene.add( bParticles.mesh );

}


/**
UPDATES
**/

//Ground
function updateGroundRot(){

	groundRotation += delta * .01 * speed;
	groundRotation = groundRotation % ( Math.PI * 2 );

	ground.rotation.z = groundRotation;

}

//Eggs
function updateEggPos(){

	easterEgg.mesh.rotation.y += delta * 12;
	easterEgg.mesh.rotation.z = Math.PI / 2 - ( groundRotation + easterEgg.angle );
	easterEgg.mesh.position.y = -600 + Math.sin( groundRotation + easterEgg.angle ) * 650;
	easterEgg.mesh.position.x = Math.cos( groundRotation + easterEgg.angle ) * 650;

}

//Rocks
function updateRockPos(){

	if( obstacle.status === "shock" ) return;

	if( groundRotation + obstacle.angle > 2.5 ){

		obstacle.angle = - groundRotation + Math.random() * .5;
		obstacle.base.rotation.y = Math.random() * Math.PI * 2;

	}

	obstacle.mesh.rotation.z = groundRotation + obstacle.angle - Math.PI / 2;
	obstacle.mesh.position.y = -603 + Math.sin( groundRotation + obstacle.angle ) * 605;
	obstacle.mesh.position.x = Math.cos( groundRotation + obstacle.angle ) * 605;

}

//Score
function updateScore(){

	bParticles.mesh.position.copy( easterEgg.mesh.position );
	bParticles.mesh.visible = true;

	bParticles.explode();

	easterEgg.angle += Math.PI / 2;
	score += 20;

	if( speed >= maxSpeed ) return;
	speed += 1;

	gameUI();

}

//Life
function updateLife(){

	obstacle.status = "shock";

	var tX = (Math.random() > .5 ) ? -30 - Math.random() * 10 : 30 + Math.random() * 4;
	var tY = Math.random() * 40;
	var rX = Math.PI * 4;
	var rY = Math.PI * 8;

	TweenMax.to( obstacle.mesh.position, 3, { x: tX, y: tY, z: 300, ease: Power4.easeOut } );
	TweenMax.to( obstacle.mesh.rotation, 3, { x: rX, y: rY, z: rX, ease: Power4.easeOut, onComplete: function(){

		obstacle.status = "ready";
		obstacle.base.rotation.y = Math.random() * Math.PI * 2;
		obstacle.angle = -groundRotation - Math.random() * .5;

		obstacle.angle = obstacle.angle % ( Math.PI * 2 );

		obstacle.mesh.rotation.x = 0;
		obstacle.mesh.rotation.y = 0;
		obstacle.mesh.rotation.z = 0;
		obstacle.mesh.position.z = 0;

		} 

	} ); 

	life -= 1;
	gameUI();

}

//Speed
function updateSpeed(){

	if( speed >= maxSpeed ) return;

	level++;
	speed += 2;

}

//Game Status
function updateGameStatus(){

	if( life === 0 ){

		gameOver();
	
	}

}


/**
UTILS
**/

//Resize
function windowResize(){ 

	renderer.setSize( wWidth, wHeight );

	camera.aspect = wWidth / wHeight;
	camera.updateProjectionMatrix();

};

//Mouse
function mouseEvent( event ){


	if( gameStatus === "play" ){

		startField.className = "hide";
		rabbit.jump();
	
	}
	else if( gameStatus === "readyToPlay" ){

		replay();
	}
	else if( gameStatus === "readyToLaunch"){

		launchGame();
	}

}

//Save, Get, Show Score
function getScore(){

	var gameScore = [];

		gameScore_str = localStorage.getItem( 'CatchTheEgg' );


	if( gameScore_str != null ){

		gameScore = JSON.parse( gameScore_str );

	}

	return gameScore;

}

function showScoreList(){

	var gameScore = getScore(),
		table = document.getElementById( "scoreContainer" ),
		tD = "";

	gameScore.sort( function( a, b ){


		return parseFloat( b.hScore ) - parseFloat( a.hScore );

	} );

	//console.log(gameScore);

	for( var i = 0; i < gameScore.length; i++ ){

		tD += "<li id='" + [i] + "'> <span>" + gameScore[i].name + "</span> <span>" + gameScore[i].hScore + "</span> </li>";

	}

	table.innerHTML = tD;

}

function saveScore(){

	var finalScore = score,
		nameField = document.getElementById( "inputLastname" ).value;
		noName = "NONAME";

	if ( !nameField || nameField == null || nameField === " " ){

		nameField = noName;
	}
	else{

		nameField = nameField;
	}

	saveScore = {

		name: nameField,
		hScore: finalScore

	};

	var gameScore = getScore();

	gameScore.push( saveScore );

	localStorage.setItem( 'CatchTheEgg', JSON.stringify( gameScore ) );

	showScoreList();

	return false;

}

//Detect collisions
function detectCollision(){

	var rabEggCollide = rabbit.mesh.position.clone().sub( easterEgg.mesh.position.clone() );
	var rabRockCollide = rabbit.mesh.position.clone().sub( obstacle.mesh.position.clone() );

	if( rabEggCollide.length() < collideEgg ){

		//Score ++
		updateScore();

	}

	if( rabRockCollide.length() < collideRock && obstacle.status != "shock" ){

		//Life --
		updateLife();

	}

}

//Game Over
function gameOver(){

	gameOverField.className = "show";
	gameStatus = "gameOver";

	showScoreList();

	submitName.addEventListener( "mousedown", function(){

		saveScore();
		gameStatus = "readyToPlay";
	
	} );

	rabbit.sit();

	TweenMax.to(this, 1, {speed: 0 } );
	TweenMax.to( camera.position, 2, { z: camPosEnd, y: 50, x: -20 }, "-=1.5" );

	easterEgg.mesh.visible = false;
	obstacle.mesh.visible = false;

	clearInterval( sInterval );

}

//Reset
function resetGame(){

	scene.add( rabbit.mesh );

	rabbit.mesh.rotation.y = Math.PI / 2;
	rabbit.mesh.position.x = 0;
	rabbit.mesh.position.y = 0;
	rabbit.mesh.position.z = 0;

	speed = 4;
	level = 1;
	life = 1;
	score = 0;

	obstacle.mesh.visible = true;
	easterEgg.mesh.visible = true;

	gameStatus = "play";
	rabbit.status = "rabbitRun";

	gameUI();
	rabbit.nod();
	updateSpeed();
	sInterval = setInterval( updateSpeed, freq );

}

//Replay
function replay(){

	gameStatus = "prepareToPlay";

	gameOverField.className = "hide";

	TweenMax.killTweensOf( rabbit.body.rotation );
	TweenMax.killTweensOf( rabbit.torso.rotation );
	TweenMax.killTweensOf( rabbit.ass.rotation );

	TweenMax.to( rabbit.body.rotation, 2, { y: 0, ease: Power4.easeOut } );
	TweenMax.to( rabbit.torso.rotation, 2, { x: 0, ease: Power4.easeOut } );
	TweenMax.to( rabbit.ass.rotation, 2, { x: 0, ease: Power4.easeOut } );

	TweenMax.to( rabbit.pawBackR.rotation, 2, { x: 0, ease: Power4.easeOut } );
	TweenMax.to( rabbit.pawBackR.position, 2, { y: 0, ease: Power4.easeOut } );
	TweenMax.to( rabbit.pawBackL.rotation, 2, { x: 0, ease: Power4.easeOut } );
	TweenMax.to( rabbit.pawBackL.position, 2, { y: 0, ease: Power4.easeOut } );

	TweenMax.to( rabbit.pawFrontR.position, 2, { y: 0, ease: Power4.easeOut } );
	TweenMax.to( rabbit.pawFrontL.position, 2, { y: 0, ease: Power4.easeOut } );

	TweenMax.to( camera.position, 3, { z: camPosStart, x: 0, y: 30, ease: Power4.easeInOut, onComplete: function(){

			resetGame();

		} 

	} );

}

//GameUI
function gameUI(){

	lifeField.innerHTML = life;
	scoreField.innerHTML = score;

}

//ToggleClass
function toggleClass( element, className ){

	if( !element || !className ){

		return;

	}

	var classString = element.className, nameIndex = classString.indexOf( className );

	if( nameIndex == -1 ){

		classString += ' ' + className;

	}
	else{

		classString = classString.substr( 0, nameIndex ) + classString.substr( nameIndex + className.length );

	}

	element.className = classString;

}

//Render
function render(){

	renderer.render( scene, camera );

}

//Loop
function loop(){

	delta = timer.getDelta();

	//Updates

	if( gameStatus === "play" ){

		if( rabbit.status === "rabbitRun" ){

			rabbit.run();
		
		}
		
		//Updates
		updateGroundRot();
		updateEggPos();
		updateRockPos();
		updateGameStatus();
		detectCollision();

	}

	render();
	requestAnimationFrame( loop );

}

/**
LAUNCH
**/

//Init game
function initGame(){

	//Load Scene & Lights
	createScene();
	createLight();

	//Load Ground & Forest background
	createGround();
	createForest();

	//Load Game props
	createRabbit();

	gameStatus = "readyToLaunch";

	//Render
	loop();

}

//Launch game
function launchGame( event ){

	createEggs();
	createRock();
	createBonusParticles();

	gameUI();
	resetGame();
	showScoreList();

}


//Detector
function detectWebGL(){

	if( Detector.webgl ){

		window.addEventListener( "load", initGame, false );

	} 
	else{

	    var warning = Detector.getWebGLErrorMessage();

	    document.getElementById( 'gameUI ' ).appendChild( warning );

	}

}

detectWebGL();

/*
TODO
	=>Check bug, anim etc...
	=>Correct "sit" animation on gameOver

BONUS
	=>maybe some particles on start screen
*/


