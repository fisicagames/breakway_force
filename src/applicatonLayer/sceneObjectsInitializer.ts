import { Scene, MeshBuilder, Mesh, Vector3, PhysicsBody, PhysicsMotionType, HavokPlugin } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

export class SceneObjectsInitializer {
    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public async initialize(): Promise<void> {
        // Configuração do motor de física com localização específica do arquivo WASM
        const havok = await HavokPhysics({
            locateFile: () => `./assets/wasm/HavokPhysics.wasm`
        });

        // Initialize plugin
        const hk = new HavokPlugin(true, havok);

        // Enable physics in the scene with gravity
        this._scene.enablePhysics(new Vector3(0, -9.8, 0), hk);

        // Criação dos objetos
        const plane: Mesh = MeshBuilder.CreateBox("box", { size: 2, width: 8, height: 0.5 }, this._scene);
        plane.position = new Vector3(0, 0, 0);
        new PhysicsBody(plane, PhysicsMotionType.STATIC, false, this._scene); // Adicionando física ao plano

        const box: Mesh = MeshBuilder.CreateBox("box", { size: 1, width: 1, height: 1 }, this._scene);
        box.position = new Vector3(-3, 0.5, 0);
        new PhysicsBody(box, PhysicsMotionType.DYNAMIC, false, this._scene); // Adicionando física à caixa
    }
}
