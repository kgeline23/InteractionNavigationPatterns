import * as BABYLON from "babylonjs";
import * as BABYLONGUI from "babylonjs-gui";
import {sceneInfo, createGUI} from "./scripts";
import { teleportationPatterns, hotspotPattern, locomotionPattern } from "./navigations";
import { ICustomScene } from "./interfaces";

export const createMainMenu = (scene: ICustomScene) =>
{
    if (!scene.menu) 
        return;
        
    // manager.useRealisticScaling = true;
    // Create Near Menu with Touch Holographic Buttons + behaviour
    var nearMenu = new BABYLONGUI.NearMenu("NearMenu");
    if(scene.navigation)
    {
        nearMenu.rows = 3;
    }
    else nearMenu.rows = 2;
    scene.guiManager!.addControl(nearMenu);
    nearMenu.scaling = scene.menuScale as BABYLON.Vector3;
    nearMenu.mesh!.rotation = scene.menuRotation as BABYLON.Vector3;
    nearMenu.isPinned = true;
    nearMenu.position = scene.menu.getAbsolutePosition();

    addMainMenuButtons(nearMenu, scene.navigation as boolean);
}

let handClicked= false;
let navigation = false;
const addMainMenuButtons = function(menu: BABYLONGUI.NearMenu, nav: boolean) {
    navigation = nav;
    var btnConferenceScene  = new BABYLONGUI.TouchHolographicButton();
    var btnOpenScene        = new BABYLONGUI.TouchHolographicButton();
    var btnOfficeScene      = new BABYLONGUI.TouchHolographicButton();
    var btnHotspot          = new BABYLONGUI.TouchHolographicButton();
    var btnTele             = new BABYLONGUI.TouchHolographicButton();
    var btnLoco             = new BABYLONGUI.TouchHolographicButton();
    var btnExit             = new BABYLONGUI.TouchHolographicButton();

    //sceen buttons
    menu.addButton(btnConferenceScene);
    menu.addButton(btnOpenScene);
    menu.addButton(btnOfficeScene);

    //navigation buttons, some scenes are stationary  = no navigation
    if(nav)
    {
        menu.addButton(btnHotspot);
        menu.addButton(btnTele);
        //menu.addButton(btnLoco);
    }
    menu.addButton(btnExit);

    const conTxt = new BABYLONGUI.TextBlock();
    conTxt.text = "Conference";
    conTxt.fontSize = 30;
    conTxt.color = "white";
    btnConferenceScene.content = conTxt;

    const openTxt = new BABYLONGUI.TextBlock();
    openTxt.text = "Open";
    openTxt.fontSize = 30;
    openTxt.color = "white";
    btnOpenScene.content = openTxt;

    const offTxt = new BABYLONGUI.TextBlock();
    offTxt.text = "Office";
    offTxt.fontSize = 30;
    offTxt.color = "white";
    btnOfficeScene.content = offTxt;

    const hotTxt = new BABYLONGUI.TextBlock();
    hotTxt.text = "Hotspot";
    hotTxt.fontSize = 30;
    hotTxt.color = "white";
    btnHotspot.content = hotTxt;

    const teleTxt = new BABYLONGUI.TextBlock();
    teleTxt.text = "Teleportation";
    teleTxt.fontSize = 30;
    teleTxt.color = "white";
    btnTele.content = teleTxt;

    const locoTxt = new BABYLONGUI.TextBlock();
    locoTxt.text = "Locomotion";
    locoTxt.fontSize = 30;
    locoTxt.color = "white";
    btnLoco.content = locoTxt;

    const exitTxt = new BABYLONGUI.TextBlock();
    exitTxt.text = "Exit VR";
    exitTxt.fontSize = 30;
    exitTxt.color = "white";
    btnExit.content = exitTxt;

    btnOpenScene.onPointerDownObservable.add(async () =>
    {
        //change current scene to Open
        if (sceneInfo.curScene !== sceneInfo.sceneOpen)
        {
            sceneInfo.curScene = sceneInfo.sceneOpen;
            await sceneInfo.defaultXRExperience.baseExperience.exitXRAsync();
            await createGUI(0);
            //await sceneInfo.defaultXRExperience.baseExperience.enterXRAsync("immersive-vr", "local-floor");
        }
    });
    btnOfficeScene.onPointerDownObservable.add(async () =>
    {
        //change current scene to Office
        if (sceneInfo.curScene !== sceneInfo.sceneOffice)
        {
            sceneInfo.curScene = sceneInfo.sceneOffice;
            await sceneInfo.defaultXRExperience.baseExperience.exitXRAsync();
            await createGUI(1);
            //await sceneInfo.defaultXRExperience.baseExperience.enterXRAsync("immersive-vr", "local-floor");
        }
    });
    btnConferenceScene.onPointerDownObservable.add(async () =>
    {
        //change current scene to conference
        if (sceneInfo.curScene !== sceneInfo.sceneConference)
        {           

            sceneInfo.curScene = sceneInfo.sceneConference;
            await sceneInfo.defaultXRExperience.baseExperience.exitXRAsync();
            await createGUI(2);
            //await sceneInfo.defaultXRExperience.baseExperience.enterXRAsync("immersive-vr", "local-floor");
            hotspotPattern();
        }
    });
    btnHotspot.onPointerDownObservable.add(() =>
    {
        //change navigation to hotspot
        hotspotPattern();
    });
    btnTele.onPointerDownObservable.add(() =>
    {
        //change navigation to teleportation
        teleportationPatterns();
    });
    btnLoco.onPointerDownObservable.add(() =>
    {
        //change navigation to locomotion
        locomotionPattern();
    });
    btnExit.onPointerDownObservable.add(async () =>
    {
        //exit XR and go back to website
        await sceneInfo.defaultXRExperience.baseExperience.exitXRAsync();
    });
    
    // btnHands.onPointerDownObservable.add(()=>
    // {
    //     //change hand tarking
    //     const featureManager = sceneInfo.defaultXRExperience.baseExperience.featuresManager;
    //     if (handClicked)
    //         featureManager.disableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING);
    //     else
    //         enableHandtracking();
    // });
}

