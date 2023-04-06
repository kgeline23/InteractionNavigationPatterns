import * as BABYLON from "babylonjs";
import { LoadEntity } from "../js/scripts";
import { ICustomScene } from "../js/interfaces";

export const createMultiOfficeScene = async function(engine: BABYLON.Engine, canvas: HTMLCanvasElement)
{
	return new Promise<BABYLON.Scene>((resolve, reject) => 
	{
		let scene = new BABYLON.Scene(engine) as ICustomScene;	
		// camera
		const camera = new BABYLON.ArcRotateCamera("Camera", -2.9, 0.86, 8, new BABYLON.Vector3(0, 0, 4.5), scene);
		camera.attachControl(canvas, true);
		const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);
		scene.navigation = true; //this will differentiate between free moving or stationary scenes for navigation
		
		const assetsManager = new BABYLON.AssetsManager(scene);
		let myMesh: BABYLON.AbstractMesh[] = [];
		//loadEntitiy definition in js/script.js
		LoadEntity("multioffice", "", "./assets/models/", "multiofficeScene.glb", assetsManager, myMesh);
		
		assetsManager.load();
		scene.floorMeshes = myMesh;

		assetsManager.onFinish = function (tasks) 
		{
			//room scaling and positioning
			let sky = scene.getNodeByName("sky");
			if (sky)		
				sky.setEnabled(false);
			const ground = scene.getNodeByName("ground") as BABYLON.AbstractMesh;
			if (ground)
				scene.floorMeshes = [ground];
			resolve(scene);
		};	
		
		assetsManager.onTaskError = function (err) {
			reject(err);
		}
	});
}