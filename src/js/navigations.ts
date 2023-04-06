import * as BABYLON from "babylonjs";
import { sceneInfo } from "./scripts";

export const teleportationPatterns = () => 
{
  if(sceneInfo.curScene.navigation)
  {  
    const featuresManager =sceneInfo.defaultXRExperience.baseExperience.featuresManager; 
    featuresManager.disableFeature(BABYLON.WebXRFeatureName.MOVEMENT);
 
    featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable" /* or latest */, 
    {
        xrInput: sceneInfo.defaultXRExperience.input,
        floorMeshes: sceneInfo.curScene.floorMeshes,
        //useMainComponentOnly: true,
        defaultTargetMeshOptions: 
        {
          teleportationFillColor: "#55FF99",
          teleportationBorderColor: "blue"
        }
    });    
  }
}

interface ITeleportationFeatureHack extends BABYLON.IWebXRFeature {
  addSnapPoint: (point: BABYLON.Vector3) => void;
}
export const hotspotPattern = () =>
{
  if (sceneInfo.curScene.hotspots != null && sceneInfo.curScene.hotspots.length > 0) 
  {
    const featuresManager = sceneInfo.defaultXRExperience.baseExperience.featuresManager; 
    featuresManager.disableFeature(BABYLON.WebXRFeatureName.MOVEMENT);
    const move = featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable", {
      xrInput: sceneInfo.defaultXRExperience.input,
      floorMeshes: sceneInfo.curScene.floorMeshes,      
      snapToPositionRadius: 1.2,
      snapPointsOnly: true
    }) as ITeleportationFeatureHack;
    const hotspots = sceneInfo.curScene.hotspots;
    for(let h = 0; h < hotspots.length; h++) 
    {
      move.addSnapPoint(new BABYLON.Vector3(hotspots[h].x, hotspots[h].y, hotspots[h].z));
    }
  }
}

const speed = 0.08;
function setupCameraForCollisions(camera: BABYLON.WebXRCamera) 
{
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
}

interface IMovementFeatureHack extends BABYLON.IWebXRFeature {
  movementDirection: any;
}
export const locomotionPattern = () =>
{
  if(sceneInfo.curScene.navigation)
  {  
    setupCameraForCollisions(sceneInfo.defaultXRExperience.input.xrCamera);

    const featuresManager = sceneInfo.defaultXRExperience.baseExperience.featuresManager;
    featuresManager.disableFeature(BABYLON.WebXRFeatureName.TELEPORTATION);
    
    const triangle = BABYLON.Mesh.CreateCylinder('triangle', 1, 1, 1, 3, 4, sceneInfo.curScene);
    const triangleMaterial = new BABYLON.StandardMaterial('triangle-mat', sceneInfo.curScene);
    triangleMaterial.emissiveColor = BABYLON.Color3.Red();
    triangleMaterial.specularColor = BABYLON.Color3.Black();
    triangle.material = triangleMaterial;
    triangle.isVisible = false;

    const movementFeature = featuresManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, 'latest', {
      xrInput: sceneInfo.defaultXRExperience.input,
      // add options here
      movementOrientationFollowsViewerPose: true, // default true
      movementSpeed: speed,
      rotationSpeed: 0.5
    }) as IMovementFeatureHack;

    sceneInfo.defaultXRExperience.baseExperience.onStateChangedObservable.add((webXRState) => {
      switch(webXRState) 
      {
          case BABYLON.WebXRState.ENTERING_XR:
          case BABYLON.WebXRState.IN_XR:
              triangle.isVisible = false; //can be changed to true to see directional triangle in XR mode
              break;
          default:
              triangle.isVisible = false;
              break;
      }
    });
  
    sceneInfo.defaultXRExperience.baseExperience.sessionManager.onXRFrameObservable.add(() => {
        if (sceneInfo.defaultXRExperience.baseExperience.state === BABYLON.WebXRState.IN_XR) {
          if (movementFeature.movementDirection !== null) {
            triangle.rotation.y = (0.5 + movementFeature.movementDirection.toEulerAngles().y);
            triangle.position.set(sceneInfo.defaultXRExperience.input.xrCamera.position.x, 0.5, sceneInfo.defaultXRExperience.input.xrCamera.position.z);
          }
        }
    });
    
  }
}



