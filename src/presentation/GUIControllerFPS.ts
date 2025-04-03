import { AdvancedDynamicTexture, Rectangle, Button, TextBlock } from "@babylonjs/gui";
import { IObjectsController } from "../application/interfaces/IObjectsController";
import { SoundLoader } from "../infrastructure/scene/SoundLoader";
import { GuiLanguage } from "./GUILanguage";
import { LanguageManager } from "./LanguageDetector";

export interface IGUIController {
    endGame();
    updateGUI();
    buttonLeftIsDown: boolean;
    buttonRightIsDown: boolean;
    soundBoxPOint: SoundLoader;
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
    public soundBoxPOint: SoundLoader;
    private _soundGameOver: SoundLoader;
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
    private _buttonLang: Button;
    private _guiLanguage: GuiLanguage;

    private textBlockMiddle: TextBlock;
    private nFrames: number = -240;
    private sumFrames: number = 0;
    private sumDropFrames: number = 0;
    
    

    public endGame() {
        this._soundTrack.pause();
        this._soundGameOver.play();
        this._textblockScoreGame.text = this._guiLanguage.getCurrentLanguage() === 0 ?
        `Pontos: ${this._objectsController.maxDistanceX.toFixed(0)}`:`Points: ${this._objectsController.maxDistanceX.toFixed(0)}`
        if( this._highScore < this._objectsController.maxDistanceX){
            this._highScore  = this._objectsController.maxDistanceX;
        }
        this._textblockTotalScore.text = this._guiLanguage.getCurrentLanguage() === 0 ? 
        `Recorde: ${this._highScore.toFixed(0)}`:`Record: ${this._highScore.toFixed(0)}`;
        this._textblockMenuBest.text = this.getScoreDisplay(this._highScore);
        this._rectangleGame.isVisible = true;
    }
    private getScoreDisplay(score: number): string {
        if (score < 100) {
            return `${score}`;
        } else if (score < 300) {
            return `${score} 🥉`; 
        } else if (score < 600) {
            return `${score} 🥈`; 
        } else {
            return `${score} 🥇`; 
        }
    }
    private getPointsDisplay(score: number): string {
        if (score < 100) {
            return `${score}/100`;
        } else if (score < 300) {
            return `${score}/300 🥉`; 
        } else if (score < 600) {
            return `${score}/600 🥈`; 
        } else {
            return `${score} 🥇`; 
        }
    }
    public setObjectsController(objectsController: IObjectsController): void {
        this._objectsController = objectsController;
    }

    constructor(advancedTexture: AdvancedDynamicTexture) {
        this._advancedTexture = advancedTexture;
        this._guiSetup();
        this._guiButtonsSetup();
        
        this._soundTrack = new SoundLoader(this._advancedTexture.getScene(),
            "soundBoatEngine", "./assets/sounds/big-band-show-146321-compress.mp3", true);
        this._allSounds.push(this._soundTrack);
        
        this.soundBoxPOint = new SoundLoader(this._advancedTexture.getScene(),
            "soundBoatEngine", "./assets/sounds/scale-e6-14577-compress.mp3", false);
        this.soundBoxPOint.setLoop(false);
        this.soundBoxPOint.setVolume(1.0);
        this._allSounds.push(this.soundBoxPOint);
        
        this._soundGameOver = new SoundLoader(this._advancedTexture.getScene(),
            "soundBoatEngine", "./assets/sounds/videogame-death-sound-43894-compress.mp3", false);
        this._soundGameOver.setLoop(false);
        this._soundGameOver.setVolume(1.0);
        this._allSounds.push(this._soundGameOver);

        this._guiLanguage = new GuiLanguage();
        this._guiLanguage.updateText(this._advancedTexture);
        //Feature added on 2024-12-13: Automatically set the language based on the browser's settings.
        LanguageManager.detectAndSetLanguage(() => this._guiLanguage.changeLanguage(this._advancedTexture));
        //
        this._advancedTexture.getScene().onBeforeRenderObservable.add(() => {
            this.nFrames += 1;
            let fpsRate = this._advancedTexture.getScene().getEngine().getFps();
            if (this.nFrames > 0 && this.nFrames <= 1000) {
                this.sumFrames += fpsRate;
                if (fpsRate < 30) this.sumDropFrames++;
                this.textBlockMiddle.text = `FPS médio: ${(this.sumFrames/this.nFrames).toFixed(1).replace('.', ',')}  FPS drop: ${(this.sumDropFrames).toFixed(0).replace('.', ',')}/${this.nFrames}`;
            }

        });
    }
    public updateGUI() {
        this._textblockLevel.text =  this._guiLanguage.getCurrentLanguage() === 0 ?
        `Pontos: ${this.getPointsDisplay(this._objectsController.maxDistanceX)}`:`Points: ${this.getPointsDisplay(this._objectsController.maxDistanceX)}`;
        this._textBlockEquation.text = `μₑ = ${this._objectsController.boxStaticFriction.toFixed(2)} (${(Math.atan(this._objectsController.boxStaticFriction)*180/Math.PI).toFixed(1)}°) e   μ𝒸 = ${this._objectsController.boxFriction.toFixed(2)} (${(Math.atan(this._objectsController.boxFriction)*180/Math.PI).toFixed(1)}°)`
        this._textblockAngle.text =  this._guiLanguage.getCurrentLanguage() === 0 ?
        `𝜃 = ${this._objectsController.angleCurrentPlank.toFixed(1)}°    Coeficiente de restituição: ${this._objectsController.boxRestitution.toFixed(2)} `:
        `𝜃 = ${this._objectsController.angleCurrentPlank.toFixed(1)}°    Coefficient of restitution: ${this._objectsController.boxRestitution.toFixed(2)} `;
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
        this._buttonLang = this._advancedTexture.getControlByName("ButtonLang") as Button;

        this.textBlockMiddle = this._advancedTexture.getControlByName("TextBlockMiddle") as TextBlock;
        

        


    }
    private _guiButtonsSetup() {

        this._buttonLang.onPointerUpObservable.add(() => {
            this._guiLanguage.changeLanguage(this._advancedTexture);
        });

        this._buttonMenuContinuar.onPointerUpObservable.add(() => {
            this._rectangleGameContinue.isVisible = false;
            //this._textblockMenuBest.text = `${this._levelMediator.gameData.highScore}`;
            this._soundTrack.play();            
            this._objectsController.resetBoxState();
            this._objectsController.resetPlanksOrientation();
            this._objectsController.resetBoxPointPositions();
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
            this._objectsController.resetBoxPointPositions();
            this._soundTrack.play();
            this._rectangleMenu.isVisible = false;
            this._textblockLevel.isVisible = true;
            this._rectangleTouch.isVisible = true;
            this._rectangleTop.isVisible = true;
            this._buttonMenu.isVisible = true;


        });

        this._buttonMenu.onPointerUpObservable.add(() => {
            this.endGame();
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
