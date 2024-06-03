//Remove InspectorDebugModel before build dist
import { CanvasInitializer } from "./baseSetup/CanvasInitializer";
import { EngineInitializer } from "./baseSetup/EngineInitializer";
import { InspectorDebugModel } from "./baseSetup/InspectorDebugModel";
import { SceneInitializer } from "./baseSetup/SceneInitializer";

class Game {
    constructor() {
        const canvas = CanvasInitializer.createAndAdjustCanvas();
        const engine = EngineInitializer.createEngine(canvas);
        const mainScene = new SceneInitializer(canvas, engine);
        InspectorDebugModel.enable(mainScene.scene); //Shift+d
    }
}
new Game();