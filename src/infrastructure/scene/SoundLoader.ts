import { Sound, Scene } from "@babylonjs/core";
import { ISoundInterface } from "./ISoundInterface";

export class SoundLoader implements ISoundInterface {
    private _sound: Sound;
    public static isMusicEnabled: boolean = true;
    private _autoPlay: boolean = false;

    public toggleAllMusicsEnabled(){
        SoundLoader.isMusicEnabled = !SoundLoader.isMusicEnabled
        return SoundLoader.isMusicEnabled;
    }


    constructor(scene: Scene, name: string, path: string, autoplay: boolean) {
        this._autoPlay = autoplay;
        this._sound = new Sound(name, path, scene, () => {
            if (this._autoPlay && SoundLoader.isMusicEnabled) this.play();
        }, {
            volume: 0.3,
            loop: true,
            autoplay: false,
        });

        this.setupVisibilityHandler();
    }

    private setupVisibilityHandler(): void {
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible" && this._autoPlay && SoundLoader.isMusicEnabled) {
                if (!this._sound.isPlaying) this._sound.play();
            } else {
                this._sound.pause();
            }
        });
    }

    public pause(): void {
        if (this._sound.isPlaying) {
            this._sound.pause();
        }
    }

    public play(): void {
        if (!this._sound.isPlaying && document.visibilityState === "visible" && SoundLoader.isMusicEnabled) {
            this._sound.play();
        }
    }

    public togglePlayback(): void {
        if (this._sound.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    public setVolume(volume: number): void {
        this._sound.setVolume(volume);
    }
    public getVolume(): number {
        return this._sound.getVolume();
    }

    public setLoop(loop: boolean): void {
        this._sound.loop = loop;
    }

}
