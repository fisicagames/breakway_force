// src/shared/LanguageManager.ts
import { AdvancedDynamicTexture, TextBlock, Button } from "@babylonjs/gui";

export class GuiLanguage {
    private _lang: number;
    private _strings: Record<string, string[]>;

    constructor() {
        this._lang = 0; // Default language is Portuguese
        this._strings = {
            ButtonLang: ["ENGLISH", "PORTUGUÊS"],
            TextblockMeta: ["Objetivo: Incline o plano para lançar a caixa até o próximo plano à direita! Use os botões + e -  na tela ou as teclas direita e esquerda no teclado.", "Objective: Incline the platform to launch the box to the next platform! Use the + and - screen buttons or the right/left keys on the keyboard."],
            TextblockTitle: ["Força de Destaque", "Breakawy Force"], 
            ButtonMenuStart: ["Iniciar", "Start"],
            TextblockMenuScore: ["Maior pontuação:", "High Score:"],
            TextBlockMiddle: ["Coeficientes de atrito estático e cinético:","Static and kinetic friction coefficients:" ],
            TextBlockHeigh: ["O vetor cinza é a força resultante!","The gray vector is the net force!"],
            ButtonMenuContinuar: ["Reiniciar","Restart"],
            TextblockScoreGame: ["Pontos:  000","Points: 000"],
            TextblockMusic: ["Música:","Music:"]
        };
    }

    public changeLanguage(advancedTexture: AdvancedDynamicTexture): void {
        this._lang = this._lang === 0 ? 1 : 0;
        this.updateText(advancedTexture);
    }

    public updateText(advancedTexture: AdvancedDynamicTexture): void {
        for (const key in this._strings) {
            if (this._strings.hasOwnProperty(key)) {
                const translations = this._strings[key];
                const control = advancedTexture.getControlByName(key);

                if (control instanceof TextBlock) {
                    control.text = translations[this._lang];
                } else if (control instanceof Button) {
                    control.textBlock.text = translations[this._lang];
                }
            }
        }
    }

    public getCurrentLanguage(): number {
        return this._lang;
    }

    public getTranslation(key: string): string {
        return this._strings[key][this._lang];
    }
}
