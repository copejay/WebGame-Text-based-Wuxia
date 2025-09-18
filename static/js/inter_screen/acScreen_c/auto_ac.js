

import {AU_Button_ac} from '/static/js/inter_screen/acScreen_c/button_ac.js'


import event_bus from "/static/js/event_bus.js";


export class AutoClick{
    constructor(site,size,scene){
        this.site=site;
        this.size=size;
        this.scene=scene;
    }

    create(){
        const wh=[this.size[0]*0.14,this.size[1]*0.9];

        const x_line=this.size[0]*0.003;
        const y_line=this.size[1]*0.04;

        const rect_xy=[this.site[0]+wh[0]/2+x_line,this.site[1]+wh[1]/2+y_line];

        const rect_wh=[this.size[0],this.size[1]];

        this.button_list=[];


        for (let i=0; i<7; i++){
            let xy;
            if (i<7){
                xy=[rect_xy[0]+i*(x_line+wh[0]),rect_xy[1]];
            }else{
            xy=[rect_xy[0]+(i-7)*(x_line+wh[0]),rect_xy[1]+(y_line+wh[1])];
            }
            let id=i.toString();

            this.button_list.push(new AU_Button_ac(xy[0],xy[1],wh[0],wh[1],id,this.scene))
        }

        let begin_text=["返回","人物","武功","背包","商店"];

        this.renew(begin_text);

        this.renew_fight();

        // event_bus.on("function_click",(id)=>{
        //     if (id=="返回"){
        //         this.renew(begin_text);
        //     }else if (id=="战斗"){
        //         this.renew_fight();
        //     }
        // })
    }


    renew_fight(){
        const fight_data=["####","常用指令","技能相关","战斗相关","任务相关","上网聊天","####"];
        this.renewFightMod(fight_data);
    }

    renewFightMod(fight_list){
        for (let i=0; i<7; i++){
            this.button_list[i].re_text(`f${fight_list[i]}`);
        }
    }

    renew(text_list){
        for (let i=0; i<5; i++){
            this.button_list[i].re_text(text_list[i]);
        }
    }
}