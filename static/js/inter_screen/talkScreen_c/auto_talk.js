

import { AU_Button } from "./button_talk.js";
import event_bus from "/static/js/event_bus.js";

export class auto_talk{
    constructor(site,size,scene){
        this.site=site;
        this.size=size;
        this.scene=scene;
        // this.text_list=[];
        this.text_long=3;
        const begin_line=this.size[1]*0.1;
        this.text_site=[site[0]+begin_line,site[1]+begin_line];

        this.Max_long=30;
        this.text_list=[];
        // this.talk_text="";

        this.move_y=0;
        this.renew_y=0;
        this.wait_time=0;
        this.timer=null;

        this.create();
        
    }

    create(){

        let isDragging=false;
        let startX=0;
        let startY=0;
        const x=this.text_site[0];
        const y=this.text_site[1];

        const maskGraphics=this.scene.add.graphics();
        maskGraphics.fillStyle(0xffffff,0);
        maskGraphics.fillRect(0,0,this.size[0],this.size[1]);

        maskGraphics.setInteractive(
            new Phaser.Geom.Rectangle(0,0,this.size[0],this.size[1]),
            Phaser.Geom.Rectangle.Contains
        );
        maskGraphics.setPosition(this.site[0],this.site[1]);

        maskGraphics.on('pointerdown',(pointer)=>{
            if (this.timer) {
                clearTimeout(this.timer); // 清除计时器
                this.timer = null; // 重置计时器变量
            }
            // this.add_text("触摸");
            // startX=pointer.x;
            startY=pointer.y;
            isDragging=true;
        });

        maskGraphics.on('pointermove',(pointer)=>{
            if (isDragging){
                if (this.timer) {
                    clearTimeout(this.timer); // 清除计时器
                    this.timer = null; // 重置计时器变量
                }
                this.wait_time=10;
                // const dx=pointer.x-startX;
                const dy=pointer.y-startY;
                // this.site[0]+=dx;
                // this.site[1]+=dy;
                this.move_y+=dy;

                this.talk_text.setPosition(x,y+this.move_y-this.renew_y);

                // maskGraphics.setPosition(this.site[0],this.site[1]);
                // startX=pointer.x;
                startY=pointer.y;
            }
        });


        window.addEventListener('pointerup',()=>{
            if (isDragging){
                this.wait_time=0;

                isDragging=false;

                this.timer = setTimeout(() => {
                    this.move_y=0;
                    this.talk_text.setPosition(x,y+this.move_y-this.renew_y);
                    // this.move_y=0;
                    console.log('已超过3秒');
                }, 3000); // 3000毫秒 = 3秒
            }
        });
        // this.talk_text.setMask(maskGraphics);
        // this.add_text("hello world");

        // const x=this.site[0]+this.size[0]*0.88;
        // const x=this.site[0];
        // const y=this.site[1]+this.size[1]*0.7;
        const w=this.size[0]*0.2;
        const h=this.size[1]*0.3;

        this.fontSize=this.size[0] ? Math.ceil(this.size[0] /28):'20px';
        this.fontSizeNum = parseInt(this.fontSize);
        this.lineSpacing = Math.round(this.fontSizeNum * 0.6); 

        this.talk_text=this.scene.add.text(x,y,"",{
            fontSize:this.fontSizeNum,
            color:"#000",
            align:'left',
            lineSpacing:this.lineSpacing
        })
        this.talk_text.setOrigin(0,0);

        this.talk_text.mask=new Phaser.Display.Masks.GeometryMask(this.scene,maskGraphics);

        // this.talk_button=new AU_Button(x,y,w,h,"聊天",this.scene);

        event_bus.on("talk_renew",(data)=>{
            for (let row of data){
                let text=row[1]+":"+row[2];
                this.add_text(text);
            }
        })
    }


    add_text(out_text){
        const x=this.text_site[0];
        const y=this.text_site[1];

        if (this.text_list.length<this.Max_long){
            this.text_list.push(out_text);
        }else{
            this.text_list.shift();
            this.text_list.push(out_text);
        }

        let complex_text=""
        this.text_list.forEach((text)=>{
            complex_text+=text+"\n";
        })
        this.talk_text.setText(complex_text);

        if(this.talk_text.height>this.size[1]*0.8){
            // const fontSize=this.size[1] ? Math.ceil(this.size[0] /22):'20px';
            this.renew_y=this.talk_text.height-this.size[1]*1;
            this.talk_text.setPosition(x,y+this.move_y-this.renew_y);
        }

    }

}