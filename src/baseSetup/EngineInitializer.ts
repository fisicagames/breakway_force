import { Engine, GPUParticleSystem } from "@babylonjs/core";

export class EngineInitializer {
    public static createEngine(canvas: HTMLCanvasElement): Engine {

        var engine = new Engine(canvas, true, { disableWebGL2Support: false });
        console.log("GPU is supported: ", GPUParticleSystem.IsSupported);

        if (GPUParticleSystem.IsSupported) {
            engine = new Engine(canvas, true, { disableWebGL2Support: false }); // 72 fps;   
        }
        else {
            engine = new Engine(canvas, true, { disableWebGL2Support: true });// 80 fps
        }

        engine.setHardwareScalingLevel(canvas.width / 333);

        engine.disableVertexArrayObjects = true;
        engine.disableUniformBuffers = true;
        engine.displayLoadingUI();

        //resize if the screen is resized/rotated
        window.addEventListener('resize', () => {
            engine.resize();
        });

        return engine;
    }
}