// export const rayCasting = function(scene: ICustomScene)
// {
//     const resultRay = new BABYLON.Ray();
//     const xrInputSource = new XRInputSource();
//     const webXrInputSource = new BABYLON.WebXRInputSource(sceneInfo.curScene, xrInputSource);

//     // try to get the grip direction ray; If it's not available, it'll automatically fallback to the pointer direction ray:
//     webXrInputSource.getWorldPointerRayToRef(resultRay, true);

//     let rayHelper = new BABYLON.RayHelper(ray);
//     rayHelper.show(scene);

//     let hit = scene.pickWithRay(ray);

//     if (hit.pickedMesh){
//        hit.pickedMesh.scaling.y += 0.01;
//     }
// };


//add gizmo outlines and transformation of mesh

export const addGizmoBehavior = function(scene: ICustomScene, mesh: BABYLON.AbstractMesh)
{
  // Create utility layer and bounding box gizmo
  var utilLayer = new BABYLON.UtilityLayerRenderer(scene)
  utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;
  var gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#0984e3"), utilLayer)
  gizmo.rotationSphereSize = 0.02;
  gizmo.scaleBoxSize = 0.02;
  // Create behaviors to drag and scale with pointers in VR
  var sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
  mesh.addBehavior(sixDofDragBehavior);
  gizmo.attachedMesh = mesh;
  var multiPointerScaleBehavior = new BABYLON.MultiPointerScaleBehavior();
  mesh.addBehavior(multiPointerScaleBehavior);
  mesh.physicsImpostor!.setScalingUpdated()
}

