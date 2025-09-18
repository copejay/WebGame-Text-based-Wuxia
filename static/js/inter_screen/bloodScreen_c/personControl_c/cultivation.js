import event_bus from "/static/js/event_bus.js"
    
//负责提供接口给外部调用
export class Cultivation{

    constructor(){
        this.cultivation_mod=false;
        // event_bus.on("localDb_cultivation_begin",()=>{
        //     console.log("开始修炼");
        // })
    }

    check_busy(){
        if(this.cultivation_mod==false){
            return false;
        }else{
            return true;
        }
    }

    run(){
        if(this.cultivation_mod==false){
            this.cultivation_mod=true;
            this.create_ai_cultivation();
        }else{
            event_bus.emit("_cultivation_is_running","");
            // event_bus.emit("cultivation_message","你正在修炼中...")
        }
    }

    destroy(){
        this.cultivation.terminate();
        this.cultivation_mod=false;
        event_bus.emit("_cultivation_destroy","");
    }

    
    create_ai_cultivation(){
        this.cultivation=new Worker("static/js/inter_screen/bloodScreen_c/personControl_c/ai_cultivation.js");
        this.cultivation.postMessage({"type":"打坐练功","data":"化灵经"});
        this.cultivation.onmessage=(e)=>{
            if(e.data.type=="cultivation_message"){
                event_bus.emit("cultivation_message",e.data.data);
            }
            //这边接收线程消息，通过event_bus传出数据
            if(e.data.type=="cultivation_magic_num"){
                // this.person_base_data[4]+=e.data.data;
                // this.auto_figure();
                event_bus.emit("_cultivation_magic_num",e.data.data);
            }
            if(e.data.type=="cultivation_all_magic"){
                // this.person_fight_data[2]+=e.data.data;
                event_bus.emit("_cultivation_all_magic",e.data.data);
                // this.all_cultivation_magic_data=e.data.data;
                // event_bus.emit("cultivation_message",`本轮修炼共计获得了${e.data.data}点经验值`);
            }
        }
    }

}