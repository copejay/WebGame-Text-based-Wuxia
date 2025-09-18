import event_bus from "/static/js/event_bus.js";

export class AU_Button{
    constructor(x,y,width,height,id,own,scene){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        // this.info_list=info_list;

        this.id=`${id[0]}`;
        this.equipped=id[1];
        this.level=id[2];

        this.own=own;

        // this.describe=info_list[2];
        this.out_text=this.id;
        this.scene=scene;
        this.create();
        this.addListen();
    }

    create(){
        this.au_button= this.scene.add.container(this.x,this.y).setName(this.id);
        const darkGray = 0x333333;
        const paperYellow = 0xf5f0e1;
        const black = 0x000000;
        const background = this.scene.add.rectangle(0, 0,this.width, this.height, darkGray)
        .setInteractive()
        .on('pointerdown', () => {
            background.setFillStyle(black); // 按下效果
            // event_bus.emit("Person_click",this.info_list);
            if (this.id=="X"){
                event_bus.emit("Pop_out",`${this.own}`);
            }else{
                event_bus.emit(`_Pop_${this.own}_click`,[this.id,"describe"]);

            }

            // event_bus.emit("Pop_bag_click",this.id);

        })
        .on('pointerup', () => background.setFillStyle(darkGray))
        .on('pointerout', () => background.setFillStyle(darkGray));
       
        this.au_button.add(background)

        let Q_fontSize=this.height*0.3;
        this.equipped_dot=this.scene.add.text(this.width*0.35,this.height*0.2,"正",{
            fontSize:Q_fontSize,
            color:"#06f6a2ff",
            align:'center'
        });
        this.equipped_dot.setOrigin(0.5);

        if (this.equipped==1){
            this.equipped_dot.setText("正");
        }else{
            this.equipped_dot.setText("");
        }
        this.au_button.add(this.equipped_dot);


        let fontSize=0;
        if (this.id.length>=4){
            fontSize=Math.ceil(this.width*0.12);

        }
        else if(this.id=="X"){
            fontSize=this.height*0.8;
        }
        else{
            fontSize=Math.ceil(this.width*0.15);
        }
        // const fontSize=this.height*0.4
        let up_site_y=0;
        let down_site_y=0;
        let up_text="";
        let down_text="";

        if (this.id.length>=4){
            up_site_y=-this.height/6;
            down_site_y=this.height/6;
            up_text=this.id.slice(0,6);
            down_text=`lv.${this.level}`;
        }else{
            up_site_y=0;
            down_site_y=0;
            up_text=this.id;
            down_text=this.level;
        }


        this.text= this.scene.add.text(0,up_site_y,up_text,{
            fontSize:fontSize,
            color:"#fff",
            align:'center'
        });
        this.text.setOrigin(0.5);
        this.au_button.add(this.text);

        this.text_down= this.scene.add.text(0,down_site_y,down_text,{
            fontSize:fontSize,
            color:"#fff",
            align:'center'
        });
        this.text_down.setOrigin(0.5);
        this.au_button.add(this.text_down);

    }

    re_text(text){
        this.id=text;
        this.text.setText(text);
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
            console.log("Person click");
        });
    }

    // 添加删除方法
    destroy() {
        // 移除所有事件监听
        if (this.background) {
            this.background.off('pointerdown');
            this.background.off('pointerup');
            this.background.off('pointerout');
        }
        
        if (this.au_button) {
            this.au_button.off('pointerdown');
            // 从场景中移除容器及其所有子元素
            this.au_button.destroy({ children: true });
        }
        
        // 清理引用
        this.scene = null;
        this.background = null;
        this.text = null;
        this.au_button = null;
    }
}