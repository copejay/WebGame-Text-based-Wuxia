
import {Rectangle} from '/static/js/tool/Rectangle.js';
import {AutoClick} from '/static/js/inter_screen/clickScreen_c/auto_click.js'


export class clickScreen{
    constructor(size,scene){
        this.size=size;
        this.scene=scene;
    }

    create(){
        const rect_xy=[this.size[0]*0.17,this.size[1]*0.725];
        const rect_wh=[this.size[0]*0.82,this.size[1]*0.14];
        this.rect=new Rectangle(rect_xy[0],rect_xy[1],rect_wh[0],rect_wh[1],this.scene);

        this.auto_click=new AutoClick(rect_xy,rect_wh,this.scene);
        this.auto_click.create();

    }
}
