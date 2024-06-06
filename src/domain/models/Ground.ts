import { Scene, MeshBuilder, Mesh, Vector3, PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core";
import { GridMaterial } from '@babylonjs/materials';


export class Ground {
    private _scene: Scene;
    private _ground: Mesh;
    private _width: number;
    private _position: Vector3;

    constructor(scene: Scene, width: number, position: Vector3 ) {
        this._scene = scene;
        this._width = width;
        this._position = position;
        this.createGround();
    }

    private createGround(): void {
        this._ground = MeshBuilder.CreateGround("ground", { width: this._width, height: 50 }, this._scene);
        this._ground.position = this._position;
        const groundAggregate = new PhysicsAggregate(this._ground, PhysicsShapeType.BOX, { mass: 0 }, this._scene);
        const defaultGridMaterial = new GridMaterial("default", this._scene);
        defaultGridMaterial.majorUnitFrequency = 5;
        defaultGridMaterial.gridRatio = 0.5;
        this._ground.material = defaultGridMaterial;
    }
    public setYPosition(y: number){
        this._ground.position.y = y;
    }
}
