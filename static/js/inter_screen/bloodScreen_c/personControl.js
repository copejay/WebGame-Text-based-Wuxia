
import event_bus from "/static/js/event_bus.js"

import {Cultivation} from "/static/js/inter_screen/bloodScreen_c/personControl_c/cultivation.js"
import {Fight} from "/static/js/inter_screen/bloodScreen_c/personControl_c/fight.js"

//人物行为总控

class PersonControl{
    constructor(){
        this.person_cultivation_busy=false;
        this.person_fight_busy=false;

        this.cultivation=new Cultivation();
        this.fight=new Fight();
        //内部通信代表仅被父模块接收信息
        event_bus.on("_cultivation_magic_num",(data)=>{
            event_bus.emit("personControl_cultivation_num",data)
            console.log("收到人物修炼成果",data);
        })
    }

    check_busy(){
        this.person_cultivation_busy=this.cultivation.check_busy();
        this.person_fight_busy=this.fight.check_busy();
        if(this.person_cultivation_busy==false && this.person_fight_busy==false){
            return false;
        }else{
            return true;
        }
    }

    start_cultivation(){
        if(this.check_busy()==false){
            event_bus.emit("cultivation_message","你静心打坐，开始了修炼...");
            console.log("personControl:开始修炼");
            this.cultivation.run();
        }else{
            event_bus.emit("cultivation_message","你现在正忙着呢...");
        };
    }

    stop_cultivation(){
        if(this.check_busy()==true){
            if(this.person_cultivation_busy==true){
                console.log("personControl:停止修炼");
                this.cultivation.destroy();
                event_bus.emit("cultivation_message","你长长呼出一口气，停止了修炼...");
            }else{
                console.log("personControl:无事");
            }
        }else{
            console.log("personControl:无事");
        }
    }


    start_fight(fight_data){
        if(this.check_busy()==false){
            event_bus.emit("fight_message",`你向${fight_data[0][0]}发起了攻击！`);
            this.fight.fight_begin(fight_data[0],fight_data[1]);
        }else{
            event_bus.emit("fight_message","你现在正忙着呢...");
        }
    }

    person_move(){

    }
}

export default new PersonControl();

//使用单例导出，方便再move中进行引用，判断人物是否忙碌