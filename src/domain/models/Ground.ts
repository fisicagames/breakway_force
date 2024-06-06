import { Scene, MeshBuilder, Mesh, StandardMaterial, Color3, Vector3, PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core";
import { GridMaterial } from '@babylonjs/materials';


export class Ground {
    private _scene: Scene;
    private _ground: Mesh;

    constructor(scene: Scene) {
        this._scene = scene;
        this.createGround();
    }

    private createGround(): void {
        this._ground = MeshBuilder.CreateGround("ground", { width: 400, height: 30 }, this._scene);
        this._ground.position.y = -5;
        const groundAggregate = new PhysicsAggregate(this._ground, PhysicsShapeType.BOX, { mass: 0 }, this._scene);
        const defaultGridMaterial = new GridMaterial("default", this._scene);
        defaultGridMaterial.majorUnitFrequency = 5;
        defaultGridMaterial.gridRatio = 0.5;
        this._ground.material = defaultGridMaterial;
    }
}
