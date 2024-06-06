import { Scene, Vector3, FollowCamera, KeyboardEventTypes, PhysicsBody, Color3, MeshBuilder, Mesh, LinesMesh } from "@babylonjs/core";
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
    private _lines: LinesMesh = null;

    constructor(scene: Scene, camera: FollowCamera) {
        this._scene = scene;
        this._camera = camera;
    }

    public async initialize(): Promise<void> {
        const hk = await HavokPhysicsSetup.initialize(this._scene);

        
        const sky = new Sky(this._scene);
        
        for (let i = 0; i < 10; i++) {
            console.log(i);
            const plank = new Plank(this._scene, new Vector3(24*i, -2.5*i+2.5, 0), { size: 4, width: 24, height: 0.5 }, 1, 0.01);
            //const ground = new Ground(this._scene, 24, new Vector3(i*24, -5*i-5, 0));
            if (i == 0) {this._currentPlank = plank.physicsBody;}
        }

        

        const box = new Box(this._scene);

        //Local Axes
    
        const myPoints = [
            Vector3.Zero(),
            new Vector3(4, 0, 0),
            new Vector3(4 * 0.95, 0.05 * 4, 0),
            new Vector3(4, 0, 0),
            new Vector3(4 * 0.95, -0.05 * 4, 0),
        ]
        
        this._lines = MeshBuilder.CreateLines("lines", {points: myPoints, updatable: true});
        this._lines.parent = box.mesh;
    

	    
  

        this._camera.lockedTarget = box.mesh;

        this._scene.onKeyboardObservable.add((kbInfo) => {
            //hk.setAngularVelocity(plank1.physicsBody, new Vector3(0, 0, 0));
            //hk.setAngularVelocity(plank2.physicsBody, new Vector3(0, 0, 0));
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
            if (this._currentPlank != ev.collider){
                this._currentPlank = ev.collider;

                
                
            }
            //console.log(this._currentPlank.physicsBody.transformNode.name);
        });

        let i: number = 0;
        let lastBoxLinearVelocity = box.physicsBody.getLinearVelocity();
        let newBoxLinearVelocity = box.physicsBody.getLinearVelocity();

        
        this._scene.onBeforeRenderObservable.add(() => {
            //Loop for console tests and debug:
            i++;
            if (i % 120 === 0 && i < 6000) {
                newBoxLinearVelocity = box.physicsBody.getLinearVelocity();
                const accelerationBox = newBoxLinearVelocity.subtract(lastBoxLinearVelocity);
                lastBoxLinearVelocity = newBoxLinearVelocity;
                const myPoints = [
                    Vector3.Zero(),
                    new Vector3(4, 0, 0),
                    new Vector3(4 * 0.95, 0.05 * 4, 0),
                    new Vector3(4, 0, 0),
                    new Vector3(4 * 0.95, -0.05 * 4, 0),
                ]
                
                this._lines = MeshBuilder.CreateLines("lines", {points: myPoints, updatable: true});
                this._lines.position = box.mesh.position;
                
            }
        });
    }
}
