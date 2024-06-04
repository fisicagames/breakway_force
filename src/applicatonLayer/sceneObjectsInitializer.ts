import { Scene, MeshBuilder, Mesh, Vector3, PhysicsBody, PhysicsMotionType, HavokPlugin, PhysicsAggregate, PhysicsShapeType, PhysicsViewer, Quaternion, PhysicsShapeSphere } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

export class SceneObjectsInitializer {
    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
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

        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, this._scene);
        sphere.position.y = 4;
        const sphereAggregate = new PhysicsAggregate(sphere, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, this._scene);

        const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, this._scene);
        const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, this._scene);


        const plane: Mesh = MeshBuilder.CreateBox("box", { size: 2, width: 8, height: 0.5 }, this._scene);
        plane.position = new Vector3(0, 0, 0);
        const planeAggregate = new PhysicsAggregate(plane, PhysicsShapeType.BOX, { mass: 0 }, this._scene);

        const box: Mesh = MeshBuilder.CreateBox("box", { size: 1, width: 1, height: 1 }, this._scene);
        box.position = new Vector3(-3, 2.5, 0);
        const boxAggregate = new PhysicsAggregate(box, PhysicsShapeType.BOX, { mass: 1 }, this._scene);

        //Full physics steps:
        const sphere2 = MeshBuilder.CreateSphere("sphere");
        sphere2.position = new Vector3(3, 5, 0);
        const body = new PhysicsBody(sphere2, PhysicsMotionType.DYNAMIC, false, this._scene);
        body.setMassProperties({
            mass: 1,
            centerOfMass: new Vector3(0, 1, 0),
            inertia: new Vector3(1, 1, 1),
            inertiaOrientation: new Quaternion(0, 0, 0, 1)
        });

        const shape = new PhysicsShapeSphere(
            new Vector3(0, 0, 0), // center of the sphere in local space
            0.5, // radius of the sphere
            this._scene // containing scene
        );
        body.shape = shape;
        const material = { friction: 0.2, restitution: 1.0 };
        shape.material = material;
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
