//战斗系统集成在person显示界面之下

import event_bus from "/static/js/event_bus.js"


export class Fight{

    constructor(){
        this.npc=["npc",1,0,0,0];
        this.player=["player",1,0,0,0];
        this.fight_mod=0;
        this.npc_blood=0;
        this.player_blood=0;
        this.busy_time=2;
        this.free_time=0;

        this.last_attack_time=0;


        // event_bus.on("Pop_fight_begin",(data)=>{
        //     console.log("接收到战斗开始指令！");
        //     event_bus.emit("fight_message",`你向${data[0][0]}发起了攻击！`);
        //     this.fight_begin(data[0],data[1]);
        // })
    }

    check_busy(){
        if(this.fight_mod==0){
            return false;
        }else{
            return true;
        }
    }


    fight_begin(npc,player){
        if (this.fight_mod==1){
            console.log("战斗中！");
            event_bus.emit("fight_message",`error:你正在进行战斗！`);
            return;
        }else{
            this.npc=npc;
            this.player=player;
            this.npc_blood=npc[1];
            this.player_blood=player[1];

            this.fight_mod=1;

            this.fighting();
            this.create_Ai_npc();
        }
    }


    fighting(){
        console.log("fight:战斗模块加载");

        event_bus.off("click_fight_magic");
        event_bus.on("click_fight_magic",(data)=>{
            console.log("fight:检测到玩家出招式");
            if (this.fight_mod==1){
                if(this.check_free()){
                    this.figure_attack(this.player);
                    // if (this.npc_blood<=0){
                    //     event_bus.emit("fight_message",`[${this.npc[0]}]死亡`);
                    //     this.fight_mod=0;
                    // }
                }else{
                    console.log("玩家攻击冷却中！");
                    return;
                }
            }else{
                console.log("无战斗对象！")
            }
        });
        console.log("fight:战斗模块加载完成");

    }


    check_free(){
        console.log("fight:检测玩家攻击冷却");
        let now_time=Date.now();
        this.free_time=(now_time-this.last_attack_time)/1000;

        if (this.free_time>=this.busy_time){
            this.last_attack_time=Date.now();
            return true;
        }else{
            event_bus.emit("fight_message",`busy(${Math.ceil(this.busy_time-this.free_time)})`);
            return false;
        }
    }


    figure_attack(player){
        console.log("fight:计算伤害");
        let damage=0;
        // if (player[2]>npc[3]){
        const pri_damage=player[2];
        const range_num=Math.round(pri_damage*(0.8+Math.random()**0.4));
        damage=Math.floor(range_num);
        event_bus.emit("fight_message",`[你]攻击了[${this.npc[0]}]`);

        this.Ai_npc.postMessage({"type":"damage_to_npc","data":damage});

        // }else{
        //     damage=1;
        // }
        // this.npc_blood-=damage;
        // event_bus.emit("fight_message",`[${player[0]}]攻击了[${npc[0]}]，造成${damage}点伤害`);
        // event_bus.emit("fight_message",`[${npc[0]}]剩余${this.npc_blood}点生命值`);
        // return damage;
    }

    destroy(){
        console.log("fight:销毁ai_npc");
        event_bus.emit("_fight_destroy","");
        this.Ai_npc.terminate();
        this.fight_mod=0;
    }


    create_Ai_npc(){
        console.log("fight:创建ai_npc");

        this.Ai_npc=new Worker("static/js/inter_screen/bloodScreen_c/personControl_c/ai_npc.js");
        this.Ai_npc.postMessage({"type":"npc","data":this.npc});
        this.Ai_npc.onmessage=(e)=>{
            if(e.data.type=="fight_message"){
                event_bus.emit("fight_message",e.data.data);
            }
            if(e.data.type=="game_over"){
                event_bus.emit("fight_message","------")
                event_bus.emit("fight_message",`战斗结束`);
                // this.Ai_npc.close();

                this.fight_mod=0;
            }
            if(e.data.type=="damage_to_player"){
                // this.player_blood-=e.data.data;
                event_bus.emit("fight_message",`[你]受到了${e.data.data}点伤害`);
                this.player_blood-=e.data.data;
                // event_bus.emit("fight_message",`[你]剩余${this.player_blood}点生命值`);
                if (this.player_blood<=0){
                    event_bus.emit("fight_message",`[你]已死亡`);
                    // this.Ai_npc.terminate();
                    this.destroy();
                    // this.fight_mod=0;
                    event_bus.emit("fight_message","------")
                    event_bus.emit("fight_message","战斗结束");
                }else{
                    event_bus.emit("fight_message","-----");
                }
            }
        }

    }
}












    // figure_attack(npc,player){
    //     console.log("fight:计算伤害");
    //     let damage=0;
    //     if (player[2]>npc[3]){
    //         const pri_damage=player[2]-npc[3];
    //         const range_num=Math.round(pri_damage*(0.8+Math.random()**0.4));
    //         damage=Math.floor(range_num);

    //     }else{
    //         damage=1;
    //     }
    //     this.npc_blood-=damage;
    //     event_bus.emit("fight_message",`[${player[0]}]攻击了[${npc[0]}]，造成${damage}点伤害`);
    //     event_bus.emit("fight_message",`[${npc[0]}]剩余${this.npc_blood}点生命值`);
    //     return damage;
    // }