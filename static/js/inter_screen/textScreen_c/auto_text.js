

export class auto_text{
    constructor(site,size,scene){
        this.site=site;
        this.size=size;
        this.scene=scene;
        this.text_list=[];
        this.Max_long=50;
        this.text_long=18;
        this.text_site=[site[0]*1.1,site[1]*1.1];
        this.create();

        this.wait_time=0;
        this.move_y=0;
        this.renew_y=0;

    }


    create(){
        const x=this.text_site[0];
        const y=this.text_site[1];

        let isDragging=false;
        let startX=0;
        let startY=0;
        // let move_y=0;

        // let wait_time=0;

        const maskGraphics=this.scene.add.graphics();
        maskGraphics.fillStyle(0xffffff,0);
        maskGraphics.fillRect(0,0,this.size[0],this.size[1]);

        maskGraphics.setInteractive(
            new Phaser.Geom.Rectangle(0,0,this.size[0],this.size[1]),
            Phaser.Geom.Rectangle.Contains
        );
        maskGraphics.setPosition(this.site[0],this.site[1]);

        maskGraphics.on('pointerdown',(pointer)=>{
            // this.add_text("触摸");
            // startX=pointer.x;
            startY=pointer.y;
            isDragging=true;
        });

        maskGraphics.on('pointermove',(pointer)=>{
            if (isDragging){
                this.wait_time=10;
                // const dx=pointer.x-startX;
                const dy=pointer.y-startY;
                // this.site[0]+=dx;
                // this.site[1]+=dy;
                this.move_y+=dy;

                this.text.setPosition(x,y+this.move_y-this.renew_y);

                // maskGraphics.setPosition(this.site[0],this.site[1]);
                // startX=pointer.x;
                startY=pointer.y;
            }
        });


        window.addEventListener('pointerup',()=>{
            if (isDragging){
                this.wait_time=0;

                isDragging=false;
            }
        });

        this.fontSize=this.size[1] ? Math.ceil(this.size[0] /22):'20px';

        this.fontSizeNum = parseInt(this.fontSize);

        this.lineSpacing = Math.round(this.fontSizeNum * 0.4); 


        // const fontSize=this.size[1] ? Math.ceil(this.size[0] /22):'20px';
        this.text=this.scene.add.text(x,y,"",{
            fontSize:this.fontSizeNum,
            color:"#000",
            align:'left',
            lineSpacing:this.lineSpacing
        })
        this.text.setOrigin(0,0);

        // const maskGraphics=this.scene.add.graphics();
        // maskGraphics.fillStyle(0xffffff);
        // maskGraphics.fillRect(x,y,this.size[0],this.size[1]);
        this.text.mask=new Phaser.Display.Masks.GeometryMask(this.scene,maskGraphics);


        this.add_text("欢迎来到封魔OL");
    }


    add_text(out_text){
        console.log(`auto_text添加文本${out_text}`)

        const x=this.text_site[0];
        const y=this.text_site[1];


        // if(this.text_list.length>this.text_long && this.text_list.length<this.Max_long){
        //     // const fontSize=this.size[1] ? Math.ceil(this.size[0] /22):'20px';
        //     this.renew_y-=this.fontSizeNum+this.lineSpacing;
        //     this.text.setPosition(x,y+this.move_y+this.renew_y);
        // }

        if (this.wait_time==0){
            this.move_y=0;
            this.text.setPosition(x,y+this.move_y-this.renew_y);

        }else{
            this.wait_time--;
        }


        if (this.text_list.length<this.Max_long){
            this.text_list.push(out_text);
        }else{
            this.text_list.shift();
            this.text_list.push(out_text);
        }

        // this.text_list.push(out_text);
        let complex_text=""
        this.text_list.forEach((text)=>{
            complex_text+=text+"\n";
        })
        this.text.setText(complex_text);
        // console.log(`text高度${this.text.height}`)

        if(this.text.height>this.size[1]*0.8){
            // const fontSize=this.size[1] ? Math.ceil(this.size[0] /22):'20px';
            this.renew_y=this.text.height-this.size[1]*0.8;
            this.text.setPosition(x,y+this.move_y-this.renew_y);
        }

    }

}