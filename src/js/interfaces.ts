import { AbstractMesh, Scene, StandardMaterial, Vector3, WebXRCamera, WebXRDefaultExperience } from "babylonjs";
import { AdvancedDynamicTexture, GUI3DManager } from "babylonjs-gui";

export interface ICustomScene extends Scene {
    camera?: WebXRCamera;
    navigation?: boolean;
    floorMeshes?: AbstractMesh[];
    menu?: AbstractMesh;
    menuScale?: Vector3;
    menuRotation?: Vector3;
    hotspots?: Vector3[];
    meshMaterial?: StandardMaterial;
    guiManager?: GUI3DManager;
}

export interface ISceneInfo {
    curScene?: ICustomScene;
    advancedTexture?: AdvancedDynamicTexture,
    sceneConference?: ICustomScene,
    sceneOffice?: ICustomScene,    
    sceneOpen?: ICustomScene,
    defaultXRExperience?: WebXRDefaultExperience,
}