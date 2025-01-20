import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3 } from "@babylonjs/core";

export class BoxPointManager{
    private scene: Scene;
    private boxPointMaterial: StandardMaterial;
    private boxPointArray: Mesh[];
    private boxPointNode: TransformNode; 
    private n: number = 0;

    constructor(scene: Scene, boxPointNode: TransformNode, boxPointArray: Mesh[]) {
        this.scene = scene;
        this.boxPointArray = boxPointArray;
        this.boxPointMaterial = new StandardMaterial("BoxPoint", this.scene);
        this.boxPointMaterial.diffuseColor = new Color3(1, 1, 0);
        this.boxPointMaterial.emissiveColor =  new Color3(1, 1, 0);
        this.boxPointNode = boxPointNode;

    }
    createBoxesPoint(position: Vector3) {
        const newBoxPosition01 = position.add(new Vector3(0, 1, 0));
        const newBoxPosition02 = position.add(new Vector3(-20, 1, 0));
        const newBoxPosition03 = position.add(new Vector3(20, 1, 0));
        const boxPoint01 = MeshBuilder.CreateBox("BoxPoint"+this.n.toString(), { size: 0.7, width: 0.7, height: 0.7 }, this.scene);
        this.n++;
        boxPoint01.position = newBoxPosition01;
        boxPoint01.material = this.boxPointMaterial;
        const boxPoint02 = MeshBuilder.CreateBox("BoxPoint"+this.n.toString(), { size: 0.7, width: 0.7, height: 0.7 }, this.scene);
        this.n++;
        boxPoint02.position = newBoxPosition02;
        boxPoint02.material = this.boxPointMaterial;
        const boxPoint03 = MeshBuilder.CreateBox("BoxPoint"+this.n.toString(), { size: 0.7, width: 0.7, height: 0.7 }, this.scene);
        this.n++;
        boxPoint03.position = newBoxPosition03;
        boxPoint03.material = this.boxPointMaterial;

        boxPoint01.setParent(this.boxPointNode);
        boxPoint02.setParent(this.boxPointNode);
        boxPoint03.setParent(this.boxPointNode);
        this.boxPointArray.push(boxPoint01);
        this.boxPointArray.push(boxPoint02);
        this.boxPointArray.push(boxPoint03);
    }
}