

import { AU_Button}  from "/static/js/inter_screen/popScreen_c/function_pop/tool_bag/bag_button.js";
import {bagPopC} from "/static/js/inter_screen/popScreen_c/function_pop/popC/bagPopC.js"
import event_bus from "/static/js/event_bus.js";




export class f_bag{
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

        this.bagPopC=new bagPopC(this.site,this.size,['null','null'],this.scene);


    }

    create(data=null){
        event_bus.off("_Pop_f_bag_click");

        event_bus.on("_Pop_f_bag_click",(data)=>{
            console.log(`f_bag,收到内部点击${data}`);
            this.bagPopC.run(data);
        })


        let text_w=this.size[0]*0.1;
        let text_h=Math.ceil(this.size[1]*0.04);


        this.up_container=this.scene.add.container(this.x,this.y);

        const rect= new Phaser.Geom.Rectangle(0,0,this.w,this.h);

        this.rectangle=this.scene.add.graphics()
        .fillStyle(0xF8F0FF,1)
        .fillRectShape(rect)
        .lineStyle(1,0xff0000)
        .strokeRectShape(rect);
        this.up_container.add(this.rectangle);

        let text=this.scene.add.text(this.w*0.05,this.h*0.05,"【背包】");
        text.setOrigin(0,0);
        text.setFontSize(text_h);
        text.setColor("black");
        this.up_container.add(text);


        this.out_button=new AU_Button(this.w*0.9,this.h*0.07,this.w*0.12,this.h*0.08,"X",1,this.scene);

        this.up_container.add(this.out_button.au_button);


        // let w=this.size[0]*0.1;
        // let h=this.size[1]*0.05;

        let test="123";

        let fix_list=["姓名:","年龄:","性别:","姓名:","年龄:","性别:"];

        if(data!=null){
            fix_list=data;
        }


        const button_w=this.w*0.28;
        const button_h=this.h*0.11;

        let level=0;
        let row=-1;

        fix_list.forEach((data,num)=>{
            row+=1;
            if(num%3==0){
                level+=1;
                row=0;
                const newButton=new AU_Button(button_w*0.6+row*this.w*0.32,button_h*1.2*(0.5+level),button_w,button_h,data[0],data[1],this.scene);
                this.bagButton_list.push(newButton);
                this.up_container.add(newButton.au_button);
            }else{
                const newButton=new AU_Button(button_w*0.6+row*this.w*0.32,button_h*1.2*(0.5+level),button_w,button_h,data[0],data[1],this.scene);
                this.bagButton_list.push(newButton);
                this.up_container.add(newButton.au_button);
            }
        })

        // this.bagButton_list.forEach((data)=>{
        //     this.up_container.add(data.au_button);
        // })
        this.up_container.setDepth(9);

    }

    run(data=null){
        this.create(data);
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
        this.bagPopC.destroy();
        event_bus.off("_Pop_f_bag_click");


    }



}