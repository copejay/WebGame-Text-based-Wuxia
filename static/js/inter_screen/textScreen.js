import {Rectangle} from '/static/js/tool/Rectangle.js';
import { auto_text } from '/static/js/inter_screen/textScreen_c/auto_text.js';
import eventBus from '/static/js/event_bus.js';


export class textScreen{
    constructor(size,scene){
        this.size=size;
        this.scene=scene;
        this.listen();
    }


    create(){
        const rect_xy=[this.size[0]*0.17,this.size[1]*0.17];
        const rect_wh=[this.size[0]*0.82,this.size[1]*0.555];
        this.rect=new Rectangle(rect_xy[0],rect_xy[1],rect_wh[0],rect_wh[1],this.scene);
        console.log(`屏幕大小：${this.size[0]},${this.size[1]}`);
        console.log("loading screen");
        this.auto_text=new auto_text(rect_xy,rect_wh,this.scene);

    }



    listen(){


         eventBus.on('Move_message',(data)=>{
            this.add_text(data)
            console.log("listen click!!!");
        });
        eventBus.on('function_click',(data)=>{
            this.add_text(data)
            console.log("function_click");
        });
        eventBus.on('fight_message',(data)=>{
            this.add_text(data)
            console.log("fight_message");
        });
        eventBus.on('cultivation_message',(data)=>{
            this.add_text(data)
            console.log("cultivation_message");
        })

        eventBus.on('Alter_message',(data)=>{
            this.add_text(data)
            console.log("alter_message");
        })

    }

//add方法加一个延时
    add_text(out_text){
        if(out_text.length>18){
            let c1_out_text=out_text.slice(0,18);
            this.auto_text.add_text(c1_out_text);
            let c2_out_text=out_text.slice(18);
            this.auto_text.add_text(c2_out_text);

        }else{
            this.auto_text.add_text(out_text);
        }
    }


}