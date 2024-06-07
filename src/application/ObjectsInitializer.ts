import { Scene, Vector3, FollowCamera, KeyboardEventTypes, PhysicsBody, Color3, MeshBuilder, Mesh, LinesMesh, Quaternion, MaterialPluginBase, Color4 } from "@babylonjs/core";
import { HavokPhysicsSetup } from "../infrastructure/HavokPhysicsSetup";
import { Box } from "../domain/models/Box";
import { Ground } from "../domain/models/Ground";
import { Plank } from "../domain/models/Plank";
import { Sky } from "../domain/models/Sky";

export class ObjectsInitializer {
    private _scene: Scene;
    private _camera: FollowCamera;
    private _rotationSpeed: number = 0.2;
    private _currentPlank: PhysicsBody;
    private _netForceVectorLine: LinesMesh = null;

    constructor(scene: Scene, camera: FollowCamera) {
        this._scene = scene;
        this._camera = camera;
    }

    public async initialize(): Promise<void> {
        const hk = await HavokPhysicsSetup.initialize(this._scene);

        const sky = new Sky(this._scene);

        for (let i = 0; i < 10; i++) {
            const plank = new Plank(this._scene, new Vector3(24 * i, -2.5 * i + 2.5, 0), { size: 4, width: 24, height: 0.5 }, 1, 0.01);
            if (i === 0) {
                this._currentPlank = plank.physicsBody;
            }
        }

        const box = new Box(this._scene);

        // Local Axes
        const myPoints = [
            Vector3.Zero(),
            new Vector3(1, 0, 0),
            new Vector3(1 * 0.95, 0.05 * 1, 0),
            new Vector3(1, 0, 0),
            new Vector3(1 * 0.95, -0.05 * 1, 0),
        ]

        this._netForceVectorLine = MeshBuilder.CreateLines("lines", { points: myPoints, updatable: false, instance: this._netForceVectorLine});
        this._netForceVectorLine.color = new Color3(0.3, 0.3, 0.5);
        

        this._camera.lockedTarget = box.mesh;

        this._scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "a":
                        case "A":
                        case "ArrowLeft":
                            hk.setAngularVelocity(this._currentPlank, new Vector3(0, 0, this._rotationSpeed));
                            break;
                        case "d":
                        case "D":
                        case "ArrowRight":
                            hk.setAngularVelocity(this._currentPlank, new Vector3(0, 0, -this._rotationSpeed));
                            break;
                    }
                    break;
            }
        });

        hk.onCollisionObservable.add((ev) => {
            if (this._currentPlank !== ev.collider) {
                this._currentPlank = ev.collider;
            }
        });

        let i: number = 0;    
        let lastBoxLinearVelocity = box.physicsBody.getLinearVelocity();
        
        this._scene.onBeforeRenderObservable.add(() => {
            i++;
            if (i % 5 === 0  ) {
                const newBoxLinearVelocity = box.physicsBody.getLinearVelocity();
                const accelerationBox = newBoxLinearVelocity.subtract(lastBoxLinearVelocity);
                lastBoxLinearVelocity = newBoxLinearVelocity;

                let magnitude = accelerationBox.length()*20;
                if (magnitude < 20){
                    this._netForceVectorLine.scaling = new Vector3(magnitude,magnitude,magnitude)
                }  else{
                    magnitude = 0;
                    this._netForceVectorLine.scaling = new Vector3(magnitude,magnitude,magnitude)
                }

                const direction = accelerationBox.normalize();
                const initialDirection = new Vector3(1, 0, 0);  // Eixo X
                const rotationQuaternion = new Quaternion();
                Quaternion.FromUnitVectorsToRef(initialDirection, direction, rotationQuaternion);

                // Aplicar a rotação à mesh this._lines
                this._netForceVectorLine.rotationQuaternion = rotationQuaternion;
            }
            this._netForceVectorLine.position.x = box.mesh.position.x;
            this._netForceVectorLine.position.y = box.mesh.position.y;
            this._netForceVectorLine.position.z = box.mesh.position.z - 2;
            
        });
    }
}
