

import { Rectangle } from "./tool/rectangle.js";
import { AU_Button } from "./tool/buttonPop.js";

import event_bus from "/static/js/event_bus.js"


export class bagPopC{
    constructor(site,size,data,scene){
        this.site=site;
        this.size=size;
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


        this.out_button=new AU_Button(xy[0]+wh[0]*0.9,xy[1]+wh[1]*0.1,wh[0]*0.1,wh[0]*0.1,"X","bagPopC",this.scene);

        this.PersonPop.add(this.out_button.au_button);


        for (let i = 0; i < 3; i++) {
            const x=xy[0]+wh[0]*0.2;
            const y=xy[1]+wh[1]*0.8;
            const w=wh[0]*0.2;
            const h=wh[1]*0.2;

            this.button_list.push(new AU_Button(x+w*1.2*i,y,w,h,"NULL","bagPopC",this.scene));

            this.PersonPop.add(this.button_list[i].au_button);
        }
        this.renew();
        this.PersonPop.setDepth(10);
        this.addListen();

    }


    addListen(){
        const npc=["野狼",100,1,1,1];
        const player=["古月方源",100,20,10,1];

        event_bus.on("_bagPopC_click",(click)=>{

            console.log(`bagPopC_click${click}`);
            if (click=="取消"){
                this.destroy();
            }
            else if(click=="X"){
                this.destroy();
            }
            else if (click=="使用"){
                console.log("bagPopC_use");
                event_bus.emit("bagPopC_use",this.data);
            }


            // if(data=="攻击"){
            //     event_bus.emit("Pop_fight_begin",[npc,player]);
            // }
        })
    }

    renew(){
        const name_list=["使用","取消","丢弃"];
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


    run(data){
        console.log(`pop接收数据:${data}`)

        const name=`【${data[0]}】`;
        const describe=data[1];
        this.data=data;

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