//color change
export const addColorBehavior = function(scene: ICustomScene, mesh: BABYLON.AbstractMesh) {
        mesh.actionManager = new BABYLON.ActionManager(scene);
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            function(evt)
            {
                scene.meshMaterial!.diffuseColor = BABYLON.Color3.Random();
            }
        ));
}
export const addPositionBehavior = function(mesh: BABYLON.AbstractMesh)
  {
    // // Create behaviors to drag and scale with pointers in VR
    var sixDofDragBehavior = new BABYLON.SixDofDragBehavior()
    mesh.addBehavior(sixDofDragBehavior)
    var multiPointerScaleBehavior = new BABYLON.MultiPointerScaleBehavior()
    mesh.addBehavior(multiPointerScaleBehavior)
}

//moving mesh horizontally
export const addHorizontalBehavior = function(mesh: BABYLON.AbstractMesh) {
    //horizontal movement
    const dragBehavior = new BABYLON.PointerDragBehavior({dragAxis: new BABYLON.Vector3(1,0,0)});
    dragBehavior.useObjectOrientationForDragging = false;
    // Listen to drag events
    dragBehavior.onDragStartObservable.add((event)=>{
        console.log("dragStart");
    });
    dragBehavior.onDragObservable.add((event)=>{
        //console.log("drag");
    });
    dragBehavior.onDragEndObservable.add((event)=>{
        console.log("dragEnd");
    });

	mesh.addBehavior(dragBehavior);
}

export const createHoloSlate = function(scene: BABYLON.Scene, title: string, content: string, position: BABYLON.Vector3, rotation: BABYLON.Vector3, buttonText: string, size?: BABYLON.Vector2)
{
    const manager = new BABYLONGUI.GUI3DManager(scene);
    
    // This section shows how to use a HolographicSlate as a dialog box
    var slate = new BABYLONGUI.HolographicSlate("slate");
    
    slate.titleBarHeight = 0; // Hides default slate controls and title bar
    manager.addControl(slate);
    if (size)
    {
        slate.minDimensions = size;
        slate.dimensions = size;
    }
    else
    {        
        slate.minDimensions = new BABYLON.Vector2(0.5, 0.5);
        slate.dimensions = new BABYLON.Vector2(0.5, 0.5);
    }
    slate._gizmo._rootMesh.setEnabled(false);
    slate.position = position
    slate.mesh!.rotation = rotation;
    
    var contentGrid = new BABYLONGUI.Grid("grid");
    var titles = new BABYLONGUI.TextBlock("title");
    var text = new BABYLONGUI.TextBlock("text");
    
    titles.height = 0.2;
    titles.color = "white";
    titles.textWrapping = BABYLONGUI.TextWrapping.WordWrap;
    titles.setPadding("5%", "5%", "5%", "5%");
    titles.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
    titles.text = title
    titles.fontWeight = "bold";

    text.height = 0.8;
    text.color = "white";
    text.textWrapping = BABYLONGUI.TextWrapping.WordWrap;
    text.setPadding("5%", "5%", "5%", "5%");
    text.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
    text.text = content;
    
    if (buttonText)
    {        
        var button = BABYLONGUI.Button.CreateSimpleButton("btn", buttonText);
        button.height = 0.1;
        button.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        button.textBlock!.color = "white";
        button.onPointerUpObservable.add(()=>{
            slate.dispose();
        });
        contentGrid.addControl(button);
    }

    contentGrid.addControl(titles);
    contentGrid.addControl(text);
    contentGrid.background = "#000080";
    slate.content = contentGrid;
    return slate;
}

