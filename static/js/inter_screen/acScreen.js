
import {Rectangle} from '/static/js/tool/Rectangle.js';
import {AutoClick} from '/static/js/inter_screen/acScreen_c/auto_ac.js'


export class acScreen{
    constructor(size,scene){
        this.size=size;
        this.scene=scene;
    }

    create(){
        const rect_xy=[this.size[0]*0.01,this.size[1]*0.92];
        const rect_wh=[this.size[0]*0.98,this.size[1]*0.07];
        this.rect=new Rectangle(rect_xy[0],rect_xy[1],rect_wh[0],rect_wh[1],this.scene);

        this.auto_click=new AutoClick(rect_xy,rect_wh,this.scene);
        this.auto_click.create();

    }
}
