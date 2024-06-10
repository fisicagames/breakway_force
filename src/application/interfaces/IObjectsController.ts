export interface IObjectsController {
    angleCurrentPlank: number;
    maxDistanceX: number;
    boxStaticFriction: number;
    boxFriction: number;
    boxRestitution: number;
    resetBoxState();
    resetPlanksOrientation();
}