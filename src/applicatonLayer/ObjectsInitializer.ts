import { Scene, MeshBuilder, Mesh, Vector3, HavokPlugin, PhysicsAggregate, PhysicsShapeType, PhysicsViewer, KeyboardEventTypes, FollowCamera, PhysicsMotionType, StandardMaterial, Color3, PhysicsMaterialCombineMode, PhysicsBody, Quaternion, PhysicsShapeSphere, PhysicsShapeBox, TransformNode } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import { GridMaterial } from '@babylonjs/materials';

export class ObjectsInitializer {
    private _scene: Scene;
    private _plank: Mesh;
    private _rotationSpeed: number = 10;
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
        const groundMaterial = new StandardMaterial("groundMaterial", this._scene);
        groundMaterial.diffuseColor = Color3.Random();
        ground.material = groundMaterial;

        this._plank = MeshBuilder.CreateBox("Plank", { size: 4, width: 32, height: 0.5 }, this._scene);
        this._plank.position = new Vector3(0, 2.5, 0);
        const defaultGridMaterial = new GridMaterial("default", this._scene);
        defaultGridMaterial.majorUnitFrequency = 5;
        defaultGridMaterial.gridRatio = 0.5;
        this._plank.material = defaultGridMaterial;
        const plankAggregate = new PhysicsAggregate(this._plank, PhysicsShapeType.BOX, { mass: 1, friction: 0.1 }, this._scene);
        plankAggregate.body.setMotionType(PhysicsMotionType.ANIMATED);
        plankAggregate.body.disablePreStep = false;

        this._currentPlank = plankAggregate.body;


        this._plank2 = MeshBuilder.CreateBox("Plank2", { size: 4, width: 32, height: 0.5 }, this._scene);
        this._plank2.position = new Vector3(32, 0.5, 0);
        //const defaultGridMaterial = new GridMaterial("default", this._scene);
        //defaultGridMaterial.majorUnitFrequency = 5;
        //defaultGridMaterial.gridRatio = 0.5;
        this._plank2.material = defaultGridMaterial;
        const plankAggregate2 = new PhysicsAggregate(this._plank2, PhysicsShapeType.BOX, { mass: 1, friction: 0.01 }, this._scene);
        plankAggregate2.body.setMotionType(PhysicsMotionType.ANIMATED);
        plankAggregate2.body.disablePreStep = false;


      
        const box: Mesh = MeshBuilder.CreateBox("Box", { size: 1, width: 1, height: 1 }, this._scene);
        box.position.y = 4;
        box.rotation.y = Math.PI;
        const mainBoxMaterial = new StandardMaterial("BoxMaterial", this._scene);
        mainBoxMaterial.diffuseColor = Color3.Red();
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
            new Vector3(1, 1, 1),        // dimensions of the box
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
                            hk.setAngularVelocity(this._currentPlank, new Vector3(0, 0, 0.1));
                            break;
                        case "d":
                        case "D":
                        case "ArrowRight":
                            //this._plank.rotation.y -= this._rotationSpeed;
                            hk.setAngularVelocity(this._currentPlank, new Vector3(0, 0, -0.1));
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
        // Atualiza o console com o ângulo do plank
        this._scene.onBeforeRenderObservable.add(() => {
            i++;
            if (i % 60 === 0 && i < 6000) {
                //const angleInDegrees = this._plank.rotationQuaternion.toEulerAngles().z * (180 / Math.PI);
                //console.clear();
                //console.log(`Plank angle: ${angleInDegrees.toFixed(2)} degrees`);
            }
        });
    }

    private enablePhysicsViewer() {
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
