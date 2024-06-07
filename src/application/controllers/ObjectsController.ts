import { Scene, Vector3, FollowCamera, KeyboardEventTypes, PhysicsBody } from "@babylonjs/core";
import { Box } from "../../domain/models/Box";
import { Plank } from "../../domain/models/Plank";
import { Sky } from "../../domain/models/Sky";
import { NetForceVectorLine } from "../../domain/models/NetForceVectorLine";
import { IHavokPhysicsEngine } from "../../infrastructure/interfaces/IHavokPhysicsEngine";

export class ObjectsController {
    private _scene: Scene;
    private _camera: FollowCamera;
    private _rotationSpeed: number = 0.2;
    private _currentPlank: PhysicsBody;
    private _netForceVectorLine: NetForceVectorLine;
    private _physicsEngine: IHavokPhysicsEngine;

    constructor(scene: Scene, camera: FollowCamera, physicsEngine: IHavokPhysicsEngine) {
        this._scene = scene;
        this._camera = camera;
        this._physicsEngine = physicsEngine;

    }

    public async initialize(): Promise<void> {
        const hk = await this._physicsEngine.initialize(this._scene);

        const sky = new Sky(this._scene);

        for (let i = 0; i < 10; i++) {
            const plank = new Plank(this._scene, new Vector3(24 * i, -2.5 * i + 2.5, 0), { size: 4, width: 24, height: 0.5 }, 1, 0.01);
            if (i === 0) {
                this._currentPlank = plank.physicsBody;
            }
        }

        const box = new Box(this._scene);
        this._netForceVectorLine = new NetForceVectorLine(this._scene, box.mesh);

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
            if (i % 5 === 0) {
                const newBoxLinearVelocity = box.physicsBody.getLinearVelocity();
                const accelerationBox = newBoxLinearVelocity.subtract(lastBoxLinearVelocity);
                lastBoxLinearVelocity = newBoxLinearVelocity;

                this._netForceVectorLine.update(accelerationBox);
            }
            else{
                this._netForceVectorLine.updateOnlyPosition();
            }
            //reset box position after fall
            if(box.mesh.position.y < -20){
                //to do: code for restart all objects!
            }
        });
    }
}
