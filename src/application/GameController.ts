import { IGUIController } from "../presentation/GUIController";

export interface IGameController{
    endGame(): void;
}


export class GameController implements IGameController{
    private _guiController: IGUIController;
    constructor(guiController){
        this._guiController = guiController;

    }

    public endGame(): void{
        this._guiController.endGame();

    }


}