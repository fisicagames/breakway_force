import { AdvancedDynamicTexture } from "@babylonjs/gui";

export class GUIController {
    private _advancedTexture: AdvancedDynamicTexture;
    
    constructor(advancedTexture: AdvancedDynamicTexture){
        this._advancedTexture = advancedTexture;
    }
}
