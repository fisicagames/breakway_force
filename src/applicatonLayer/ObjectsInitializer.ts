import { Scene, MeshBuilder, Mesh, Vector3, HavokPlugin, PhysicsAggregate, PhysicsShapeType, PhysicsViewer, KeyboardEventTypes, FollowCamera, PhysicsMotionType, StandardMaterial, Color3, Material} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

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

        

        const ground = MeshBuilder.CreateGround("ground", { width: 30, height: 30 }, this._scene);
        const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, this._scene);
        const groundMaterial = new StandardMaterial("groundMaterial", this._scene);
        groundMaterial.diffuseColor = Color3.Random();
        ground.material = groundMaterial;

        this._plank = MeshBuilder.CreateBox("plank", { size: 2, width: 18, height: 0.5 }, this._scene);
        this._plank.position = new Vector3(0, 2.5, 0);
        const plankMaterial = new StandardMaterial("plankMat", this._scene);
        plankMaterial.diffuseColor = Color3.Random();
        this._plank.material = plankMaterial;


        const plankAggregate = new PhysicsAggregate(this._plank, PhysicsShapeType.BOX, { mass: 1 }, this._scene);
        //planeAggregate.body.applyAngularImpulse(new Vector3(0, 0, 2));
        plankAggregate.body.disablePreStep = false;
        plankAggregate.body.setMotionType(PhysicsMotionType.ANIMATED)
        

        const box: Mesh = MeshBuilder.CreateBox("box", { size: 1, width: 2, height: 1 }, this._scene);
        box.position = new Vector3(0, 0.5, 0);
        const boxAggregate = new PhysicsAggregate(box, PhysicsShapeType.BOX, { mass: 1 }, this._scene);
        const boxMaterial = new StandardMaterial("boxMaterial", this._scene);
        boxMaterial.diffuseColor = Color3.Random();
        box.material = boxMaterial;
        
        
        const box2: Mesh = MeshBuilder.CreateBox("box2", { size: 1, width: 2, height: 1 }, this._scene);
        //box2.position = new Vector3(0, 5.5, 0);
        const boxAggregate2 = new PhysicsAggregate(box2, PhysicsShapeType.BOX, { mass: 1 }, this._scene);
        const box2Material = new StandardMaterial("box2Material", this._scene);
        box2Material.diffuseColor = Color3.Random();
        box.material = box2Material;

        
        const mainBox: Mesh = MeshBuilder.CreateBox("mainBox", { size: 1, width: 1, height: 1 }, this._scene);
        mainBox.position.y = 4;
        const mainBoxMaterial = new StandardMaterial("mainBoxMaterial", this._scene);
        mainBoxMaterial.diffuseColor = Color3.Random();
        mainBox.material = mainBoxMaterial;


        
        const boxAggregate3 = new PhysicsAggregate(mainBox, PhysicsShapeType.BOX, { mass: 1 }, this._scene);
        this._camera.lockedTarget = mainBox;

        
        this._scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "a":
                        case "A":
                            hk.setAngularVelocity(plankAggregate.body,new Vector3(0,0,-0.05));
                        break
                        case "d":
                        case "D":
                            this._plank.rotation.y -= this._rotationSpeed;
                            hk.setAngularVelocity(plankAggregate.body,new Vector3(0,0,0.05));
                        break
                        case "w":
                        case "W":
                        break
                        case "s":
                        case "S":
                        break
                    }
                break;
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
        //Type guard function:
        function hasPhysicsBody(mesh: any): mesh is { physicsBody: any } {
            return mesh && 'physicsBody' in mesh;
        }
    }
}