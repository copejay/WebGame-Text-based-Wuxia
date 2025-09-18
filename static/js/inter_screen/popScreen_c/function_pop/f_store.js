

import { AU_Button}  from "/static/js/inter_screen/popScreen_c/function_pop/tool_bag/store_button.js";
import {storePopC} from "/static/js/inter_screen/popScreen_c/function_pop/popC/storePopC.js"
import event_bus from "/static/js/event_bus.js";

//store_button是f_store的内部子元素
//storePopC是f_store的操作子弹窗
export class f_store{
    constructor(site,size,data,scene){
        this.site=site;
        this.size=size;
        this.data=data;
        this.scene=scene;

        this.x=site[0];
        this.y=site[1];

        this.w=size[0];
        this.h=size[1];

        this.bagButton_list=[];

        this.storePopC=new storePopC(this.site,this.size,this.data,this.scene);
    }


    upDescribe(data){
        const fix_list=[["九转金丹","黄金",5],["寒冰掌","白银",1],["闪电掌","白银",1]];

        event_bus.off("_Pop_f_store_click");
        //内部点击按钮只传出按钮id
        //都统一由总弹窗进行处理，根据点击的物品传输真实数据交给PopC运行
        event_bus.on("_Pop_f_store_click",(data)=>{
            console.log(`f_store接收内部点击物品:${data[0]}`);
            let buy_thing_data=[];
            for (let i=0;i<fix_list.length;i++){
                if (fix_list[i][0]==data[0]){
                    buy_thing_data=fix_list[i];
                }
            }
            this.storePopC.run(buy_thing_data);
        })

        let text_w=this.size[0]*0.1;
        let text_h=Math.ceil(this.size[1]*0.04);

        this.up_container=this.scene.add.container(this.x,this.y);

        const rect= new Phaser.Geom.Rectangle(0,0,this.w,this.h);

        const darkGray = 0x333333;
        const paperYellow = 0xf5f0e1;
        const deepYellow = 0xe8d9b5;
        const flashYellow = 0xffff66;

        const black = 0x000000;

        this.rectangle=this.scene.add.graphics()
        .fillStyle(0xF8F0FF,1)
        .fillRectShape(rect)
        .lineStyle(1,black)
        .strokeRectShape(rect);
        this.up_container.add(this.rectangle);

        let text=this.scene.add.text(this.w*0.05,this.h*0.05,"【玩家商店】");
        text.setOrigin(0,0);
        text.setFontSize(text_h);
        text.setColor("black");
        this.up_container.add(text);

        this.out_button=new AU_Button(this.w*0.9,this.h*0.07,this.w*0.12,this.h*0.08,"X","f_store",this.scene);

        this.up_container.add(this.out_button.au_button);


        // let w=this.size[0]*0.1;
        // let h=this.size[1]*0.05;

        let test="123";

        // const fix_list=["寒冰掌","闪电掌","吸星大法"];
        // const fix_list=[["寒冰掌","白银",1],["闪电掌","白银",1]];




        const button_w=this.w*0.36;
        const button_h=this.w*0.16;
        let level=0;
        let column=0;
        fix_list.forEach((data,num)=>{
            if (num%2==0){
                level+=1;
                column=0;
            }
            const newButton=new AU_Button(button_w*0.75+column*this.w*0.45,button_h*0.5+button_h*1.3*level,button_w,button_h,[data[0],data[1],data[2]],"f_store",this.scene);
            this.bagButton_list.push(newButton);
            this.up_container.add(newButton.au_button);
            column+=1;

            // }else{
            //     const newButton=new AU_Button(button_w*1+(num-level*2)*this.w*0.3,button_h*1.6,button_w,button_h,[data[0],data[1]],"f_magic",this.scene);

            //     this.bagButton_list.push(newButton);
            //     this.up_container.add(newButton.au_button);

            

        })

        // this.bagButton_list.forEach((data)=>{
        //     this.up_container.add(data.au_button);
        // })
        this.up_container.setDepth(9);

    }


    run(data=null){
        this.upDescribe(data);
        // this.downDescribe();
    }

    
    destroy_buttons(){
        this.bagButton_list.forEach((data)=>{
            data.destroy();
        })
    }


    destroy(){
        this.destroy_buttons();
        this.up_container.destroy();
        // this.down_container.destroy();
        this.out_button.destroy();

    }

}