

import { AU_Button}  from "/static/js/inter_screen/popScreen_c/function_pop/tool_bag/nor_button.js";


export class f_fly{
    constructor(site,size,data,scene){
        this.site=site;
        this.size=size;
        this.data=data;
        this.scene=scene;

        this.x=site[0]+this.size[0]*0.05;
        this.y=site[1]+this.size[1]*0.05;

        this.w=size[0]*0.9;
        this.h=size[1]*0.9;

        this.bagButton_list=[];

    }

    upDescribe(){
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

        let text=this.scene.add.text(this.w*0.05,this.h*0.05,"【飞行】");
        text.setOrigin(0,0);
        text.setFontSize(text_h);
        text.setColor("black");
        this.up_container.add(text);

        this.out_button=new AU_Button(this.w*0.9,this.h*0.07,this.w*0.12,this.h*0.08,"X","f_fly",this.scene);

        this.up_container.add(this.out_button.au_button);


        // let w=this.size[0]*0.1;
        // let h=this.size[1]*0.05;

        let test="123";

        const fix_list=["扬州","南京","万兽山脉"];



        const button_w=this.w*0.25;
        const button_h=this.h*0.1;

        fix_list.forEach((data,num)=>{
            const newButton=new AU_Button(button_w*0.6+num*this.w*0.3,button_h*2,button_w,button_h,data,"f_fly",this.scene);

            this.bagButton_list.push(newButton);
            this.up_container.add(newButton.au_button);

        })

        // this.bagButton_list.forEach((data)=>{
        //     this.up_container.add(data.au_button);
        // })
        this.up_container.setDepth(9);

    }

    run(){
        this.upDescribe();
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