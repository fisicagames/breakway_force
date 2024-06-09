import { Scene, Vector3, FollowCamera, KeyboardEventTypes, PhysicsBody, HavokPlugin } from "@babylonjs/core";
import { Box } from "./models/Box";
import { Plank } from "./models/Plank";
import { Sky } from "./models/Sky";
import { NetForceVectorLine } from "./models/NetForceVectorLine";
import { IObjectsController } from "../application/interfaces/IObjectsController";
import { ITouchJoystick } from "../presentation/interfaces/IGUIController";

export class ObjectsController implements IObjectsController {
    private _scene: Scene;
    private _camera: FollowCamera;
    private _rotationSpeed: number = 2;
    private _currentPlank: PhysicsBody;
    private _netForceVectorLine: NetForceVectorLine;
    private _physicsEngine: HavokPlugin;
    private _box: Box;
    private _touchController: ITouchJoystick;

    constructor(scene: Scene, camera: FollowCamera, physicsPlugin: HavokPlugin, touchController: ITouchJoystick) {
        this._scene = scene;
        this._camera = camera;
        this._physicsEngine = physicsPlugin;
        this._touchController = touchController;
        this.initialize();
    }

    private initialize() {
        const sky = new Sky(this._scene);
        this.createPlanks();

        this._box = new Box(this._scene);
        this._netForceVectorLine = new NetForceVectorLine(this._scene, this._box.mesh);

        this._camera.lockedTarget = this._box.mesh;

        const hk = this._physicsEngine;

        this.plankCollisionHandler(hk);

        this.updateObjects();
        this.keyboardInput();

    }

    private updateObjects() {
        let iFramesCount: number = 0;
        let lastBoxLinearVelocity = this._box.physicsBody.getLinearVelocity();

        this._scene.onBeforeRenderObservable.add(() => {
            if (this._touchController.buttonLeftIsDown) {
                this.rotatePlank(1);
            }
            else if (this._touchController.buttonRightIsDown) {
                this.rotatePlank(-1);
            }
            else {
                this.rotatePlank(0);
            }

            iFramesCount++;

            if (iFramesCount % 10 === 0) {

                const newBoxLinearVelocity = this._box.physicsBody.getLinearVelocity();
                const accelerationBox = newBoxLinearVelocity.subtract(lastBoxLinearVelocity);
                lastBoxLinearVelocity = newBoxLinearVelocity;

                this._netForceVectorLine.update(accelerationBox);
            }
            else {
                this._netForceVectorLine.updateOnlyPosition();
            }
        });
    }

    private createPlanks() {
        for (let i = 0; i < 10; i++) {
            const plank = new Plank(this._scene, new Vector3(24 * i, -2.5 * i + 2.5, 0), { size: 4, width: 24, height: 0.5 }, 1, 0.01);
            if (i === 0) {
                this._currentPlank = plank.physicsBody;
            }
        }
    }
    private plankCollisionHandler(hk: HavokPlugin) {
        hk.onCollisionObservable.add((ev) => {
            if (this._currentPlank !== ev.collider) {
                this._currentPlank.setAngularVelocity(new Vector3(0, 0, 0,));
                this._currentPlank = ev.collider;
            }
        });
    }

    private keyboardInput() {
        this._scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "a":
                        case "A":
                        case "ArrowLeft":
                            this.rotatePlank(1);
                            break;
                        case "d":
                        case "D":
                        case "ArrowRight":
                            this.rotatePlank(-1);
                            break;
                    }
                    break;
            }
        });
    }

    public rotatePlank(direction: number): void {
        if (this._currentPlank.getLinearVelocity().z !== 0) {
            this._physicsEngine.setAngularVelocity(this._currentPlank, new Vector3(0, 0, 5 * direction * this._rotationSpeed));
        }
        else {
            this._physicsEngine.setAngularVelocity(this._currentPlank, new Vector3(0, 0, 0.1 * direction * this._rotationSpeed));
        }

    }
}
