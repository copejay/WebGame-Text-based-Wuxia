import event_bus from "/static/js/event_bus.js";

export class AU_Button_ac{
    constructor(x,y,width,height,id,scene){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.mod="normal";

        this.id=id;
        this.out_text=id;
        this.scene=scene;
        this.create();
        this.addListen();
    }

    create(){
        this.au_button= this.scene.add.container(this.x,this.y).setName(this.id);
        const background = this.scene.add.rectangle(0, 0,this.width, this.height, 0xe94560)
        .setInteractive()
        .on('pointerdown', () => {
            background.setFillStyle(0xca1f48); // 按下效果
            if(this.mod=="fight"){
                if (this.id=="返回"){
                    event_bus.emit("allControl_click",this.id);
                }else{
                    event_bus.emit("allControl_click",this.id);
                }
            }else{
                event_bus.emit("allControl_click",this.id);
            }
            // event_bus.emit("function_click",this.id);
        })
        .on('pointerup', () => background.setFillStyle(0xe94560))
        .on('pointerout', () => background.setFillStyle(0xe94560));
       
        this.au_button.add(background)


        const x=0;
        const y=0;
        const fontSize=this.height*0.3;
        // const fontSize=this.size[1] ? Math.ceil(this.size[0] /22):'20px';
        this.text=this.scene.add.text(x,y,"",{
            fontSize:fontSize,
            color:"#f9f2f2ff",
            align:'center',
            lineSpacing:fontSize*0.3
        })
        this.text.setOrigin(0.5);
        this.au_button.add(this.text);
        this.au_button.add(this.text);

    }


    re_text(text){
        if (text[0]=="f"){
            console.log("战斗模式切换");
            this.mod="fight";
            this.id=text.slice(1);
        }else{
            this.mod="normal";
            this.id=text;

        }
        const old_text=this.id;
        if(old_text.length<=3){
            this.text.setText(old_text);
        }else{
            this.text.setText("");
            let complex_text=old_text.slice(0,2)+"\n"+old_text.slice(2);
            this.text.setText(complex_text);
        }
        // this.text.setText(text);
    }

    disPlay(){
        this.au_button.setVisible(false);
    }

    run(){
        this.au_button.setVisible(true);
    }

    addListen(){
        this.au_button.setSize(this.width,this.height);
        this.au_button.setInteractive();
        this.au_button.on('pointerdown',()=>{
            // this.reNew();
            console.log("click");
        });
    }
}