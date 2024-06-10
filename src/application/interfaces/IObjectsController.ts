export interface IObjectsController {
    angleCurrentPlank: number;
    maxDistanceX: number;
    boxStaticFriction: number;
    boxFriction: number;
    resetBoxState();
    resetPlanksOrientation();
}