import "@babylonjs/loaders";
import { Engine, Scene, Vector3, HemisphericLight, ScenePerformancePriority, Color4, Mesh, PBRMaterial, MeshBuilder } from "@babylonjs/core";
import { CameraInitializer } from "./CameraInitializer";


export class SceneInitializer {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _ground: Mesh;
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

        this._scene.clearColor = Color4.FromHexString("#33334D");
        const light1: HemisphericLight = new HemisphericLight("light1", new Vector3(0.09, 0.1, 1), this._scene);
        const sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, this._scene);

        const universalCamera = CameraInitializer.createUniversalCamera(this._scene, this._canvas);
        const followCamera = CameraInitializer.createFollowCamera(this._scene, sphere);

        this._scene.activeCamera = followCamera; // Or universalCamera

        const materialNames = ["MaterialX.00X", "MaterialY.00Y"];
        this.materialListOptimizer(materialNames);


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
        //or use this.scene.pointerMoveFastCheck = true
        this._scene.performancePriority = ScenePerformancePriority.BackwardCompatible;
    }

    private materialListOptimizer(materialNames: string[]) {
        this._scene.meshes.forEach(mesh => {
            if (mesh.material && materialNames.indexOf(mesh.material.name) !== -1) {
                mesh.receiveShadows = false;
                // mesh.getLODLevels().forEach(lod => {
                //     if (lod.mesh) {
                //         lod.mesh.receiveShadows = false;
                //     }
                // });
            }
        });
        materialNames.forEach(materialName => {
            const material = this._scene.getMaterialByName(materialName) as PBRMaterial;
            if (material) {
                // Desativar configurações caras
                material.disableLighting = true;
                material.reflectionTexture = null;
                material.refractionTexture = null;
                material.subSurface.isRefractionEnabled = false;
                material.subSurface.isTranslucencyEnabled = false;
                material.subSurface.isScatteringEnabled = false;
                material.clearCoat.isEnabled = false;

                material.needDepthPrePass = false;

                // Ajustar intensidades conforme necessário
                material.environmentIntensity = 0.5;
                material.specularIntensity = 0.5;
            }
        });
    }
}