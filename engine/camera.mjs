import { PerspectiveCamera, MathUtils, Vector2, Vector3, Quaternion, Euler } from "./three.module.js";

export class EditorCameraController
{
    constructor(mouse_input)
    {
        this.mouse_input = mouse_input;
        this.camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.x = 9;
        this.camera.position.y = 7;
        this.camera.position.z = 11;

        this.rotation_sensitivity = 0.002;
        this.translation_sensitivity = 0.01;
        this.zoom_sensitivity = 0.5;

        this.euler_rotation = new Euler();
    }

    Update()
    {
        //SO I figured out the trick to this editor style cam
        //the Y rotation is always in world space but the x rotation is in local space
        //GODDAMNIT THAT TOOK SO LONG

        //ROTATE
        if(this.mouse_input.button_state[2])
        {
            this.camera.rotateOnWorldAxis(new Vector3(0,1,0), -this.mouse_input.mouseDelta.x * this.rotation_sensitivity);
            this.camera.rotateX(-this.mouse_input.mouseDelta.y * this.rotation_sensitivity)
        }

        //TRANSLATE
        if(this.mouse_input.button_state[1])
        {
            var result = new Vector3(-this.mouse_input.mouseDelta.x * this.translation_sensitivity,this.mouse_input.mouseDelta.y * this.translation_sensitivity,0);
            result.applyQuaternion(this.camera.quaternion);
            this.camera.position.add(result);
        }

        //ZOOM
        if(this.mouse_input.scroll_delta !=0 )
        {
            var result = new Vector3(0,0,this.mouse_input.scroll_delta * this.zoom_sensitivity);
            result.applyQuaternion(this.camera.quaternion);
            this.camera.position.add(result);
        }
    }

}