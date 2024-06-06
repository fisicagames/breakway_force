import { CreateBox, Scene, Vector3 } from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";

export class Sky {
    private _scene: Scene;
    constructor(scene: Scene) {
        this._scene = scene;
        this.createBox();
    }
    private createBox() {      
        const skyMaterial = new SkyMaterial("skyMaterial", this._scene);
        skyMaterial.backFaceCulling = false;
        const skyboxMaterial = new SkyMaterial("skyMaterial", this._scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.inclination = -0.47;
        skyboxMaterial.luminance = 0.6;
        skyboxMaterial.turbidity = 0.8;
        skyboxMaterial.cameraOffset.y = 200;
        
        const skybox = CreateBox("skyBox", { size: 1200 }, this._scene);
        skybox.material = skyboxMaterial;
    }
}

