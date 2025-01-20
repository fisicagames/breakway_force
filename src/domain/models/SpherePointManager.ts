import { MeshBuilder, Scene, Vector3 } from "@babylonjs/core";

export class BoxPointManager{
    private scene: Scene;
    constructor(scene: Scene) {
        this.scene = scene;

    }
    createBoxesPoint(position: Vector3) {
        const newBoxPosition01 = position.add(new Vector3(0, 1, 0));
        const newBoxPosition02 = position.add(new Vector3(-20, 1, 0));
        const newBoxPosition03 = position.add(new Vector3(20, 1, 0));
        const boxPoint01 = MeshBuilder.CreateBox("BoxPoint", { size: 0.7, width: 0.7, height: 0.7 }, this.scene);
        boxPoint01.position = newBoxPosition01;
        const boxPoint02 = MeshBuilder.CreateBox("BoxPoint", { size: 0.7, width: 0.7, height: 0.7 }, this.scene);
        boxPoint02.position = newBoxPosition02;
        const boxPoint03 = MeshBuilder.CreateBox("BoxPoint", { size: 0.7, width: 0.7, height: 0.7 }, this.scene);
        boxPoint03.position = newBoxPosition03;
    }
}