import { AdvancedDynamicTexture, Rectangle, Button, TextBlock } from "@babylonjs/gui";
import { ITouchJoystick } from "./interfaces/ITouchJoystick";
import { IGameController } from "../application/GameController";

export interface IGUIController{
    endGame();
}
export class GUIController implements ITouchJoystick,IGUIController {
 


    public buttonLeftIsDown: boolean;
    public buttonRightIsDown: boolean;
 
    private _advancedTexture: AdvancedDynamicTexture;
    private _rectangleMenu: Rectangle;
    private _buttonMenuStart: Button;
    private _textblockLevel: TextBlock;
    private _buttonRight: Button;
    private _buttonLeft: Button;
    private _buttonMenu: Button;
    private _rectangleGameContinue: Rectangle;
    private _rectangleTouch: Rectangle;
    private _rectangleTop: Rectangle;

    public endGame(){
        this._rectangleGameContinue.isVisible = true;
    }
    
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
        this._buttonMenu = this._advancedTexture.getControlByName("ButtonMenu") as Button;
        this._buttonMenu.isVisible = false;
        this._rectangleGameContinue = this._advancedTexture.getControlByName("RectangleGame") as Rectangle;
        this._rectangleGameContinue.isVisible = false;
        this._rectangleTouch = this._advancedTexture.getControlByName("RectangleTouch") as Rectangle;
        this._rectangleTouch.isVisible = false;
        this._rectangleTop = this._advancedTexture.getControlByName("RectangleTop") as Rectangle;
        this._rectangleTop.isVisible = false;
        
    }
    private _guiButtonsSetup(){
        this._buttonMenuStart.onPointerUpObservable.add(() => {
            this._rectangleMenu.isVisible = false;
            this._textblockLevel.isVisible = true;
            this._rectangleTouch.isVisible = true;
            this._rectangleTop.isVisible = true;
            this._buttonMenu.isVisible = true;


        });

        this._buttonMenu.onPointerUpObservable.add(() => {
            this._rectangleMenu.isVisible = true;
            this._textblockLevel.isVisible = false;
            this._rectangleGameContinue.isVisible = false;

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
