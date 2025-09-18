

import {AU_Button} from './button.js'

import event_bus from "/static/js/event_bus.js";


export class AutoClick{
    constructor(site,size,scene){
        this.site=site;
        this.size=size;
        this.scene=scene;
    }

    create(){

        this.click_container= this.scene.add.container(0,0);

        const wh=[this.size[0]*0.15,this.size[1]*0.45];

        const x_line=this.size[0]*0.015;
        const y_line=this.size[1]*0.03;

        const rect_xy=[this.site[0]+wh[0]/2+x_line,this.site[1]+wh[1]/2+y_line];

        const rect_wh=[this.size[0],this.size[1]];
        // const wh=[rect_wh[0]/6,rect_wh[1]/2];

        // const x_line=wh[0]+wh[0]/49;

        // const y_line=wh[1]+wh[1]/10;
        this.button_list=[];


        for (let i=0; i<12; i++){
            let xy;
            if (i<6){
                xy=[rect_xy[0]+i*(x_line+wh[0]),rect_xy[1]];
            }else{
            xy=[rect_xy[0]+(i-6)*(x_line+wh[0]),rect_xy[1]+(y_line+wh[1])];
            }
            let id=i.toString();

            this.new_button=new AU_Button(xy[0],xy[1],wh[0],wh[1],id,this.scene);
            this.click_container.add(this.new_button.au_button);
            this.button_list.push(this.new_button);
        }

        let begin_text=["返回","人物","武功","背包","商店","拓展",
                        "命令","飞行","战斗","任务","设置","观察"];

        this.renew_normal();

        event_bus.on("allControl_click",(id)=>{
            if (id=="常用指令"){
                this.run();
                this.renew_normal();
            }else if (id=="战斗相关"){
                this.run();
                this.renew_fight();
            }else if (id=="技能相关"){
                this.run();
                this.renew_magic();
            }else if (id=="任务相关"){
                this.run();
                this.renew_task();
            }else if (id=="上网聊天"){
                this.run();
                this.renew_chat();
            }

        })

        event_bus.on("function_click",(id)=>{
            if (id=="关闭选项"){
                // this.renew(begin_text);
                this.destroy();
                event_bus.emit("function_move_run","run");
            }
        })
        this.destroy();
    }

    run(){
        event_bus.emit("function_move_destroy","destroy");

        this.click_container.setVisible(true);
    }


    destroy(){
        this.click_container.setVisible(false);
    }



    renew_fight(){
        const fight_data=["关闭选项","降龙十八掌","凌波微步","六脉神剑","灵犀一指","普通攻击",
                    "吸星大法","封魔屠刀","普通攻击","普通攻击","普通攻击","转身逃跑",];
        this.renewFightMod(fight_data);
    }

    renewFightMod(fight_list){
        for (let i=0; i<12; i++){
            this.button_list[i].re_text(`f${fight_list[i]}`);

        }
    }

    renew_magic(){
        let begin_text=["关闭选项","打坐练功","内力疗伤","内力疗神","查看武功","人物升级",
                        "null","吐气收功","null","null","null","null"];
        for (let i=0; i<12; i++){
            this.button_list[i].re_text(begin_text[i]);
        }
    }

    renew_chat(){
        let begin_text=["关闭选项","我要发言","查看历史","发个红包","null","null",
                        "null","null","null","null","null","null"];
        for (let i=0; i<12; i++){
            this.button_list[i].re_text(begin_text[i]);
        }
    }

    renew_task(){
        let begin_text=["关闭选项","查看人物","闭关通脉","修炼元神","每日签到","放弃经验",
                        "副本列表","null","null","null","null","自杀重来"];
        for (let i=0; i<12; i++){
            this.button_list[i].re_text(begin_text[i]);
        }
    }

    renew_normal(){
        let begin_text=["关闭选项","综合属性","查看装备","打开背包","玩家商店","返回家园",
                        "null","null","null","乘雕飞行","null","null"];
        for (let i=0; i<12; i++){
            this.button_list[i].re_text(begin_text[i]);
        }
    }
}