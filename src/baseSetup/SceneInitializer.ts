import "@babylonjs/loaders";
import { Engine, Scene, Vector3, HemisphericLight, ScenePerformancePriority, Color4, Mesh, MeshBuilder } from "@babylonjs/core";
import { CameraInitializer } from "./CameraInitializer";
import { optimizeMaterials } from "./MaterialOptimizer";
import { ObjectsInitializer } from "../applicatonLayer/ObjectsInitializer";

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
        this.sceneOptimizer();

        this._scene.clearColor = Color4.FromHexString("#5FB1CF");
        
        const light1: HemisphericLight = new HemisphericLight("light1", new Vector3(0, 1.0, -0.5), this._scene);
        light1.intensity = 0.9;
        
        //Create a sphere for test purposes:
        //const sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, this._scene);

        const universalCamera = CameraInitializer.createUniversalCamera(this._scene, this._canvas);
        const followCamera = CameraInitializer.createFollowCamera(this._scene);

        this._scene.activeCamera = followCamera; // Or followCamera
        
        
        const gameObjectsInitializer = new ObjectsInitializer(this._scene, followCamera);
        gameObjectsInitializer.initialize();
        

        const materialNames = ["MaterialX.00X", "MaterialY.00Y"]; // Only an example
        optimizeMaterials(this._scene, materialNames); //optional
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