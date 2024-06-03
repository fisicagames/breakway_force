import { Scene, Vector3, FollowCamera, UniversalCamera, AbstractMesh } from "@babylonjs/core";

export class CameraInitializer {
    public static createFollowCamera(scene: Scene, targetMesh: AbstractMesh): FollowCamera {
        const camera = new FollowCamera("FollowCam", new Vector3(-20, 50, -550), scene);
        camera.radius = 15;
        camera.heightOffset = 6;
        camera.rotationOffset = 0;
        camera.cameraAcceleration = 0.05;
        camera.maxCameraSpeed = 100;
        camera.lockedTarget = targetMesh;
        return camera;
    }

    public static createUniversalCamera(scene: Scene, canvas: HTMLCanvasElement): UniversalCamera {
        const camera = new UniversalCamera("UniversalCamera", new Vector3(0, 5, -30), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, true);
        return camera;
    }
}