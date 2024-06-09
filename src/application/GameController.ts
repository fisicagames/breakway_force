import { IGUIController } from "../presentation/GUIController";

export enum GameState {
    RUNNING,
    ENDED,
}

export class GameController {
    private _guiController: IGUIController;
    private _gameState: GameState;

    constructor(guiController: IGUIController) {
        this._guiController = guiController;
        this._gameState = GameState.RUNNING;
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
