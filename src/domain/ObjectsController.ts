import { Scene, Vector3, FollowCamera, KeyboardEventTypes, PhysicsBody, HavokPlugin, TransformNode, PhysicsMaterialCombineMode } from "@babylonjs/core";
import { Box } from "./models/Box";
import { Plank } from "./models/Plank";
import { Sky } from "./models/Sky";
import { NetForceVectorLine } from "./models/NetForceVectorLine";
import { IObjectsController } from "../application/interfaces/IObjectsController";
import { GameController, GameState } from "../application/GameController";
import { IGUIController } from "../presentation/GUIController";


export class ObjectsController implements IObjectsController {
    private _scene: Scene;
    private _camera: FollowCamera;
    private _rotationSpeed: number = 2;
    private _currentPlank: Plank;
    private _currentPlankPB: PhysicsBody;
    private _netForceVectorLine: NetForceVectorLine;
    private _physicsEngine: HavokPlugin;
    private _box: Box;
    private _guiController: IGUIController;
    private _gameController: GameController;
    private _planks: Plank[] = [];
    private _planksNode: TransformNode;
    private _physicsBodyToPlankMap: Map<PhysicsBody, Plank> = new Map();

    public maxDistanceX: number;
    public angleCurrentPlank: number;
    public boxStaticFriction: number;
    public boxFriction: number;
    public boxRestitution: number;
    

    constructor(scene: Scene, camera: FollowCamera, physicsPlugin: HavokPlugin, guiController: IGUIController, gameController: GameController) {
        this._scene = scene;
        this._camera = camera;
        this._physicsEngine = physicsPlugin;
        this._guiController = guiController;
        this._gameController = gameController;
        this._planksNode = new TransformNode("Planks", this._scene);
        this.maxDistanceX = 0;
        this.boxFriction = 0.65;
        this.boxStaticFriction = 0.7;
        this.boxRestitution = 0.01;
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
        this._netForceVectorLine.setVisible(true);
        let iFramesCount: number = 0;
        let lastBoxLinearVelocity = this._box.physicsBody.getLinearVelocity();

        this._scene.onBeforeRenderObservable.add(() => {
            this._camera.position.z = -50;
            if (this._guiController.buttonLeftIsDown) {
                this.rotatePlank(1);
                this._netForceVectorLine.setVisible(false);
            }
            else if (this._guiController.buttonRightIsDown) {
                this.rotatePlank(-1);
                this._netForceVectorLine.setVisible(false);
            }
            else {
                this.rotatePlank(0);
                this._netForceVectorLine.setVisible(true);
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
            if (this._gameController.gameState == GameState.RUNNING &&
                this._box.mesh.position.y < this._currentPlankPB.transformNode.position.y - 50) {
                this._gameController.endGame();
            }
            //Verifica se a caixa chegou no limite da cena
            if (this._box.mesh.position.y < -600) {
                this._scene.physicsEnabled = false;
                this._box.mesh.isVisible = false;
                //this._physicsEngine.setTimeStep(0.03);
            }

        });
    }

    private createPlanks() {
        for (let i = 0; i < 100; i++) {
            const plank = new Plank(i, this._scene, new Vector3(41 * i, -7.5 * i + 2.5, 0), { size: 4, width: 42, height: 0.5 }, 1, 0.01);
            if (i === 0) {
                this._currentPlankPB = plank.physicsBody;
            }
            plank.mesh.parent = this._planksNode;
            this._planks.push(plank);
            this._physicsBodyToPlankMap.set(plank.physicsBody, plank); 
        }


    }
    public resetBoxState() {
        this.boxStaticFriction = 0.7;
        this.boxFriction = 0.65;
        this.boxRestitution = 0.01;
        this.setPhysicsMaterialToBox(this.boxStaticFriction,this.boxFriction, this.boxRestitution);
        this.maxDistanceX = 0;
        this._gameController.gameState = GameState.RUNNING;

        this._scene.physicsEnabled = true;
        this._box.mesh.isVisible = false;
        this._camera.position = new Vector3(-500, -40, -20);
        this._box.physicsBody.disablePreStep = false;
        this._box.mesh.rotation = new Vector3(0, Math.PI, 0);
        this._box.mesh.position = new Vector3(-20, 3.8, 0);
        this._scene.onAfterRenderObservable.addOnce(() => {
            this._box.physicsBody.disablePreStep = true;
            this.setPhysicsMaterialToBox(this.boxStaticFriction,this.boxFriction);
            this._box.physicsBody.setAngularVelocity(Vector3.Zero());
            this._box.physicsBody.setLinearVelocity(Vector3.Zero());
            this._box.mesh.isVisible = true;
        })
    }
    private setPhysicsMaterialToBox(staticFriction: number, friction: number, restitution: number = 0.01) {
        const boxPhysicsMaterial = {
            staticFriction: staticFriction,
            friction: friction,
            frictionCombine: PhysicsMaterialCombineMode.MAXIMUM,
            restitution: restitution
        };
        this._box.physicsBody.shape.material = boxPhysicsMaterial;
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
                this._currentPlank = this._physicsBodyToPlankMap.get(ev.collider);
                if (this._currentPlank) {
                    this._currentPlankPB = this._currentPlank.physicsBody;
                }
                this.boxStaticFriction > 0.1 ? this.boxStaticFriction = 0.7 - 0.01*this._currentPlank.index: 0.1;
                this.boxFriction > 0.05 ? this.boxFriction = 0.65 - 0.02*this._currentPlank.index: 0.05;
                this.boxRestitution < 1.01 ? this.boxRestitution = 0.01 + 0.01 *this._currentPlank.index: 1.00;
                this.setPhysicsMaterialToBox(this.boxStaticFriction,this.boxFriction, this.boxRestitution);
            }
            this.maxDistanceX = Math.max(this.maxDistanceX, this._box.mesh.position.x);
            this._guiController.updateGUI();
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
                            this._netForceVectorLine.setVisible(false);
                            break;
                        case "b":
                            this.resetPlanksOrientation();
                            this.resetBoxState();
                        case "d":
                        case "D":
                        case "ArrowRight":
                            this.rotatePlank(-1);
                            this._netForceVectorLine.setVisible(false);
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
        this.angleCurrentPlank = -this._currentPlankPB.transformNode.rotation.z*180/Math.PI;
    }
}
