import { Scene, MeshBuilder, Mesh, Vector3, StandardMaterial, Color3, PhysicsBody, Quaternion, PhysicsShapeBox, PhysicsMaterialCombineMode, PhysicsMotionType } from "@babylonjs/core";

export class Box {
    private _scene: Scene;
    private _box: Mesh;
    private _boxPhysicsBody: PhysicsBody;

    constructor(scene: Scene) {
        this._scene = scene;
        this.createBox();
    }

    private createBox(): void {
        this._box = MeshBuilder.CreateBox("Box", { size: 2, width: 2, height: 2 }, this._scene);
        this._box.position.y = 4;
        this._box.position.x = 0;
        this._box.rotation.y = Math.PI;
        const mainBoxMaterial = new StandardMaterial("BoxMaterial", this._scene);
        mainBoxMaterial.diffuseColor = Color3.FromHexString("#DC5F00");
        this._box.material = mainBoxMaterial;

        this._boxPhysicsBody = new PhysicsBody(this._box, PhysicsMotionType.DYNAMIC, false, this._scene);
        this._boxPhysicsBody.setMassProperties({
            mass: 10,
            centerOfMass: new Vector3(0, 0, 0),
            inertia: new Vector3(1, 1, 1),
            inertiaOrientation: new Quaternion(0, 0, 0, 1)            
        });

        const boxPhysicsShape = new PhysicsShapeBox(
            new Vector3(0, 0, 0),        // center of the box
            new Quaternion(0, 0, 0, 1),  // rotation of the box
            new Vector3(2, 2, 2),        // dimensions of the box
            this._scene
        );

        const boxPhysicsMaterial = {
            friction: 0.2,
            staticFriction: 0.1,
            frictionCombine: PhysicsMaterialCombineMode.MAXIMUM,
            restitution: 0.5
        };
        boxPhysicsShape.material.restitution
        boxPhysicsShape.material = boxPhysicsMaterial;
        this._boxPhysicsBody.shape = boxPhysicsShape;
        this._boxPhysicsBody.setCollisionCallbackEnabled(true);
    }

    public get mesh(): Mesh {
        return this._box;
    }

    public get physicsBody(): PhysicsBody {
        return this._boxPhysicsBody;
    }
}
