import { Scene, Vector3, FollowCamera, UniversalCamera, AbstractMesh } from "@babylonjs/core";

export class CameraInitializer {
    public static createFollowCamera(scene: Scene, targetMesh: AbstractMesh = null): FollowCamera {
        const camera = new FollowCamera("FollowCam", new Vector3(-500, 70, 0), scene);
        camera.radius = 50;
        camera.heightOffset = 10;
        camera.rotationOffset = 0;
        camera.cameraAcceleration = 0.01;
        camera.maxCameraSpeed = 100;
        camera.lockedTarget = targetMesh;
        return camera;
    }

    public static createUniversalCamera(scene: Scene, canvas: HTMLCanvasElement): UniversalCamera {
        const camera = new UniversalCamera("UniversalCamera", new Vector3(0, 10, -20), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, true);
        return camera;
    }
}