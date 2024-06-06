import { CreateBox, Scene } from "@babylonjs/core";
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
        skyboxMaterial.inclination = -0.5;
        skyboxMaterial.luminance = 0.1;
        skyboxMaterial.turbidity = 1.2;
        skyboxMaterial.cameraOffset.y = 50;
        const skybox = CreateBox("skyBox", { size: 1200 }, this._scene);
        skybox.material = skyboxMaterial;
    }
}

