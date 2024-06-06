import { Scene, MeshBuilder, Mesh, Vector3, HavokPlugin, PhysicsAggregate, PhysicsShapeType, PhysicsViewer, KeyboardEventTypes, FollowCamera, PhysicsMotionType, StandardMaterial, Color3, PhysicsMaterialCombineMode, PhysicsBody, Quaternion, PhysicsShapeSphere, PhysicsShapeBox, TransformNode } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import { GridMaterial } from '@babylonjs/materials';

export class ObjectsInitializer {
    private _scene: Scene;
    private _plank: Mesh;
    private _rotationSpeed: number = 0.2;
    private _camera: FollowCamera;
    private _plank2: Mesh;
    private _currentPlank: PhysicsBody;

    constructor(scene: Scene, camera: FollowCamera) {
        this._scene = scene;
        this._camera = camera;
    }

    public async initialize(): Promise<void> {
        // Configuração do motor de física com localização específica do arquivo WASM
        const havok = await HavokPhysics({
            locateFile: () => `./assets/wasm/HavokPhysics.wasm`
        });

        // Initialize plugin
        const hk = new HavokPlugin(true, havok);

        // Enable physics in the scene with gravity
        this._scene.enablePhysics(new Vector3(0, -9.8, 0), hk);

        const ground = MeshBuilder.CreateGround("ground", { width: 400, height: 30 }, this._scene);
        ground.position.y = -5;
        const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, this._scene);
        const defaultGridMaterial = new GridMaterial("default", this._scene);
        defaultGridMaterial.majorUnitFrequency = 5;
        defaultGridMaterial.gridRatio = 0.5;
        
        ground.material = defaultGridMaterial;

        this._plank = MeshBuilder.CreateBox("Plank", { size: 4, width: 22, height: 0.5 }, this._scene);
        this._plank.position = new Vector3(0, 2.5, 0);
        const plankMaterial = new StandardMaterial("plankMaterial", this._scene);
        plankMaterial.diffuseColor = Color3.Random();
        this._plank.material = plankMaterial;
        const plankAggregate = new PhysicsAggregate(this._plank, PhysicsShapeType.BOX, { mass: 1, friction: 0.1 }, this._scene);
        plankAggregate.body.setMotionType(PhysicsMotionType.ANIMATED);
        plankAggregate.body.disablePreStep = false;

        this._currentPlank = plankAggregate.body;


        this._plank2 = MeshBuilder.CreateBox("Plank2", { size: 4, width: 24, height: 0.5 }, this._scene);
        this._plank2.position = new Vector3(23, 0.0, 0);
        const plankMaterial2 = new StandardMaterial("plankMaterial", this._scene);
        plankMaterial2.diffuseColor = Color3.Random();
        this._plank.material = plankMaterial2;
        const plankAggregate2 = new PhysicsAggregate(this._plank2, PhysicsShapeType.BOX, { mass: 1, friction: 0.01 }, this._scene);
        plankAggregate2.body.setMotionType(PhysicsMotionType.ANIMATED);
        plankAggregate2.body.disablePreStep = false;


      
        const box: Mesh = MeshBuilder.CreateBox("Box", { size: 2, width: 2, height: 2 }, this._scene);
        box.position.y = 4;
        box.rotation.y = Math.PI;
        const mainBoxMaterial = new StandardMaterial("BoxMaterial", this._scene);
        mainBoxMaterial.diffuseColor = Color3.Red();
        box.material = mainBoxMaterial;
        const boxPhysicsBody = new PhysicsBody(box, PhysicsMotionType.DYNAMIC, false, this._scene);
        boxPhysicsBody.setMassProperties({
            mass: 10,
            centerOfMass: new Vector3(0, 0, 0),
            inertia: new Vector3(1, 1, 1),
            inertiaOrientation: new Quaternion(0, 0, 0, 1)
        });

        const boxPhysicsShape = new PhysicsShapeBox(
            new Vector3(0, 0, 0),        // center of the box
            new Quaternion(0, 0, 0, 1),  // rotation of the box
            new Vector3(2, 2, 2),        // dimensions of the box
            this._scene                                // scene of the shape
        );
        boxPhysicsBody.shape = boxPhysicsShape;
        const boxPhysicsMaterial = { friction: 0.2, 
                           staticFriction: 0.1, 
                           frictionCombine: PhysicsMaterialCombineMode.MAXIMUM};
        boxPhysicsShape.material = boxPhysicsMaterial;

        boxPhysicsBody.setCollisionCallbackEnabled(true);
        
        hk.onCollisionObservable.add((ev) => {
            //console.log(ev.collider.transformNode.name);
            this._currentPlank = ev.collider;

        });
        

        this._camera.lockedTarget = box;

        this._scene.onKeyboardObservable.add((kbInfo) => {
            hk.setAngularVelocity(plankAggregate.body, new Vector3(0, 0, 0));
            hk.setAngularVelocity(plankAggregate2.body, new Vector3(0, 0, 0));
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
                            //this._plank.rotation.y -= this._rotationSpeed;
                            hk.setAngularVelocity(this._currentPlank, new Vector3(0, 0, -this._rotationSpeed));
                            break;
                        case "w":
                        case "W":
                        case "ArrowUp":
                            break;
                        case "s":
                        case "S":
                        case "ArrowDown":
                            break;
                    }
                    break;
            }
        });

        let i: number = 0;
        let lastBoxLinearVelocity = boxPhysicsBody.getLinearVelocity();
        let newBoxLinearVelocity = boxPhysicsBody.getLinearVelocity();

        
        this._scene.onBeforeRenderObservable.add(() => {
            //Loop for console tests and debug:
            i++;
            if (i % 120 === 0 && i < 6000) {
                newBoxLinearVelocity = boxPhysicsBody.getLinearVelocity();
                const accelerationBox = newBoxLinearVelocity.subtract(lastBoxLinearVelocity);
                lastBoxLinearVelocity = newBoxLinearVelocity;
                console.clear();
                console.log("accelerationBox ", accelerationBox);
                const angleInDegrees = -this._plank.rotationQuaternion.toEulerAngles().z * (180 / Math.PI);
                console.log(`Plank angle: ${angleInDegrees.toFixed(2)} degrees`);
            }
        });
        this.enablePhysicsViewer(false);
    }

    private enablePhysicsViewer(enable: boolean): void {
        if(enable) {
            const physicsViewer = new PhysicsViewer();
            for (const mesh of this._scene.rootNodes) {
                if (hasPhysicsBody(mesh)) {
                    const debugMesh = physicsViewer.showBody(mesh.physicsBody);
                }
            }
            // Type guard function:
            function hasPhysicsBody(mesh: any): mesh is { physicsBody: any } {
                return mesh && 'physicsBody' in mesh;
            }
        }
        
    }
}
