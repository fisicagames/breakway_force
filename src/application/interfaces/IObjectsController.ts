export interface IObjectsController {
    resetBoxPointPositions(): unknown;
    angleCurrentPlank: number;
    maxDistanceX: number;
    boxStaticFriction: number;
    boxFriction: number;
    boxRestitution: number;
    resetBoxState();
    resetPlanksOrientation();
}