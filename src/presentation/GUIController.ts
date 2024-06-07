import { AdvancedDynamicTexture, Rectangle, Button, TextBlock } from "@babylonjs/gui";

export class GUIController {
    private _advancedTexture: AdvancedDynamicTexture;
    private _rectangleMenu: Rectangle;
    private _buttonMenuStart: Button;
    private _textblockLevel: TextBlock;
    
    constructor(advancedTexture: AdvancedDynamicTexture){
        this._advancedTexture = advancedTexture;
        this._guiSetup();
        this._guiButtonsSetup();

    }

    private _guiSetup() {
        this._rectangleMenu = this._advancedTexture.getControlByName("RectangleMenu") as Rectangle;
        this._rectangleMenu.isVisible = true;
        this._buttonMenuStart = this._advancedTexture.getControlByName("ButtonMenuStart") as Button;
        this._textblockLevel = this._advancedTexture.getControlByName("TextblockLevel") as TextBlock;
        this._textblockLevel.isVisible = false;
        this._textblockLevel = this._advancedTexture.getControlByName("TextblockLevel") as TextBlock;
        this._textblockLevel.isVisible = false;

    }
    private _guiButtonsSetup(){
        this._buttonMenuStart.onPointerUpObservable.add(() => {
            this._rectangleMenu.isVisible = false;
            this._textblockLevel.isVisible = true;

        });
    }
}
