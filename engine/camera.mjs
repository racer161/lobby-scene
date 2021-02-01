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
            this.camera.rotateOnWorldAxis(new Vector3(0,1,0), -this.mouse_input.mouseDelta.x);
            this.camera.rotateX(-this.mouse_input.mouseDelta.y)
        }

        //TRANSLATE
        if(this.mouse_input.button_state[1])
        {
            var result = new Vector3(-this.mouse_input.mouseDelta.x,this.mouse_input.mouseDelta.y,0);
            result.applyQuaternion(this.camera.quaternion);
            //console.log(result);
            this.camera.position.add(result);
            //this.camera.position.y += this.mouse_input.mouseDelta.y;

            console.log(this.camera.position);
        }

        //ZOOM
        if(this.mouse_input.scroll_delta !=0 )
        {
            var result = new Vector3(0,0,this.mouse_input.scroll_delta);
            result.applyQuaternion(this.camera.quaternion);
            //console.log(result);
            this.camera.position.add(result);
        }
    }

}