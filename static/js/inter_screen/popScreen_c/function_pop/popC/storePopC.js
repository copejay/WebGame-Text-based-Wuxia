

import { Rectangle } from "./tool/rectangle.js";
import { AU_Button } from "./tool/buttonPop.js";

import event_bus from "/static/js/event_bus.js"


export class storePopC{
    constructor(site,size,data,scene){
        this.site=site;
        this.size=size;
        //初始化时，数据未更新，需要在run函数里面更新
        this.buy_name=data[0];
        this.buy_num=1;
        this.buy_value=data[1];
        this.value_num=data[2];
        this.data=data;
        this.scene=scene;
        this.create();
        this.display();

    }


    create(){
        this.PersonPop=this.scene.add.container();

        const wh=[this.size[0]*0.88,this.size[1]*0.45];
        const xy=[this.site[0]+this.size[0]*0.06,this.site[1]+this.size[1]*0.2];
        this.button_list=[];

        this.rect=new Rectangle(xy[0],xy[1],wh[0],wh[1],this.scene); 
        this.PersonPop.add(this.rect.rectangle);


        const math_name=Math.ceil(wh[1]*0.09);

        this.name_text=this.scene.add.text(xy[0]+wh[1]*0.1,xy[1]+wh[1]*0.1,"name",{
            fontSize:math_name,
            color:"#000",
            align:'center'
        });
        this.PersonPop.add(this.name_text);

        const math_describe=Math.ceil(wh[1]*0.08);

        this.describe_text=this.scene.add.text(xy[0]+wh[1]*0.15,xy[1]+wh[1]*0.3,"describe",{
            fontSize:math_describe,
            color:"#000",
            align:'center'
        });
        this.PersonPop.add(this.describe_text);


        this.describe_text_two=this.scene.add.text(xy[0]+wh[1]*0.15,xy[1]+wh[1]*0.42,"",{
            fontSize:math_describe,
            color:"#000",
            align:'center'
        });
        this.PersonPop.add(this.describe_text_two);


        this.out_button=new AU_Button(xy[0]+wh[0]*0.9,xy[1]+wh[1]*0.1,wh[0]*0.1,wh[0]*0.1,"X","storePopC",this.scene);

        this.PersonPop.add(this.out_button.au_button);


        for (let i = 0; i < 2; i++) {
            const x=xy[0]+wh[0]*0.2;
            const y=xy[1]+wh[1]*0.8;
            const w=wh[0]*0.2;
            const h=wh[1]*0.2;

            this.button_list.push(new AU_Button(x+w*1.2*i,y,w,h,"NULL","storePopC",this.scene));

            this.PersonPop.add(this.button_list[i].au_button);
        }
        this.renew();
        this.PersonPop.setDepth(10);
        this.addListen();

    }

//内置按钮只接收点击，返回点击信息，其余都由操作弹窗处理
    addListen(){
        const npc=["野狼",100,1,1,1];
        const player=["古月方源",100,20,10,1];

        event_bus.on("_storePopC_click",(click)=>{

            console.log(`storePopC_click${click}`);
            if (click=="取消"){
                this.destroy();
            }
            else if (click=="X"){
                this.destroy();
            }
            else if (click=="购买"){
                console.log("storePopC_buy");
                event_bus.emit("storePopC_buy",[this.buy_name,this.buy_num,this.buy_value,this.value_num]);
                this.destroy();
            }
            // else if (click=="停止"){
            //     console.log("storePopC_stop");
            //     event_bus.emit("storePopC_stop",this.data[0]);
            //     this.destroy();
            // }
            // else if (click=="遗忘"){
            //     console.log("storePopC_forget");
            //     event_bus.emit("storePopC_forget",this.data[0]);
            //     this.destroy();
            // }


            // if(data=="攻击"){
            //     event_bus.emit("Pop_fight_begin",[npc,player]);
            // }
        })
    }

    renew(){
        const name_list=["购买","取消"];
        name_list.forEach((name,num)=>{
            this.button_list[num].re_text(name);
        });
    }

    display(){
        this.PersonPop.visible=false;
    }

    destroy(){
        this.PersonPop.visible=false;
    }


    run(buy_thing_data){
        console.log(`storePopC接收数据:${buy_thing_data}`)
        this.buy_name=buy_thing_data[0];
        this.buy_num=1;
        this.buy_value=buy_thing_data[1];
        this.value_num=buy_thing_data[2];

        const name=`【${buy_thing_data[0]}】`;
        const describe=buy_thing_data[1];
        this.data=buy_thing_data;

        this.name_text.setText(name);

        this.describe_text.setText("");
        this.describe_text_two.setText("");

        if (describe.length<=17){
            this.describe_text.setText(describe);
        }else{
            this.describe_text.setText(describe.substring(0,17));
            this.describe_text_two.setText(describe.substring(17));
        }
        this.PersonPop.visible=true;
    }

}