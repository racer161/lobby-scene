import { Vector2 } from "./three.module.js";


export class MouseInput
{
    constructor()
    {
        var that = this;

        //an array of booleans indicating the button isPressed 
        this.button_state = [ false,false,false ];

        this.mouseDelta = new Vector2(0,0);

        this.mousePosition = new Vector2(0,0);

        this.scroll_delta = 0;

        this.mousedownCallbacks =[];

        window.onmousedown = function(e)
        {
            e.preventDefault();
            that.button_state[e.button] = true;
            for(var i =0; i < that.mousedownCallbacks.length; i++) 
                that.mousedownCallbacks[i](that);
        }

        window.onmousemove = function(e)
        {
            e.preventDefault();
            that.mouseDelta = new Vector2(e.movementX, e.movementY);

            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components
            that.mousePosition = new Vector2(
                ( e.clientX / window.innerWidth ) * 2 - 1,
                - ( e.clientY / window.innerHeight ) * 2 + 1
            );
        }

        window.onwheel = function(e)
        {
            that.scroll_delta = e.deltaY;
        }

        window.onmouseup = function(e)
        {
            e.preventDefault();
            that.button_state[e.button] = false;
        }
    }

    register_mousedown_callback(callback)
    {
        this.mousedownCallbacks.push(callback);
    }

    Update()
    {
        this.mouseDelta = new Vector2(0,0);
        this.scroll_delta = 0;
    }
}