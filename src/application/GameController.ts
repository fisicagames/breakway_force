import { IGUIController } from "../presentation/GUIController";
import { IObjectsController } from "./interfaces/IObjectsController";


export enum GameState {
    RUNNING,
    ENDED,
}


export class GameController {
    private _guiController: IGUIController;
    private _gameState: GameState;
    private _objectsController: IObjectsController;

    constructor(guiController: IGUIController) {
        this._guiController = guiController;
        this._gameState = GameState.RUNNING;
    }

    public setObjectsController(objectsController: IObjectsController): void {
        this._objectsController = objectsController;
    }

    public endGame(): void {
        if (this._gameState === GameState.RUNNING) {
            this._guiController.endGame();
            this._gameState = GameState.ENDED;
        }
    }

    public get gameState(): GameState {
        return this._gameState;
    }
}
