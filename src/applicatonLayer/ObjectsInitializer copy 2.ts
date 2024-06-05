import { Scene, MeshBuilder, Mesh, Vector3, HavokPlugin, PhysicsAggregate, PhysicsShapeType, PhysicsViewer, KeyboardEventTypes, FollowCamera, PhysicsMotionType, StandardMaterial, Color3, PhysicsMaterialCombineMode } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import { GridMaterial } from '@babylonjs/materials';

export class ObjectsInitializer {
    private _scene: Scene;
    private _plank: Mesh;
    private _rotationSpeed: number = 10;
    private _camera: FollowCamera;

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

        const ground = MeshBuilder.CreateGround("ground", { width: 50, height: 30 }, this._scene);
        ground.position.y = -2;
        const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, this._scene);
        const groundMaterial = new StandardMaterial("groundMaterial", this._scene);
        groundMaterial.diffuseColor = Color3.Random();
        ground.material = groundMaterial;

        this._plank = MeshBuilder.CreateBox("plank", { size: 4, width: 32, height: 0.5 }, this._scene);
        this._plank.position = new Vector3(0, 2.5, 0);
        const defaultGridMaterial = new GridMaterial("default", this._scene);
        defaultGridMaterial.majorUnitFrequency = 5;
        defaultGridMaterial.gridRatio = 0.5;
        this._plank.material = defaultGridMaterial;

        const plankAggregate = new PhysicsAggregate(this._plank, PhysicsShapeType.BOX, { mass: 1, friction: 0.99 }, this._scene);
        plankAggregate.body.setMotionType(PhysicsMotionType.ANIMATED);
        plankAggregate.body.disablePreStep = false;

        const box2: Mesh = MeshBuilder.CreateBox("box2", { size: 1, width: 2, height: 1 }, this._scene);
        const box2Material = new StandardMaterial("box2Material", this._scene);
        box2Material.diffuseColor = Color3.Random();
        box2.material = box2Material;

        const boxAggregate2 = new PhysicsAggregate(box2, PhysicsShapeType.BOX, { mass: 1, friction: 0.8, restitution: 0.1 }, this._scene);
        // Configurando o material de atrito no momento da criação do agregado físico
        boxAggregate2.shape.material.friction = 0.8;
        boxAggregate2.shape.material.staticFriction = 0.8;
        boxAggregate2.shape.material.frictionCombine = PhysicsMaterialCombineMode.MAXIMUM;

        const mainBox: Mesh = MeshBuilder.CreateBox("mainBox", { size: 1, width: 1, height: 1 }, this._scene);
        mainBox.position.y = 4;
        const mainBoxMaterial = new StandardMaterial("mainBoxMaterial", this._scene);
        mainBoxMaterial.diffuseColor = Color3.Red();
        mainBox.material = mainBoxMaterial;

        const boxAggregate3 = new PhysicsAggregate(mainBox, PhysicsShapeType.BOX, { mass: 10 }, this._scene);
        const mainBoxShapeMaterial = boxAggregate3.shape.material;
        mainBoxShapeMaterial.friction = 1.99;
        mainBoxShapeMaterial.staticFriction = 1.99;
        //mainBoxShapeMaterial.frictionCombine = PhysicsMaterialCombineMode.MAXIMUM;

        this._camera.lockedTarget = mainBox;

        this._scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "a":
                        case "A":
                        case "ArrowLeft":
                            hk.setAngularVelocity(plankAggregate.body, new Vector3(0, 0, -0.05));
                            break;
                        case "d":
                        case "D":
                        case "ArrowRight":
                            this._plank.rotation.y -= this._rotationSpeed;
                            hk.setAngularVelocity(plankAggregate.body, new Vector3(0, 0, 0.05));
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
            if (i % 30 === 0) {
                const angleInDegrees = this._plank.rotationQuaternion.toEulerAngles().z * (180 / Math.PI);
                console.log(`Plank angle: ${angleInDegrees.toFixed(2)} degrees`);
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
