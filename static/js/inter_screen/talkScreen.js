import {Rectangle} from '/static/js/tool/Rectangle.js';
import {auto_talk} from '/static/js/inter_screen/talkScreen_c/auto_talk.js';


export class talkScreen{

    constructor(size,scene){
        this.size=size;
        this.scene=scene;
    }

    
    create(){
        const rect_xy=[this.size[0]*0.01,this.size[1]*0.01];
        const rect_wh=[this.size[0]*0.98,this.size[1]*0.11];
        this.rect=new Rectangle(rect_xy[0],rect_xy[1],rect_wh[0],rect_wh[1],this.scene);

        this.auto_talk=new auto_talk(rect_xy,rect_wh,this.scene);
    }
     
}