import { Scene, Vector3, FollowCamera, KeyboardEventTypes } from "@babylonjs/core";
import { Box } from "../domain/objcts/Box";
import { Ground } from "../domain/objcts/Ground";
import { Plank } from "../domain/objcts/Plank";
import { HavokPhysicsSetup } from "../infrastructure/HavokPhysicsSetup";


export class ObjectsInitializer {
    private _scene: Scene;
    private _camera: FollowCamera;
    private _rotationSpeed: number = 0.2;
    private _currentPlank: Plank;

    constructor(scene: Scene, camera: FollowCamera) {
        this._scene = scene;
        this._camera = camera;
    }

    public async initialize(): Promise<void> {
        const hk = await HavokPhysicsSetup.initialize(this._scene);

        const ground = new Ground(this._scene);
        
        const plank1 = new Plank(this._scene, new Vector3(0, 2.5, 0), { size: 4, width: 22, height: 0.5 }, 1, 0.1);
        const plank2 = new Plank(this._scene, new Vector3(23, 0.0, 0), { size: 4, width: 24, height: 0.5 }, 1, 0.01);

        this._currentPlank = plank1;

        const box = new Box(this._scene);

        this._camera.lockedTarget = box.mesh;

        this._scene.onKeyboardObservable.add((kbInfo) => {
            hk.setAngularVelocity(plank1.physicsBody, new Vector3(0, 0, 0));
            hk.setAngularVelocity(plank2.physicsBody, new Vector3(0, 0, 0));
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "a":
                        case "A":
                        case "ArrowLeft":
                            hk.setAngularVelocity(this._currentPlank.physicsBody, new Vector3(0, 0, this._rotationSpeed));
                            break;
                        case "d":
                        case "D":
                        case "ArrowRight":
                            hk.setAngularVelocity(this._currentPlank.physicsBody, new Vector3(0, 0, -this._rotationSpeed));
                            break;
                    }
                    break;
            }
        });

        hk.onCollisionObservable.add((ev) => {
            this._currentPlank = ev.collider.transformNode.name === plank1.mesh.name ? plank1 : plank2;
        });
    }
}
