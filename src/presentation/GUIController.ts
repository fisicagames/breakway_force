import { AdvancedDynamicTexture, Rectangle, Button, TextBlock } from "@babylonjs/gui";
import { IGUIController } from "./interfaces/IGUIController";


export class GUIController implements IGUIController {
    private _advancedTexture: AdvancedDynamicTexture;
    private _rectangleMenu: Rectangle;
    private _buttonMenuStart: Button;
    private _textblockLevel: TextBlock;
    private _buttonRight: Button;
    private _buttonLeft: Button;
    public buttonLeftIsDown: boolean;
    public buttonRightIsDown: boolean;
    
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
        this._buttonLeft = this._advancedTexture.getControlByName("ButtonLeft") as Button;
        this._buttonRight = this._advancedTexture.getControlByName("ButtonRight") as Button;

    }
    private _guiButtonsSetup(){
        this._buttonMenuStart.onPointerUpObservable.add(() => {
            this._rectangleMenu.isVisible = false;
            this._textblockLevel.isVisible = true;

        });
        this._buttonLeft.onPointerDownObservable.add(()=>{
            this.buttonLeftIsDown = true;
        });
        this._buttonLeft.onPointerUpObservable.add(()=>{
            this.buttonLeftIsDown = false;

        });
        this._buttonRight.onPointerDownObservable.add(()=>{
            this.buttonRightIsDown = true;
        });
        this._buttonRight.onPointerUpObservable.add(()=>{
            this.buttonRightIsDown = false;

        });
    }
}
