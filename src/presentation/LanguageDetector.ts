export class LanguageManager {
    public static detectAndSetLanguage(changeLanguageCallback: () => void): void {
        //console.log(navigator.language);
        //For test use: Locale Switcher - Chrome extension.
        const browserLanguage = navigator.language || "en";
        if (!browserLanguage.startsWith("pt")) {
            changeLanguageCallback();
        }
    }
}

