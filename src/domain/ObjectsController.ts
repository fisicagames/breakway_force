import { Scene, Vector3, FollowCamera, KeyboardEventTypes, PhysicsBody, HavokPlugin, TransformNode } from "@babylonjs/core";
import { Box } from "./models/Box";
import { Plank } from "./models/Plank";
import { Sky } from "./models/Sky";
import { NetForceVectorLine } from "./models/NetForceVectorLine";
import { IObjectsController } from "../application/interfaces/IObjectsController";
import { ITouchJoystick } from "../presentation/interfaces/ITouchJoystick";
import { GameController } from "../application/GameController";


export class ObjectsController implements IObjectsController {
    private _scene: Scene;
    private _camera: FollowCamera;
    private _rotationSpeed: number = 2;
    private _currentPlankPB: PhysicsBody;
    private _netForceVectorLine: NetForceVectorLine;
    private _physicsEngine: HavokPlugin;
    private _box: Box;
    private _touchController: ITouchJoystick;
    private _gameController: GameController;
    private _isGameEnded: boolean;
    private _planks: Plank[] = [];
    private _planksNode: TransformNode;

    constructor(scene: Scene, camera: FollowCamera, physicsPlugin: HavokPlugin, touchController: ITouchJoystick, gameController: GameController) {
        this._scene = scene;
        this._camera = camera;
        this._physicsEngine = physicsPlugin;
        this._touchController = touchController;
        this._gameController = gameController;
        this._planksNode = new TransformNode("Planks",this._scene);
        this.initialize();
        this._isGameEnded = false;

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
            

            //Verifica se a caixa já caiu fora da possibilidade continuar o jogo:
            if(!this._isGameEnded && this._box.mesh.position.y < this._currentPlankPB.transformNode.position.y - 50){
                this._gameController.endGame();
                this._isGameEnded = true;
            }
            //Verifica se a caixa chegou no limite da cena
            if(this._box.mesh.position.y < -600){
                this._scene.physicsEnabled = false;
                this._box.mesh.isVisible = false;
                //this._physicsEngine.setTimeStep(0.03);
            }

        });
    }

    private createPlanks() {
        for (let i = 0; i < 10; i++) {
            const plank = new Plank(i, this._scene, new Vector3(24 * i, -2.5 * i + 2.5, 0), { size: 4, width: 24, height: 0.5 }, 1, 0.01);
            if (i === 0) {
                this._currentPlankPB = plank.physicsBody;
            }
            plank.mesh.parent = this._planksNode;
            this._planks.push(plank);
        }
    }
    public resetBoxState() {
        this._camera.position = new Vector3(390, -40, -20);
        this._box.physicsBody.disablePreStep = false;
        this._box.mesh.rotation.y = Math.PI;
        this._box.mesh.position = new Vector3(0, 3.8, 0);
        this._scene.onAfterRenderObservable.addOnce(() => {
            this._box.physicsBody.disablePreStep = true;
            this._box.physicsBody.setAngularVelocity(Vector3.Zero());
            this._box.physicsBody.setLinearVelocity(Vector3.Zero());
    
        })            
    }
    public resetPlanksOrientation() {        
        this._planks.forEach(plank => {
            plank.physicsBody.disablePreStep = false;
            plank.mesh.rotation = Vector3.Zero();
            this._box.physicsBody.setAngularVelocity(Vector3.Zero());
            this._box.physicsBody.setLinearVelocity(Vector3.Zero());
            this._scene.onAfterRenderObservable.addOnce(() => {
                plank.physicsBody.disablePreStep = true;
            })            
        });
        
    }
    private plankCollisionHandler(hk: HavokPlugin) {
        hk.onCollisionObservable.add((ev) => {
            if (this._currentPlankPB !== ev.collider) {
                this._currentPlankPB.setAngularVelocity(new Vector3(0, 0, 0,));
                this._currentPlankPB = ev.collider;
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
                        case "b":
                            this.resetPlanksOrientation();
                            this.resetBoxState();
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
        if (this._currentPlankPB.getLinearVelocity().z !== 0) {
            this._physicsEngine.setAngularVelocity(this._currentPlankPB, new Vector3(0, 0, 5 * direction * this._rotationSpeed));
        }
        else {
            this._physicsEngine.setAngularVelocity(this._currentPlankPB, new Vector3(0, 0, 0.1 * direction * this._rotationSpeed));
        }

    }
}
