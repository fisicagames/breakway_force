import { Scene, MeshBuilder, Mesh, Vector3, StandardMaterial, Color3, PhysicsAggregate, PhysicsShapeType, PhysicsMotionType, PhysicsBody } from "@babylonjs/core";
import { BoxPointManager } from "./SpherePointManager";
export class Plank {
    private _scene: Scene;
    private _plank: Mesh;
    private _plankPhysicsAggregate: PhysicsAggregate;
    public index: number;
    private spherePointManager: BoxPointManager;

    constructor(index: number, scene: Scene, position: Vector3, dimensions: { size: number; width: number; height: number }, mass: number, friction: number) {
        this._scene = scene;
        this.index = index;
        this.spherePointManager = new BoxPointManager(this._scene);
        this.createPlank(position, dimensions, mass, friction);
    }

    private createPlank(position: Vector3, dimensions: { size: number; width: number; height: number }, mass: number, friction: number): void {
        const name = `Plank${this.index}`;
        this._plank = MeshBuilder.CreateBox(name, dimensions, this._scene);
        this._plank.position = position;
        const plankMaterial = new StandardMaterial("plankMaterial", this._scene);
        plankMaterial.diffuseColor = Color3.Random();
        this._plank.material = plankMaterial;
        this._plankPhysicsAggregate = new PhysicsAggregate(this._plank, PhysicsShapeType.BOX, { mass, friction }, this._scene);
        this._plankPhysicsAggregate.body.setMotionType(PhysicsMotionType.ANIMATED);
        this._plankPhysicsAggregate.body.disablePreStep = true;
        this.spherePointManager.createBoxesPoint(position);
    }

    public get mesh(): Mesh {
        return this._plank;
    }

    public get physicsBody(): PhysicsBody {
        return this._plankPhysicsAggregate.body;
    }
}
