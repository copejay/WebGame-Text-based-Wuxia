import {Rectangle} from '/static/js/tool/Rectangle.js';
import {Auto_person} from "/static/js/inter_screen/personScreen_c/auto_person.js";


export class personScreen{
    constructor(size,scene){
        this.size=size;
        this.scene=scene;

    }

    create(){
        const rect_xy=[this.size[0]*0.01,this.size[1]*0.17];
        const rect_wh=[this.size[0]*0.16,this.size[1]*0.695];
        this.rect=new Rectangle(rect_xy[0],rect_xy[1],rect_wh[0],rect_wh[1],this.scene);
        
        this.auto_person=new Auto_person(rect_xy,rect_wh,this.scene);
        this.auto_person.create();


    }
}