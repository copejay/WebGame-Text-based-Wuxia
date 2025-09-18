

class Ai_npc{
    constructor(npc){
        this.npc=npc;
        this.name=npc[0];
        this.blood=npc[1];
        this.attack=npc[2];
        this.defense=npc[3];
        this.speed=npc[4];
        this.busy_time=2;
        this.mod="live";
    }

    fighting(){
        const fight=setInterval(()=>{
            if(this.mod=="live"){
                self.postMessage({"type":"fight_message","data":`[${this.name}]攻击了[你]`});

                self.postMessage({"type":"damage_to_player","data":this.attack});
            }else{
                clearInterval(fight);
            }
        },this.busy_time*1000);
    }

    died(){
        this.mod="died";
    }

}



self.onmessage=function(e){
    console.log("ai_npc收到消息",e.data);

    if(e.data.type=="npc"){
        this.fight_npc=new Ai_npc(e.data.data);
        this.fight_npc.fighting();

    }
    if(e.data.type=="damage_to_npc"){
        let damage=e.data.data-this.fight_npc.defense;
        if(damage<=0){
            damage=1;
            this.fight_npc.blood-=1;
        }else{
            this.fight_npc.blood-=damage;
        }
        self.postMessage({"type":"fight_message","data":`[${this.fight_npc.name}]受到了${damage}点伤害`});
        self.postMessage({"type":"fight_message","data":"-----"});

        if(this.fight_npc.blood<=0){
            self.postMessage({"type":"fight_message","data":`[${this.fight_npc.name}]死亡`});
            this.fight_npc.died();

            self.postMessage({"type":"game_over"})
            self.close();
        }
    }
}