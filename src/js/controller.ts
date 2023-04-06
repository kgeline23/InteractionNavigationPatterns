// const resultRay = new BABYLON.Ray();

// // get the pointer direction ray
// xrInputSource.getWorldPointerRayToRef(resultRay);
// // try to get the grip direction ray; If it's not available, it'll automatically fallback to the pointer direction ray:
// xrInputSource.getWorldPointerRayToRef(resultRay, true);

// // async, async, async
// xrInput.onControllerAddedObservable.add((inputSource) => {
//     inputSource.onMotionControllerInitObservable.add((motionController) => {
//       motionController.onMeshLoadedObservable.add((model) => {});
//     });
//   });
  
//   // a little cleaner
//   xrInput.onControllerAddedObservable.add((inputSource) => {
//     inputSource.onModelLoadedObservable.add((model) => {});
//   });

//   const ids = motionController.getComponentIds();
//   // ids = ["a-button", "b-button", "xr-standard-trigger", .....]

// const triggerComponent = motionController.getComponent("xr-standard-trigger");
// if (triggerComponent) {
//   // found, do something with it.
// }

// const squeezeComponent = motionController.getComponentOfType("squeeze");

// // get the first registered button component
// const buttonComponent = motionController.getComponentOfType("button");

// // get all button components
// const buttonComponents = motionController.getAllComponentsOfType("button");
// if (buttonComponents.length) {
//   // some were found
// }

// const mainComponent = motionController.getMainComponent();
// // mainComponent always exists!


// component.onButtonStateChangedObservable.add((component) => {
//     // something changed, check the changes object
// if (component.isButton()) {
//   // we have a value
// }
// if (component.isAxes()) {
//   // we have axes data
// }

// let value = component.value;
// if (value > 0.8) {
//   // do something nice with this value
// }
// if (component.pressed) {
//   // the component is pressed, meaning value === 1
// }

// if (component.touched) {
//   // fingers are on the component, might be half-pressed or moved
// }

// let axes = component.axes;
// if (axes.x > 0.8) {
// // do something nice with the x-axis value
// }

// // maybe nothing happened between this and last frame
// if (!component.hasChanges) {
//   return;
// }
// let changes = component.changes;
// if (changes.pressed) {
//   // pressed state changed
//   const isPressedNow = changes.pressed.current;
//   const wasPressedInLastFrame = changes.pressed.previous;
// }
// if (changes.value) {
//   // value changed! let's get the delta
//   const delta = changes.value.current - changes.value.previous;
// }
//   });
  
//   component.onAxisValueChangedObservable.add((values) => {
//     console.log(values.x, values.y);
//   });
