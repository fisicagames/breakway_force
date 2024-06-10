import { AdvancedDynamicTexture, Rectangle, Button, TextBlock } from "@babylonjs/gui";
import { IObjectsController } from "../application/interfaces/IObjectsController";
import { SoundLoader } from "../infrastructure/scene/SoundLoader";

export interface IGUIController {
    endGame();
    updateGUI();
    buttonLeftIsDown: boolean;
    buttonRightIsDown: boolean;
}
export class GUIController implements IGUIController {


    private _objectsController: IObjectsController;

    public buttonLeftIsDown: boolean;
    public buttonRightIsDown: boolean;

    private _advancedTexture: AdvancedDynamicTexture;
    private _rectangleMenu: Rectangle;
    private _buttonMenuStart: Button;
    private _textblockLevel: TextBlock;
    private _buttonRight: Button;
    private _buttonLeft: Button;
    private _buttonMenu: Button;
    private _rectangleGame: Rectangle;
    private _rectangleTouch: Rectangle;
    private _rectangleTop: Rectangle;
    private _soundTrack: SoundLoader;
    private _allSounds: SoundLoader[] = [];
    private _textblockMenuMusic: TextBlock;
    private _buttonMenuContinuar: Button;
    private _rectangleGameContinue: Rectangle;
    private _textblockScoreGame: TextBlock;
    private _textblockTotalScore: TextBlock;
    private _highScore: number = 0;
    private _textblockMenuBest: TextBlock;
    private _textblockAngle: TextBlock;
    private _textBlockEquation: TextBlock;
    
    

    public endGame() {
        this._textblockScoreGame.text = `Pontos: ${this._objectsController.maxDistanceX.toFixed(0)}`
        if( this._highScore < this._objectsController.maxDistanceX){
            this._highScore  = this._objectsController.maxDistanceX;
        }
        this._textblockTotalScore.text = `Recorde: ${this._highScore.toFixed(0)}`;
        this._textblockMenuBest.text = `${this._highScore.toFixed(0)}`;
        this._rectangleGame.isVisible = true;


    }
    public setObjectsController(objectsController: IObjectsController): void {
        this._objectsController = objectsController;
    }

    constructor(advancedTexture: AdvancedDynamicTexture) {
        this._advancedTexture = advancedTexture;
        this._guiSetup();
        this._guiButtonsSetup();
        this._soundTrack = new SoundLoader(this._advancedTexture.getScene(),
            "soundBoatEngine", "./assets/sounds/big-band-show-146321.mp3", true);
        this._allSounds.push(this._soundTrack);
    }
    public updateGUI() {
        this._textblockLevel.text = `Pontos: ${this._objectsController.maxDistanceX.toFixed(0)}`;        
        this._textBlockEquation.text = `μₑ = ${this._objectsController.boxStaticFriction.toFixed(2)} (${(Math.atan(this._objectsController.boxStaticFriction)*180/Math.PI).toFixed(1)}°) e   μ𝒸 = ${this._objectsController.boxFriction.toFixed(2)} (${(Math.atan(this._objectsController.boxFriction)*180/Math.PI).toFixed(1)}°)`
        this._textblockAngle.text =  `𝜃 = ${this._objectsController.angleCurrentPlank.toFixed(1)}°    Coeficiente de restituição: ${this._objectsController.boxRestitution.toFixed(2)} `;
    }

    private _guiSetup() {
        this._rectangleGameContinue = this._advancedTexture.getControlByName("RectangleGame") as Rectangle;
        this._rectangleGameContinue.isVisible = false;
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
        this._rectangleGame = this._advancedTexture.getControlByName("RectangleGame") as Rectangle;
        this._rectangleGame.isVisible = false;
        this._rectangleTouch = this._advancedTexture.getControlByName("RectangleTouch") as Rectangle;
        this._rectangleTouch.isVisible = false;
        this._rectangleTop = this._advancedTexture.getControlByName("RectangleTop") as Rectangle;
        this._rectangleTop.isVisible = false;
        this._textblockMenuMusic = this._advancedTexture.getControlByName("TextblockMenuMusic") as TextBlock;
        this._buttonMenuContinuar = this._advancedTexture.getControlByName("ButtonMenuContinuar") as Button;
        this._textblockScoreGame = this._advancedTexture.getControlByName("TextblockScoreGame") as TextBlock;
        this._textblockTotalScore = this._advancedTexture.getControlByName("TextblockTotalScore") as TextBlock;
        this._textblockMenuBest = this._advancedTexture.getControlByName("TextblockMenuBest") as TextBlock;
        this._textblockAngle = this._advancedTexture.getControlByName("TextblockAngle") as TextBlock;
        this._textBlockEquation = this._advancedTexture.getControlByName("TextBlockEquation") as TextBlock;
        
        


    }
    private _guiButtonsSetup() {

        this._buttonMenuContinuar.onPointerUpObservable.add(() => {
            this._rectangleGameContinue.isVisible = false;
            //this._textblockMenuBest.text = `${this._levelMediator.gameData.highScore}`;
            this._objectsController.resetBoxState();
            this._objectsController.resetPlanksOrientation();
        });


        this._textblockMenuMusic.text = "🔊";
        let stateMusic = true;
        this._textblockMenuMusic.onPointerUpObservable.add(() => {
            this._soundTrack.togglePlayback();
            stateMusic = !stateMusic;

            this._textblockMenuMusic.text = stateMusic ? "🔊" : "🔈";
        });

        this._buttonMenuStart.onPointerUpObservable.add(() => {
            this._objectsController.resetBoxState();
            this._objectsController.resetPlanksOrientation();
            this._rectangleMenu.isVisible = false;
            this._textblockLevel.isVisible = true;
            this._rectangleTouch.isVisible = true;
            this._rectangleTop.isVisible = true;
            this._buttonMenu.isVisible = true;


        });

        this._buttonMenu.onPointerUpObservable.add(() => {
            this._rectangleMenu.isVisible = true;
            this._textblockLevel.isVisible = false;
            this._rectangleGame.isVisible = false;
            this._rectangleTop.isVisible = false;
            this._rectangleTouch.isVisible = false;
        });

        this._buttonLeft.onPointerDownObservable.add(() => {
            this.buttonLeftIsDown = true;
        });
        this._buttonLeft.onPointerUpObservable.add(() => {
            this.buttonLeftIsDown = false;

        });
        this._buttonRight.onPointerDownObservable.add(() => {
            this.buttonRightIsDown = true;
        });
        this._buttonRight.onPointerUpObservable.add(() => {
            this.buttonRightIsDown = false;

        });
    }
}
