import { CanvasInitializer } from "./infrastructure/scene/CanvasInitializer";
import { EngineInitializer } from "./infrastructure/scene/EngineInitializer";
//import { InspectorDebugModel } from "./infrastructure/scene/InspectorDebugModel";
import { SceneInitializer } from "./infrastructure/scene/SceneInitializer";

export class Game {
    constructor() {
        const canvas = CanvasInitializer.createAndAdjustCanvas();
        const engine = EngineInitializer.createEngine(canvas);
        const mainScene = new SceneInitializer(canvas, engine);
        //InspectorDebugModel.enable(mainScene.scene); //Shift+d
    }
}

// Export a function to instantiate the Game class
export function startGame(): void {
    new Game();
}
