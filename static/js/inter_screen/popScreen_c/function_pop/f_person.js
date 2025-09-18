

import { AU_Button}  from "/static/js/inter_screen/popScreen_c/function_pop/tool_bag/out_button.js";


export class f_person{
    constructor(site,size,data,scene){
        this.site=site;
        this.size=size;
        this.data=data;
        this.scene=scene;

        this.x=site[0]+this.size[0]*0.05;
        this.y=site[1]+this.size[1]*0.05;

        this.w=size[0]*0.9;
        this.h=size[1]*0.9;

    }

    upDescribe(data=null){
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

        this.out_button=new AU_Button(this.w*0.9,this.h*0.07,this.w*0.12,this.h*0.08,"X","f_person",this.scene);


        this.up_container.add(this.out_button.au_button);


        // let w=this.size[0]*0.1;
        // let h=this.size[1]*0.05;

        let test="123";

        const fix_list=["【人物面板】","姓名:","年龄:","性别:","等级:","经验:"];

        fix_list.forEach((data,num)=>{
            let text=this.scene.add.text(this.w*0.05,this.h*0.05+num*text_h*1.5,data);
            text.setOrigin(0,0);
            text.setFontSize(text_h);
            text.setColor("black");
            this.up_container.add(text);
        })

        if (data){
            // const data_list=data.slice(0,5);
             const data_list=data[0];
            data_list.forEach((data,num)=>{
                let text=this.scene.add.text(this.w*0.25,this.h*0.05+(num+1)*text_h*1.5,data);
                text.setOrigin(0,0);
                text.setFontSize(text_h);
                text.setColor("black");
                this.up_container.add(text);
            })

        }

        this.up_container.setDepth(9);

    }

    downDescribe(data){
        let down_site=[this.w*0.05,this.h*0.55];

        this.down_container=this.scene.add.container(this.x,this.y);
        let text_w=this.size[0]*0.1;
        let text_h=Math.ceil(this.size[1]*0.04);


        const fix_list=["气血:","内力:","精神:","攻击:","防御:","速度:"]

        fix_list.forEach((data,num)=>{

            let text=this.scene.add.text(down_site[0],down_site[1]+num*text_h*1.5,data);
            text.setOrigin(0,0);
            text.setFontSize(text_h);
            text.setColor("black");

            this.down_container.add(text);
        })

        if (data){
            // const data_list=data.slice(5,12);
            const data_list=data[1];
            data_list.forEach((data,num)=>{
                let text=this.scene.add.text(down_site[0]+this.w*0.2,down_site[1]+num*text_h*1.5,data);
                text.setOrigin(0,0);
                text.setFontSize(text_h);
                text.setColor("black");
                this.down_container.add(text);
            })
        }


        this.down_container.setDepth(9);

    }

    run(data=null){
        console.log(`f_person获得${data}`);
        this.upDescribe(data);
        this.downDescribe(data);
    }


    destroy(){
        this.up_container.destroy();
        this.down_container.destroy();
        this.out_button.destroy();

    }



}