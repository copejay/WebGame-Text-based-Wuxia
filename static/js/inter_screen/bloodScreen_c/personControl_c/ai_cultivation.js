

class Ai_cultivation{
    constructor(){
        this.mod="run";
        this.magic_name="";
        this.cultivation_time=3;
        this.cycle_num=0;
        this.all_magic=0;

    }

    run(magic_name){
        this.all_magic=0;
        this.magic_name=magic_name;
        this.mod="run";
        this.cultivation();
    }

    cultivation(){
        const cultivation=setInterval(()=>{
            if(this.mod=="run"){
                this.cycle_num++;
                let magic_num=Math.floor(Math.random()*100);
                this.all_magic+=magic_num;
                self.postMessage
                ({"type":"cultivation_message","data":`[你正在修炼${this.magic_name}...]  [第${this.cycle_num}轮]经验值增加【${magic_num}】`});
                self.postMessage({"type":"cultivation_magic_num","data":magic_num});
                self.postMessage({"type":"cultivation_all_magic","data":this.all_magic});
            }else{
                clearInterval(cultivation);
            }
        },this.cultivation_time*1000)
    }
}

self.onmessage=function(e){
    console.log("ai_cultivation收到消息",e.data);

    if(e.data.type=="打坐练功"){
        // this.fight_npc=new Ai_npc(e.data.data);
        // this.fight_npc.fighting();
        // this.cultivation=new Ai_cultivation(e.data.data);
        this.Ai_cultivation=new Ai_cultivation();
        this.Ai_cultivation.run(e.data.data);
        // this.cultivation.cultivation();
    }
}