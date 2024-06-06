import { CanvasInitializer } from "./infrastructure/sceneCore/CanvasInitializer";
import { EngineInitializer } from "./infrastructure/sceneCore/EngineInitializer";
import { InspectorDebugModel } from "./infrastructure/sceneCore/InspectorDebugModel";
import { SceneInitializer } from "./infrastructure/sceneCore/SceneInitializer";

export class Game {
    constructor() {
        const canvas = CanvasInitializer.createAndAdjustCanvas();
        const engine = EngineInitializer.createEngine(canvas);
        const mainScene = new SceneInitializer(canvas, engine);
        InspectorDebugModel.enable(mainScene.scene); //Shift+d
    }
}

// Export a function to instantiate the Game class
export function startGame(): void {
    new Game();
}
