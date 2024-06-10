import { CreateBox, Scene, Vector3 } from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";

export class Sky {
    private _scene: Scene;
    private _skyboxMaterial: SkyMaterial;

    constructor(scene: Scene) {
        this._scene = scene;
        this.createBox();
    }
    private createBox() {      
        const skyMaterial = new SkyMaterial("skyMaterial", this._scene);
        skyMaterial.backFaceCulling = false;
        this._skyboxMaterial = new SkyMaterial("skyMaterial", this._scene);
        this._skyboxMaterial.backFaceCulling = false;
        this._skyboxMaterial.inclination = -0.495;
        this._skyboxMaterial.azimuth = 0.24;
        this._skyboxMaterial.luminance = 0.6;
        this._skyboxMaterial.turbidity = 0.8;
        this._skyboxMaterial.cameraOffset.y = 240;
        
        const skybox = CreateBox("skyBox", { size: 1200 }, this._scene);
        skybox.material = this._skyboxMaterial;
        skybox.infiniteDistance = true;
    }    
}

