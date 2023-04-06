import * as BABYLON from "babylonjs";
import { LoadEntity, CreateScene, setSceneCamera, getMesh, sceneInfo, createGUI } from "../js/scripts";
import { createMainMenu, createHoloSlate, addGizmoBehavior, createHoloButton } from "../js/interactions";
import { hotspotPattern } from "../js/navigations";
import { AbstractMesh } from "babylonjs";

export const createOfficeScene = async function(engine: BABYLON.Engine, canvas: HTMLCanvasElement) 
{	
	return new Promise<BABYLON.Scene>((resolve, reject) => 
	{
		const nav = false;
		let scene = CreateScene(engine, nav); //this scene is a fixed scene, navigation = false

		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh:BABYLON.AbstractMesh[] = [];
		
		LoadEntity("office", "", "./assets/models/", "officeScene.glb", assetsManager, myMesh); //loadEntitiy definition in js/script.js
		assetsManager.load();
		assetsManager.onFinish = function (tasks) 
		{	
			setSceneCamera(scene);
			scene.camera.checkCollisions = false;

			scene.menu = scene.getNodeByName("menu") as BABYLON.AbstractMesh;
			scene.menuScale = new BABYLON.Vector3(0.055, 0.055, 0.055);
			scene.menuRotation = new BABYLON.Vector3(0, 0 * Math.PI, 0);
			createMainMenu(scene);

			//room scaling and positioning
			let sky = scene.getNodeByName("sky");
			if (sky)		
				sky.setEnabled(false);
				
			//get floor/ground needed for navigation
			const ground = getMesh(scene, "ground")// scene.getNodeByName("ground") as BABYLON.AbstractMesh;
			if (ground)	
				scene.floorMeshes = [ground];
			else console.log("no ground found");

			const pos = scene.getNodeByName("position") as AbstractMesh;
			pos!.visibility = 0;

			//transformation of cube
			const choco = getMesh(scene, "chocolate", 0);
			if (choco)
			{				
				choco.checkCollisions = true;
				addGizmoBehavior(scene, choco); //transform behavior
			};

			const posSlate = (scene.getNodeByName("posSlate") as BABYLON.AbstractMesh).getAbsolutePosition();
			if (posSlate)
			{
				//const slateScreen : BABYLONGUI.HolographicSlate = 
				createHoloSlate(
					scene, 
					"This is your office", 
					"Looks like its time for your meeting. On your left is your calendar, click the button to go to your meeting room", 
					posSlate,
					new BABYLON.Vector3(0,0,0),
					"Alright!",
					new BABYLON.Vector2(0.45, 0.25));
			}
			
			const posCalendar = (scene.getNodeByName("posCalendar") as BABYLON.AbstractMesh).getAbsolutePosition();
			if (posCalendar)
			{
				const meetingButton = createHoloButton(
					scene, 
					"Join meeting", 
					posCalendar,
					new BABYLON.Vector3(0.07, 0.07, 0.02),
					new BABYLON.Vector3(0.14 * Math.PI, -0.08 * Math.PI, 0)
				) 	
				//add funtion to button click
				meetingButton.onPointerDownObservable.add(async () =>
				{
					//change current scene to conference
					if (sceneInfo.curScene !== sceneInfo.sceneConference)
					{
						sceneInfo.curScene = sceneInfo.sceneConference;
						await sceneInfo.defaultXRExperience.baseExperience.exitXRAsync();
						await createGUI(2);
						await sceneInfo.defaultXRExperience.baseExperience.enterXRAsync("immersive-vr", "local-floor");
						hotspotPattern();						
					}
				});	
			}

			resolve(scene);
		};

		assetsManager.onTaskError = function (err) {
			reject(err);
		}
	});
}