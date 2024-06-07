import { HavokPlugin, Scene, Vector3 } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

export class HavokPhysicsEngine   {
    public async initialize(scene: Scene): Promise<HavokPlugin> {
        const havok = await HavokPhysics({
            locateFile: () => `./assets/wasm/HavokPhysics.wasm`
        });

        const hk = new HavokPlugin(true, havok);
        scene.enablePhysics(new Vector3(0, -9.8, 0), hk);
        
        return hk;
    }
}
