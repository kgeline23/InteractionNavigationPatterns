import * as BABYLON from "babylonjs";
import * as BABYLONGUI from "babylonjs-gui";
import { LoadEntity, CreateScene, getHotspots, setSceneCamera, getMesh } from "../js/scripts";
import { createMainMenu, addGizmoBehavior, addColorBehavior, addHorizontalBehavior,addPositionBehavior, createHoloSlateImage, createHoloSlate} from "../js/interactions";
import { AbstractMesh, Scene } from "babylonjs";

export const createOpenScene = async function(engine: BABYLON.Engine, canvas: HTMLCanvasElement) : Promise<Scene>
{
	return new Promise((resolve, reject) =>
	{
		const nav = true;
		let scene = CreateScene(engine, nav); //CreateScene found in scrips.js //navigation is possible, navigation = true
		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh: BABYLON.AbstractMesh[] = [];
		LoadEntity("open", "", "./assets/models/", "openScene.glb", assetsManager, myMesh); //loadEntitiy definition in js/script.js
		assetsManager.load();

		assetsManager.onFinish = function (tasks)
		{
			//hotspot positions
			scene.hotspots = getHotspots(scene);

			//get floor/ground needed for navigation
			const ground = getMesh(scene, "ground")
			ground.physicsImpostor = new BABYLON.PhysicsImpostor(
				ground,
				BABYLON.PhysicsImpostor.BoxImpostor,
				{ mass: 0, ignoreParent: true, },
				scene
			);
			if (ground)
				scene.floorMeshes = [ground];

			//const t = BABYLON.Mesh.MergeMeshes([tableTop, tableLegs], true, true, undefined, false, true);
			const table = getMesh(scene, "top", 0);
			table.isVisible = false;
			table.checkCollisions = true;
			
			const counter = getMesh(scene, "counter", 0);
			counter.isVisible = false;
			counter.checkCollisions = true;

			const walls = (scene.getNodeByName("walls") as BABYLON.Node).getChildMeshes();
			walls.forEach(element => {
				element.computeWorldMatrix(true);
				element.physicsImpostor = new BABYLON.PhysicsImpostor(
					element, 
					BABYLON.PhysicsImpostor.BoxImpostor, 
					{ ignoreParent: true, mass: 0}, //, friction: 0.8, restitution: 0.5, disableBidirectionalTransformation: false }, 
					scene
				);
				element.checkCollisions = true;
			});	
			
			//color changing of cube
			const cubeColor = getMesh(scene, "cubeColor", 1);
			if(cubeColor)
			{
				const meshMaterial = new BABYLON.StandardMaterial("material", scene);
				meshMaterial.diffuseColor = BABYLON.Color3.Random();
				cubeColor.material = meshMaterial;
				scene.meshMaterial = meshMaterial;
				addColorBehavior(scene, cubeColor);
			};

			//transformation of cube
			const cube = getMesh(scene, "cube", 1);
			if (cube)
			{
				const mat = new BABYLON.StandardMaterial("material", scene);
				mat.diffuseColor = BABYLON.Color3.Random();
				cube.material = mat;
				//addGizmoBehavior(scene, cube); //transform behavior
				addPositionBehavior(cube);
			};

			//transformation of cube
			const choco = getMesh(scene, "choco", 0);
			if (choco)
			{				
				addGizmoBehavior(scene, choco); //transform behavior
			};

			//movement of sphere
			const sphere = getMesh(scene, "sphere", 1) as AbstractMesh;
			sphere.checkCollisions = true;
			if (sphere)
			{
				addHorizontalBehavior(sphere);
			};

			//movement of sphere
			const tablet = getMesh(scene, "tablet", 1) as AbstractMesh;
			tablet!.checkCollisions = true;
			if (tablet)
			{				
				addPositionBehavior(tablet);
			};

			//movement of sphere
			const glass1 = getMesh(scene, "glass1", 1) as AbstractMesh;
			if (glass1)
			{			
				glass1.checkCollisions = true;
				addPositionBehavior(glass1);
			};
						//movement of sphere
			const glass2 = getMesh(scene, "glass2", 1) as AbstractMesh;
			if (glass2)
			{
				glass2.checkCollisions = true;
				addPositionBehavior(glass2);
			};
			//movement of sphere
			const coffeeTop = getMesh(scene, "coffeeTableTop", 0) as AbstractMesh;
			coffeeTop.checkCollisions = true;
			coffeeTop!.visibility = 0;
			//movement of sphere
			const dinningSet = getMesh(scene, "dinningTable", 0) as AbstractMesh;
			dinningSet.checkCollisions = true;
			dinningSet!.visibility = 0;

			//setting camera for scene
			setSceneCamera(scene);

			//menu creation
			scene.menu = scene.getNodeByName("menu") as BABYLON.AbstractMesh;
			scene.menuScale = new BABYLON.Vector3(0.16, 0.16, 0.16);
			scene.menuRotation = new BABYLON.Vector3(0, 1.5 * Math.PI, 0);
			createMainMenu(scene); //creates hologram menu for changing scenes and navigation type
			

			//placement meshes for the slates
			const posChoco   = (scene.getNodeByName("noteChoco") as BABYLON.AbstractMesh).getAbsolutePosition();
			const posChoco1  = (scene.getNodeByName("noteChoco1") as BABYLON.AbstractMesh).getAbsolutePosition();
			const posWelcome = (scene.getNodeByName("noteWelcome") as BABYLON.AbstractMesh).getAbsolutePosition();
			const posCenter  = (scene.getNodeByName("noteCenter") as BABYLON.AbstractMesh).getAbsolutePosition();
			const posCenter1  = (scene.getNodeByName("noteCenter1") as BABYLON.AbstractMesh).getAbsolutePosition();
			const posCenter2  = (scene.getNodeByName("noteCenter2") as BABYLON.AbstractMesh).getAbsolutePosition();
			const posCenter3  = (scene.getNodeByName("noteCenter3") as BABYLON.AbstractMesh).getAbsolutePosition();
			const posCenter4  = (scene.getNodeByName("noteCenter4") as BABYLON.AbstractMesh).getAbsolutePosition();
			const posCenter5  = (scene.getNodeByName("noteCenter5") as BABYLON.AbstractMesh).getAbsolutePosition();

			const posIns     = (scene.getNodeByName("noteInst") as BABYLON.AbstractMesh).getAbsolutePosition();
			const posIns1    = (scene.getNodeByName("noteInst1") as BABYLON.AbstractMesh).getAbsolutePosition();
			const posIns2    = (scene.getNodeByName("noteConst") as BABYLON.AbstractMesh).getAbsolutePosition();

			//Slates at the start of the scene
			createHoloSlate(scene, 
				"Constaint", 
				"Due to a bablyon constraint, when switching scenes VR will be exited and then re-entered by pressing the glasses button again. (This is a feature they are lookin at fixing)",
				posIns2, 
				new BABYLON.Vector3(0, 1.5 * Math.PI, 0), 
				"Understood"
				);

			createHoloSlateImage(scene,
				"The current navigation pattern is controller based locomotion. To move, push the joysticks on the controller forward and look in the direction you want to move in. Let's move to the table in the center to try out some interaction patterns.",
				new BABYLONGUI.Image("joy", "../assets/img/controllerJoystick.png"), 
				posIns1, 
				new BABYLON.Vector3(0, 1.5 * Math.PI, 0),
				"Got it!",
				);
			createHoloSlateImage(scene,
				"For all interactions use the trigger button on your controller",				
				new BABYLONGUI.Image("trig", "../assets/img/controllerTrigger.png"), 
				posIns, 
				new BABYLON.Vector3(0, 1.5 * Math.PI, 0),
				"Next..",
				);
			createHoloSlate(scene, 
				"Welcome!", 
				"Hi, welcome to this demo. In this scene you will be testing out some interaction patterns.", 
				posWelcome, 
				new BABYLON.Vector3(0, 1.5 * Math.PI, 0),  
				"Next.."
				); 

			//slates at kitchen
			createHoloSlate(scene, 
			"Meeting time", 
			"Great! It's time for your meeting. Got back to the stairs and select 'Office' in the menu",
			posChoco1, 
			new BABYLON.Vector3(0, 0.6 * Math.PI, 0), 
			"Lets go!",
			new BABYLON.Vector2(0.8,0.8));

			createHoloSlate(scene, 
				"Have a snack", 
				"Want a different size? Try adjusting the chocolate bar, by clicking and dragging on the colored handles around it.", 
				posChoco, 
				new BABYLON.Vector3(0, 0.6 * Math.PI, 0),
				"Done",
				new BABYLON.Vector2(0.8,0.8)); 

			//Slates at the center table		
			createHoloSlate(scene, 
				"", 
				"How about a quick snack before your meeting? Head over to the kitchen, there is somthing waiting for you on the counter", 
				posCenter5,  
				new BABYLON.Vector3(0, 1 * Math.PI, 0),
				"Alright",
				new BABYLON.Vector2(0.8,0.8)); 

			createHoloSlate(scene, 
				"Transformation", 
				"You can also try dragging the ball off the table. For this gravity was applied to the ball and the movement was restricted, so it can only be moved along the x axis",
				posCenter4,  
				new BABYLON.Vector3(0, 1 * Math.PI, 0), 
				"Alright",
				new BABYLON.Vector2(0.8,0.8)); 

			createHoloSlate(scene, 
				"Transformation - Positioning", 
				"Try changing the position of the second cube, it can be dragged in any direction.",  
				posCenter3,  
				new BABYLON.Vector3(0, 1 * Math.PI, 0),
				"Next.." ,
				new BABYLON.Vector2(0.8,0.8)); 		

			createHoloSlate(scene, 
				"Transformation", 
				"Transformation can be done by changing the scaling, and position of the object.",
				posCenter2,  
				new BABYLON.Vector3(0, 1 * Math.PI, 0),  
				"Next..",
				new BABYLON.Vector2(0.8,0.8)); 

			createHoloSlate(scene, 
				"Interaction", 
				"How about clicking on the left cube, with the trigger button, and see what happens.",
				posCenter1, 
				new BABYLON.Vector3(0, 1 * Math.PI, 0),  
				"Next..", 
				new BABYLON.Vector2(0.8,0.8)); 

			createHoloSlate(scene, 
				"Interaction patterns", 
				"They are the methods that can be used to interact with the virtual environment and its objects. Lets try some out", 
				posCenter, 
				new BABYLON.Vector3(0, 1 * Math.PI, 0),				  
				"Next..",
				new BABYLON.Vector2(0.8,0.8));


			resolve(scene);
		};

		assetsManager.onTaskError = function (err)
		{
			reject(err);
		}
	});
}