import "@babylonjs/loaders";
import { Engine, Scene, Vector3, HemisphericLight, ScenePerformancePriority, Color4 } from "@babylonjs/core";
import { CameraInitializer } from "./CameraInitializer";
import { optimizeMaterials } from "./MaterialOptimizer";
import { ObjectsController  } from "../../domain/ObjectsController";
import { GUILoader } from "./GUILoader";
import { HavokPhysicsEngine } from "../physics/HavokPhysicsEngine";
import { GUIController } from "../../presentation/GUIController";
import { GameController } from "../../application/GameController";


export class SceneInitializer {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;

    public get scene(): Scene {
        return this._scene;
    }

    constructor(canvas: HTMLCanvasElement, engine: Engine) {
        this._canvas = canvas;
        this._engine = engine;
        this.initialize();
    }

    private async initialize(): Promise<void> {
        this._scene = new Scene(this._engine);
        const advancedTexture = await GUILoader.loadGUI(this._scene, "./assets/gui/guiTexture.json");
        const guiController = new GUIController(advancedTexture);
        const gameController = new GameController(guiController);


        this.sceneOptimizer();
        this._scene.clearColor = Color4.FromHexString("#977e79");
        const light1: HemisphericLight = new HemisphericLight("light1", new Vector3(0, 1.0, -0.5), this._scene);
        light1.intensity = 1.1;
        
        const universalCamera = CameraInitializer.createUniversalCamera(this._scene, this._canvas);
        const followCamera = CameraInitializer.createFollowCamera(this._scene);
        this._scene.activeCamera = followCamera; // Or followCamera
        
        const physicsEngine = new HavokPhysicsEngine();
        const hk = await physicsEngine.initialize(this._scene);
        const objectController = new ObjectsController(this._scene, followCamera, hk, guiController, gameController);

        gameController.setObjectsController(objectController);
        guiController.setObjectsController(objectController);


        await this._scene.whenReadyAsync(); //optional
        this._engine.hideLoadingUI(); //optional
        this.sceneLoop();
    }

    private sceneLoop() {
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
    }

    private sceneOptimizer() {
        this._scene.skipPointerMovePicking = true;
        this._scene.freezeActiveMeshes(true);
        this._scene.performancePriority = ScenePerformancePriority.BackwardCompatible;
    }
}