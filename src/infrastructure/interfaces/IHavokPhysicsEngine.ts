import { HavokPlugin, Scene } from "@babylonjs/core";

export interface IHavokPhysicsEngine {
    initialize(scene: Scene): Promise<HavokPlugin>;
}
