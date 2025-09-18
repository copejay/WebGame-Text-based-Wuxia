
import {PersonPop} from "/static/js/inter_screen/popScreen_c/personPop.js";
import InputPop from "/static/js/inter_screen/popScreen_c/inputPop.js";
import { f_person } from "/static/js/inter_screen/popScreen_c/function_pop/f_person.js";
import { f_bag } from "/static/js/inter_screen/popScreen_c/function_pop/f_bag.js";
import { f_fly } from "/static/js/inter_screen/popScreen_c/function_pop/f_fly.js";
import { f_magic } from "/static/js/inter_screen/popScreen_c/function_pop/f_magic.js";
import { f_equip } from "/static/js/inter_screen/popScreen_c/function_pop/f_equip.js";
import { f_store } from "/static/js/inter_screen/popScreen_c/function_pop/f_store.js";







import event_bus from "/static/js/event_bus.js";



export class PopScreen{
    constructor(size,scene){
        this.site=[size[0]*0.17,size[1]*0.17];
        this.size=[size[0]*0.82,size[1]*0.555];

        this.scene=scene;
        this.data="张三";
        this.act_pop_list=[];

    }

    run(pop_name,data=null){
        if(this.act_pop_list.length==0){
            this.act_pop_list.push(this[pop_name]);
            if (data!=null){
                this.act_pop_list[0].run(data);
            }else{
                this.act_pop_list[0].run();
            }
        }else{
            this.act_pop_list.forEach((data)=>{
                data.destroy();
                this.act_pop_list.shift();
            })
            this.act_pop_list.push(this[pop_name]);
            if (data!=null){
                this.act_pop_list[0].run(data);
            }else{
                this.act_pop_list[0].run();
            }
        }
    }

    destroy(pop_name){
        if (this.act_pop_list[0]==this[pop_name]){
            this.act_pop_list[0].destroy();
            this.act_pop_list.shift();
        }else{
            console.log("错误！！！:无弹窗触发删除");
        }

        // this[pop_name].destroy();

    }


    create(){
        this.personPop=new PersonPop(this.site,this.size,this.data,this.scene);
        this.f_person=new f_person(this.site,this.size,this.data,this.scene);
        this.f_bag=new f_bag(this.site,this.size,this.data,this.scene);
        this.f_fly=new f_fly(this.site,this.size,this.data,this.scene);
        this.f_magic=new f_magic(this.site,this.size,this.data,this.scene);
        this.f_equip=new f_equip(this.site,this.size,this.data,this.scene);
        this.f_store=new f_store(this.site,this.size,this.data,this.scene);



        event_bus.on('Person_click',(data)=>{
                console.log(`主弹窗接收lowNPC数据:${data}`)
                this.run("personPop",data);
                // this.personPop.run(data);
        })

        event_bus.on('Pop_out',(data)=>{
            if (data=="f_person"){
                this.destroy("f_person");
                // this.f_person.destroy();
            }
            if (data=="f_bag"){
                this.destroy("f_bag");
            }
            if (data=="f_fly"){
                this.destroy("f_fly");
            }
            if (data=="f_magic"){
                this.destroy("f_magic");
            }
            if (data=="f_equip"){
                this.destroy("f_equip");
            }
            if (data=="f_store"){
                this.destroy("f_store");
            }

        })

        event_bus.on('function_click',(data)=>{
            if (data=="我要发言"){
                this.inputPop=new InputPop(this.site,this.size,this.scene);
                this.inputPop.run((input)=>{
                    if(input==null || input==""){
                        console.log("输入为空");
                    }else{
                        event_bus.emit("Talk_input_message",`${input}`);
                        console.log("弹窗回调触发，输入内容为：",input);
                    }
                    // event_bus.emit("Talk_input_message",`${input}`);
                    // console.log("弹窗回调触发，输入内容为：",input);
                });
            }
        })

//监听localDb的更新要求，【需要根据情况判断是否需要弹窗更新最新数据】，这里需要在localDb里面设置一个检测机制
        event_bus.on('localDb_renew_data',(data)=>{
            if(data.type=='bag'){
                this.run("f_bag",data.data);
            }
            if(data.type=='magic'){
                console.log("popScreen更新magic")
                this.run("f_magic",data.data);
            }
        })

//接收function点击，向localDb发起数据请求，收到请求唤起弹窗
        event_bus.on('function_click',(data)=>{
            if (data=="命令"){
                // this.personPop.display();
            }
            if (data=="综合属性"){
                // this.f_person.run();
                // event_bus.emit('pop_beg_person_data',"person");
                event_bus.once('localDb_person_data',(data)=>{
                    console.log(data);
                    this.run("f_person",data);
                });
                event_bus.emit('pop_beg_person_data',"person");
                // this.run("f_person");
            }
            if (data=="打开背包"){
                event_bus.once('localDb_bag_data',(data)=>{
                    this.run("f_bag",data);
                })
                event_bus.emit('pop_beg_bag_data',"bag");

                // this.run("f_bag");
            }
            if (data=="查看装备"){
                event_bus.once('localDb_equipment_data',(data)=>{
                    this.run("f_equip",data);
                })
                event_bus.emit('pop_beg_equipment_data',"equip");
            }
            if (data=="乘雕飞行"){
                this.run("f_fly");
            }
            if (data=="查看武功"){
                event_bus.once('localDb_all_magic_data',(data)=>{
                    this.run("f_magic",data);
                })
                event_bus.emit('pop_beg_all_magic_data',"magic");
            }
            if (data=="玩家商店"){
                // event_bus.once('localDb_store_data',(data)=>{
                this.run("f_store",data);
                // })
                // event_bus.emit('pop_beg_store_data',"store");
            }



            if(data=="设置"){
                this.inputPop.destroy();
            }
        })
        event_bus.on('Pop_person_click',(data)=>{
            if (data=="X"){
                // this.personPop.display ();
                this.destroy("personPop");
            }
        })

    }

}