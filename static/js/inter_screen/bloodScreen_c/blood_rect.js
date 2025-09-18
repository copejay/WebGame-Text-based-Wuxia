// import {localDb_p} from "/static/js/inter_screen/bloodScreen_c/localDb_p.js";


export class BloodRect{
    constructor(site,size,scene){
        this.site=site;
        this.size=size;
        this.scene=scene;
        this.color=0xff0000;
        this.text="null";

    }

    create(be_text,af_text,now_blood=66,max_blood=66,style){

        const x=this.site[0];
        const y=this.site[1];
        const width=this.size[0];
        const height=this.size[1];
        const percent=now_blood/max_blood;
        if (style=="blood"){
            this.color=0xff0000;
            this.text=`${now_blood}/${max_blood}`

            console.log(style);
        }
        else if(style=="magic"){
            this.color=0x0000ff;
            this.text=`${now_blood}/${max_blood}`

        }
        else if(style=="name"){
            this.color=0x333333;
            this.text=af_text;
        }
        else if(style=="level"){
            this.color=0x333333;
            this.text=af_text;
        }
        else if(style=="exp"){
            this.color=0xFF69B4;
            this.text=`${now_blood}/${max_blood}`
        }
        else if(style=="brain"){
            this.color=0x330066;
            this.text=`${now_blood}/${max_blood}`
        }



        // else{
        //     this.color=0xff0000;
        // }

        this.healthBar = this.scene.add.graphics();
        this.healthBar.fillStyle(0x333333);
        this.healthBar.fillRect(x,y,width,height);
        this.healthBar.fillStyle(this.color);
        this.healthBar.fillRect(x,y,width*percent,height);

        this.beforeText=this.scene.add.text(x+height*0.1,y+height*0.1,be_text,{
            fontSize:height*0.8,
            fill:'rgba(251, 243, 243, 1)'
        });


        this.afterText = this.scene.add.text(x + width / 2+height*0.8, y+height/2, this.text, {

            fontSize: height*0.8,

            fill: 'rgba(251, 243, 243, 1)'
        }).setOrigin(0.5);
    }

    // update_name_level(name,level){
    //     this.nameText.setText(name);
    //     this.healthText.setText(level);
    // }


    update(be_text,af_text,now_blood,max_blood,style){
        const x=this.site[0];
        const y=this.site[1];
        const width=this.size[0];
        const height=this.size[1];
        const percent=now_blood/max_blood;

        // this.healthBar.clear();
        // this.healthBar.fillStyle(0x333333);
        // this.healthBar.fillRect(x,y,width,height);
        // this.healthBar.fillStyle(this.color);
        // this.healthBar.fillRect(x,y,width*percent,height);

        let text=null;

        if (style=="blood"){
            this.color=0xff0000;
            text=`${now_blood}/${max_blood}`
        }
        else if(style=="magic"){
            this.color=0x0000ff;
            text=`${now_blood}/${max_blood}`
        }
        else if(style=="name"){
            // console.log(`成功改名：${af_text}`);
            text=af_text;
        }
        else if(style=="level"){
            text=af_text;
        }
        else if(style=="exp"){
            text=`${now_blood}/${max_blood}`
        }
        else if(style=="brain"){
            text=`${now_blood}/${max_blood}`
        }

        this.healthBar.clear();
        this.healthBar.fillStyle(0x333333);
        this.healthBar.fillRect(x,y,width,height);

        this.healthBar.fillStyle(this.color);
        this.healthBar.fillRect(x,y,width*percent,height);

        this.afterText.setText(text);


    }

}