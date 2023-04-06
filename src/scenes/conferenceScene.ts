import { LoadEntity, CreateScene, getHotspots, setSceneCamera, getMesh} from "../js/scripts";
import { addPositionBehavior, createHoloSlate, createHoloSlateImage, createMainMenu } from "../js/interactions";
import * as BABYLON from "babylonjs";
import * as BABYLONGUI from "babylonjs-gui";
import { ICustomScene } from "../js/interfaces";
import { AbstractMesh, Color3, ExecuteCodeAction, StandardMaterial } from "babylonjs";

export const createConferenceScene = async function(engine: BABYLON.Engine, canvas: HTMLCanvasElement)
{
	return new Promise<BABYLON.Scene>((resolve, reject) => {
		const nav = true; //navigation is possible, navigation = true
		let scene = CreateScene(engine, nav) as ICustomScene; //CreateScene found in scrips.js 
		scene.navigation = nav;
		scene.collisionsEnabled = true;

		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh: BABYLON.AbstractMesh[] = [];
		//loadEntitiy definition in js/script.js
		LoadEntity("conference", "", "./assets/models/", "conferenceScene.glb", assetsManager, myMesh);
		assetsManager.load();

		assetsManager.onFinish = function (tasks)
		{
			//hotspot positions
			scene.hotspots = getHotspots(scene);

			var ground = getMesh(scene, "ground", 0);
			ground.isVisible = true;
			scene.floorMeshes = [ground];
		
			//setting camera for scene
			setSceneCamera(scene);

			scene.menu = scene.getNodeByName("menu") as AbstractMesh;
			scene.menuScale = new BABYLON.Vector3(0.11, 0.11, 0.11);
			scene.menuRotation = new BABYLON.Vector3(0, 0 , 0);	
			createMainMenu(scene); //creates hologram menu for changing scenes and navigation type

			const tablet = getMesh(scene, "tablet", 1) as AbstractMesh;
			tablet!.checkCollisions = true;
			if (tablet)
			{				
				addPositionBehavior(tablet);
			};

			const laptop = getMesh(scene, "laptop", 1) as AbstractMesh
			laptop!.checkCollisions = true;
			if (laptop)
			{				
				addPositionBehavior(laptop);
			};

			const tableTop = getMesh(scene, "tableTop") as AbstractMesh
			tableTop!.checkCollisions = true;
			tableTop!.visibility = 0;
			if (tableTop)
			{				
				addPositionBehavior(tableTop);
			};

			//const walls = getMesh(scene, "walls", 0);
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
				element.visibility = 0;
			});	


			
			const posSlate = (scene.getNodeByName("posSlate") as BABYLON.AbstractMesh).getAbsolutePosition();
			if (posSlate)
			{
				//const slateScreen : BABYLONGUI.HolographicSlate = 
				createHoloSlate(
					scene, 
					"Exiting VR",
					"To exit the VR environment, come back to the menu and select Exit VR. Please fill out the questionnaire that is linked below the scene after exiting :)",  
					posSlate,
					new BABYLON.Vector3(0, 0, 0),
					"Ok");
				createHoloSlateImage(
					scene, 
					"While pushing the joystick forward, point the ray emmited from the controller onto a spot on the ground. For the Hotspot pattern, designated areas are marked with the black squares. The patterns can be changed by selecting them from the menu.", 
					new BABYLONGUI.Image("joy", "../assets/img/controllerJoystick.png"), 
					posSlate,
					new BABYLON.Vector3(0, 0, 0),
					"Got it!");
				createHoloSlate(
					scene, 
					"Navigation patterns", 
					"In hotspots you can only move to the designated areas on the ground, whereas with Teleportation all areas on the ground can be moved to.", 
					posSlate,
					new BABYLON.Vector3(0, 0, 0),
					"Next...",
					new BABYLON.Vector2(0.5, 0.5));
				createHoloSlate(
					scene, 
					"Your meeting room", 
					"Welcome. In the previous scene the stationary locomotion was used to navigate. Now you can try out two other navigation patterns: Hotspot and Teleportation.", 
					posSlate,
					new BABYLON.Vector3(0, 0, 0),
					"Next...",
					new BABYLON.Vector2(0.5, 0.5));
			}
			
			resolve(scene);
		};

		assetsManager.onTaskError = function (err) {
			reject(err);
		}
	});
}
