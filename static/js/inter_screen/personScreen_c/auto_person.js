import event_bus from "/static/js/event_bus.js";
import {AU_Button} from "/static/js/inter_screen/personScreen_c/p_button.js";

// import {Fight} from "/static/js/inter_screen/personScreen_c/fight.js"



export class Auto_person{
    constructor(site,size,scene){
        this.site=site;
        this.size=size;
        this.scene=scene;
        // this.listen_to_listen();
        this.name_list=["毒蛇","野狗","僵尸","古剑尊残魂","炼天魔尊","CopeJay"];

        this.npc_name_list=[];

        this.character_info_list=[[1,"稻草人","男",1,1,1,1]];

        this.npc_info_list=[];

        this.person_list=[];
    }

    create(){
        // this.fight=new Fight();
        this.listen_to_listen();

        event_bus.on("Move",data=>{
            console.log(`人物移动到${data}`);
            // event_bus.off("gift_lowNpc_info");
            this.choose_npc();

            this.renew_person_info_list();
        })
    }

    choose_npc(){
        const count= Math.random()>0.5?3:2;
        this.npc_name_list=[];
        const availableNames=[...this.name_list];
        for(let i=0;i<count;i++){
            if (availableNames.length===0) break;
            const randomIndex=Math.floor(Math.random()*availableNames.length);
            const selectedName=availableNames.splice(randomIndex,1)[0];
            this.npc_name_list.push(selectedName);
        }
    }

    listen_to_listen(){
        event_bus.on("gift_search_room_other",(data)=>{
             let character_list=[];
            if(data=="None"){
                // console.log("获取到他人信息为空");
                // this.character_info_list=character_list;
                // this.renew();
                // return;
                let n=1;
            }else{
                console.log("获取到他人信息",data);
                // let character_list=[];
                data.forEach((item)=>{
                    let num=1;
                    let name=item[0];
                    let sex=item[2];
                    let blood=100;
                    let atc=100;
                    let def_=100;
                    let speed=100;
                    let character_one=[num,name,sex,blood,atc,def_,speed];
                    character_list.push(character_one);
                })
            }
            this.character_info_list=character_list;
            this.renew();
        })
    }

    renew_person_info_list(){
        this.npc_info_list=[];
        event_bus.emit("Person_beg_lowNpc_info",this.npc_name_list);
        console.log("请求获取lowNpc信息");

        let num=0;
        //这里发生过一个十分诡异的bug，因为对于event_bus的运行原理不了解导致的，多次监听导致该事件包含了多个回调函数，off在这种情况下达不到我预期的效果
        event_bus.once("gift_lowNpc_info",(data)=>{
            this.npc_info_list=data;
            this.renew();
            console.log("获取到lowNpc信息,更新角色列表");
            num++;
            console.log(`执行第${num}次`);
            // event_bus.off("gift_lowNpc_info");
        })
        // event_bus.off("gift_lowNpc_info");
    }

    renew(){
        const w=this.size[0]*0.85;
        const h=w*0.7;
        const x=this.site[0]+this.size[0]*0.5;
        const y=this.site[1]+h*0.5+h*0.1;

        this.person_list.forEach(person=>{
            person.destroy();
        })
        let person_num=0;

        this.npc_info_list.forEach((data,num)=>{
            this.person_list.push(new AU_Button(x,y+num*h*1.15,w,h,data,this.scene));
            person_num++;
        })

        if (this.character_info_list.length>0){
            this.character_info_list.forEach((data,num)=>{
                this.person_list.push(new AU_Button(x,y+(person_num+num)*h*1.15,w,h,data,this.scene));
                person_num++;
            })
        }
    }

}