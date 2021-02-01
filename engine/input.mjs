import { Vector2 } from "./three.module.js";


export class MouseInput
{
    constructor()
    {
        var that = this;

        //an array of booleans indicating the button isPressed 
        this.button_state = [ false,false,false ];

        this.mouseDelta = new Vector2(0,0);

        this.scroll_delta = 0;

        window.onmousedown = function(e)
        {
            
            that.button_state[e.button] = true;
        }

        window.onmousemove = function(e)
        {
            that.mouseDelta = new Vector2(e.movementX, e.movementY);
        }

        window.onwheel = function(e)
        {
            that.scroll_delta = e.deltaY;
        }

        window.onmouseup = function(e)
        {
            that.button_state[e.button] = false;
        }
    }

    Update()
    {
        this.mouseDelta = new Vector2(0,0);
        this.scroll_delta = 0;
    }
}