export const createHoloSlateImage = function(scene: BABYLON.Scene, content: string, img: BABYLONGUI.Image, position: BABYLON.Vector3, rotation: BABYLON.Vector3, buttonText?: string)
{
    // This creates a GUI3DManager for 3D controls
    var manager = new BABYLONGUI.GUI3DManager(scene);

    var slate = new BABYLONGUI.HolographicSlate("slate");
    
    slate.titleBarHeight = 0; // Hides default slate controls and title bar
    manager.addControl(slate);
    slate.minDimensions = new BABYLON.Vector2(0.5, 0.5);
    slate.dimensions = new BABYLON.Vector2(0.5, 0.5);    slate.position = position;
    slate.mesh!.rotation = rotation;
    slate._gizmo._rootMesh.setEnabled(false);

    var contentGrid = new BABYLONGUI.Grid("grid");
    var text = new BABYLONGUI.TextBlock("text");

    img.width = 0.8;
    img.height = 0.8;
    img.setPaddingInPixels(100, 100, 80, 100);
    img.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    img.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    text.height = 0.4;
    text.color = "white";
    text.textWrapping = BABYLONGUI.TextWrapping.WordWrap;
    text.setPadding("5%", "5%", "5%", "5%");
    text.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
    text.text = content;

    if (buttonText)
    {        
        var button = BABYLONGUI.Button.CreateSimpleButton("btn", buttonText);
        button.height = 0.1;
        button.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        button.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        button.textBlock!.color = "white";
        button.onPointerUpObservable.add(()=>{
            slate.dispose();
        });
        contentGrid.addControl(button);
    }

    contentGrid.addControl(img);
    contentGrid.addControl(text);
    contentGrid.background = "#000080";
    slate.content = contentGrid;
}

export const createHoloButton = function(scene: BABYLON.Scene, text: string, position: BABYLON.Vector3, scaling: BABYLON.Vector3, rotation?: BABYLON.Vector3)
{
    var manager = new BABYLONGUI.GUI3DManager(scene);
    // Text only button
    var button = new BABYLONGUI.TouchHolographicButton("TouchHoloTextButton");
    manager.addControl(button);
    button.position = position;
    button.mesh.scaling = scaling;
    const txt = new BABYLONGUI.TextBlock;
    txt.text = text;
    txt.color = "white";
    txt.fontSize = 40;
    button.content = txt;  
    if(rotation)
    {
        button.mesh.rotation = rotation;    
    }

    return button;
}

export const create3DButton = function(scene: BABYLON.Scene, text: string, position: BABYLON.Vector3, scaling: BABYLON.Vector3, rotation?: BABYLON.Vector3)
{
    var manager = new BABYLONGUI.GUI3DManager(scene);
    // Text only button
    var button = new BABYLONGUI.Button3D("TouchHoloTextButton");
    manager.addControl(button);
    button.position = position;
    button.scaling = scaling;
    const txt = new BABYLONGUI.TextBlock;
    txt.text = text;
    txt.color = "white";
    txt.fontSize = 12;
    button.content = txt;  
    if(rotation)
    {
        button.mesh.rotation = rotation;    
    }

    return button;
}
// export const enableHandtracking = function()
// {
//     const xr = sceneInfo.defaultXRExperience;
//     const featureManager = xr.baseExperience.featuresManager;

//     const xrHandsFeature = featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
//         xrInput: xr.input,
//         jointMeshes: {
//             disableDefaultHandMesh: true,
//             enablePhysics: true,
//         },
//         physicsProps: {
//         impostorType: BABYLON.PhysicsImpostor.BoxImpostor,
//         friction: 0.5,
//         restitution: 0.3,
//         },
//     });
//     xrHandsFeature.onHandAddedObservable.add((newHand) => {
//         // celebrate, we have a new hand!
//         scene.onBeforeRenderObservable.add(() => {
//           // get the real world wrist position on each frame
//           console.log(newHand.trackedMeshes[0].position);
//         });
//     });

//     sceneInfo.curScene.onPointerObservable.add((evt) => {
//         const pointerId = evt.event.pointerId;
//         const xrController = xr.pointerSelection.getXRControllerByPointerId(pointerId);
//         const xrHandsObject = xrHandsFeature.getHandByControllerId(xrController.uniqueId);
//       });
// }