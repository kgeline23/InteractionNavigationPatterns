//Imports for Babylon and scenes
import { Engine, Scene } from "babylonjs";
import { sceneInfo, createGUI} from "./scripts";
import { createOpenScene } from "../scenes/openScene";
import { createConferenceScene } from "../scenes/conferenceScene";
import { createOfficeScene } from "../scenes/officeScene";

import * as CANNON from "cannon-es";

//import { createSelfOfficeScene, createSelfConferenceScene } from "../scenes/selfbuiltScene.js"; //TODO: remove

//import "./controller.js";
window.CANNON = CANNON;

//Loading WebXR scene
const main = async () => {
    const canvas = document.getElementById("sceneCanvas") as HTMLCanvasElement;      //get the canvas element
    const engine = new Engine(canvas, true);            //generates the babylon 3D engine
    
    // Display errors on page
    const errorDiv = document.createElement("div");
    errorDiv.style.color = "#C33";
    document.querySelector(".sceneCanvas").after(errorDiv);

    const showError = (error:string, url:string, line:number) => {
        let errorBox = document.createElement("div");
        let errorMes = document.createElement("h3");
        errorMes.innerText = error;
        let errorLin = document.createElement("span");
        errorLin.innerText = "Line " + line.toString() + " in " + url;
        const hr = document.createElement("hr");
    
        errorBox.appendChild(errorMes);
        errorBox.appendChild(errorLin);
        errorBox.appendChild(hr);
    
        errorDiv.appendChild(errorBox);
    };
    
    window.onerror = function(error, url, line) {
        showError(error as string, url, line);
    };

    //get scenes asynchronously 
    const result = await Promise.allSettled([
        createConferenceScene(engine, canvas),
        createOfficeScene(engine, canvas),
        createOpenScene(engine, canvas)
    ]);

    //check if errors occured 
    result.forEach((promise) => {
        if (promise.status === "rejected") {
            showError(promise.reason.message, promise.reason.fileName, promise.reason.lineNumber);
            throw new Error(promise.reason);
        }
    });
    const successes = result
      .filter((x): x is PromiseFulfilledResult<Scene> => x.status === "fulfilled")
      .map(x => x.value)

    sceneInfo.sceneConference     = successes[0]; 
    sceneInfo.sceneOffice         = successes[1]; 
    sceneInfo.sceneOpen           = successes[2];
    sceneInfo.curScene            = sceneInfo.sceneOpen;
	
    createGUI();
    
    //disable scrolling on webpage when curser on canvas
    if (canvas)
        canvas.addEventListener('wheel', (e) => {e.preventDefault()}, false);
    else console.log("No canvas found");
    engine.runRenderLoop(function()
    {
        sceneInfo.curScene.render();
    });

    window.addEventListener("resize", function()
    {
        engine.resize();                            
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
})