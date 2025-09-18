
import { BloodRect } from '/static/js/inter_screen/bloodScreen_c/blood_rect.js';
import {localDb_p} from "/static/js/inter_screen/bloodScreen_c/localDb_p.js";
import event_bus from '/static/js/event_bus.js';
import socket from '/static/js/db_io/io_socket.js';



export class bloodScreen{
    constructor(size,scene){
        this.size=size;
        this.scene=scene;
        this.localDb_p=new localDb_p();

    }

    create(){
        const xy=[this.size[0]*0.01,this.size[1]*0.873];

        const xy_r1=[this.size[0]*0.01,this.size[1]*0.873];
        const wh=[this.size[0]*0.32,this.size[1]*0.018];

        const xy_r2=[xy[0],xy[1]+wh[1]*1.2];
        const wh_m=[wh[0],wh[1]];

        const xy_c1=[xy[0]+this.size[0]*0.33,xy[1]];
        const wh_c1=[wh[0],wh[1]];

        const xy_c2=[xy[0]+this.size[0]*0.33,xy[1]+wh[1]*1.2];
        const wh_c2=[wh[0],wh[1]];


        const xy_l1=[xy[0]+this.size[0]*0.66,xy[1]];
        const wh_n=[wh[0],wh[1]];

        const xy_l2=[xy[0]+this.size[0]*0.66,xy[1]+wh[1]*1.2];
        const wh_j=[wh[0],wh[1]];

        this.bloodRect=new BloodRect(xy_l1,wh,this.scene);
        this.bloodRect.create("气血","null",50,100,"blood");

        this.magicRect=new BloodRect(xy_l2,wh_m,this.scene);
        this.magicRect.create("内力","null",70,100,"magic");

        this.brainRect=new BloodRect(xy_c1,wh_c1,this.scene);
        this.brainRect.create("精神","null",50,100,"brain");

        this.expRect=new BloodRect(xy_c2,wh_c2,this.scene);
        this.expRect.create("经验","null",50,100,"exp");

        this.nameRect=new BloodRect(xy_r1,wh_n,this.scene);
        this.nameRect.create("姓名","NULL",100,100,"name");

        this.levelRect=new BloodRect(xy_r2,wh_j,this.scene);
        this.levelRect.create("境界","宗师中期",100,100,"level");

        // event_bus.on("update_userNews",(data)=>{
        //     this.update_name(data);
        // })
        event_bus.on("localDb_panel_data",(data)=>{
            this.update_name(data[0]);
            this.update_level(data[1]);
            this.update_spirit(data[2]);
            this.update_exp(data[3]);
            this.update_blood(data[4]);
            this.update_magic(data[5]);
            // this.update_level();
        })


        event_bus.on("function_click",(data)=>{
            if(data=="人物"){
                // socket.emit("ask_player_info");
                // socket.off("response_player_info");
                console.log("click person");
                // socket.on("response_player_info",(data)=>{
                //     console.log(`接收信息${data.data}`);
                //     this.update_name(data.data);
                // })
            }
            if(data=="飞行"){
                socket.emit('create_character',"上官金虹");
            }

            if(data=="武功"){
                socket.emit('create_character',"李寻欢");
            }
            if(data=="背包"){
                socket.emit('create_character',"司空摘星");

            }


        })
    }

    update_name(name){
        this.nameRect.update("姓名",name,100,100,"name");
    }

    update_level(level){
        this.levelRect.update("境界",level,100,100,"level");
    }

    update_spirit(data){
        this.brainRect.update("精神","null",data[0] ,data[1],"brain");
    }

    update_exp(data){
        this.expRect.update("经验","null",data[0],data[1],"exp");

    }


    update_blood(data){
        this.bloodRect.update("气血","null",data[0],data[1],"blood");
    }

    update_magic(data){
        this.magicRect.update("内力","null",data[0],data[1],"magic");
    }

}