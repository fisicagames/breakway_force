import { Scene, Vector3, Color3, MeshBuilder, LinesMesh, Quaternion, Mesh } from "@babylonjs/core";

export class NetForceVectorLine {
    private _scene: Scene;
    private _netForceVectorLine: LinesMesh;
    private _box: Mesh;

    constructor(scene: Scene, box: Mesh) {
        this._scene = scene;
        this._box = box;
        this.createNetForceVectorLine();
    }

    private createNetForceVectorLine(): void {
        const myPoints = [
            Vector3.Zero(),
            new Vector3(1, 0, 0),
            new Vector3(1 * 0.95, 0.05 * 1, 0),
            new Vector3(1, 0, 0),
            new Vector3(1 * 0.95, -0.05 * 1, 0),
        ];

        this._netForceVectorLine = MeshBuilder.CreateLines("lines", { points: myPoints, updatable: false });
        this._netForceVectorLine.color = new Color3(0.3, 0.3, 0.5);
    }

    public update(accelerationBox: Vector3): void {
        const magnitude = accelerationBox.length() * 20;
        const direction = accelerationBox.normalize();

        if (magnitude < 20) {
            this._netForceVectorLine.scaling = new Vector3(magnitude, magnitude, magnitude);
        } else {
            this._netForceVectorLine.scaling = new Vector3(0, 0, 0);
        }

        const initialDirection = new Vector3(1, 0, 0);  // Eixo X
        const rotationQuaternion = new Quaternion();
        Quaternion.FromUnitVectorsToRef(initialDirection, direction, rotationQuaternion);

        this._netForceVectorLine.rotationQuaternion = rotationQuaternion;

        this._netForceVectorLine.position.x = this._box.position.x;
        this._netForceVectorLine.position.y = this._box.position.y;
        this._netForceVectorLine.position.z = this._box.position.z - 2;
    }
    public updateOnlyPosition(){
        this._netForceVectorLine.position.x = this._box.position.x;
        this._netForceVectorLine.position.y = this._box.position.y;
        this._netForceVectorLine.position.z = this._box.position.z - 2;

    }
}
