
import event_bus from "/static/js/event_bus.js";
import PersonControl from "/static/js/inter_screen/bloodScreen_c/personControl.js"

export class localDb_p{
    constructor(){

        this.personControl=PersonControl;

        this.myMapSite=[]

        this.db_person_base=["姓名","年龄","性别","等级","经验值"]

        this.person_base_data=["上官金虹",20,"男",9,20];
        this.person_fight_data=["气血","内力","精神","攻击","防御","速度"];

        this.panel_data=["姓名","境界","精神","经验","气血","内力"];

        this.fight_data=["",20,30,0];

        this.bag_data=[["新鲜空气",99]]

        this.equipment_data=[["武器",["轩辕剑",100,0,50]],["头部",[""]],["肩部",[""]],["胸部",[""]],["腰部",[""]],["腿部",[""]],["鞋子",[""]]];


        this.bagMagic_data=[["六脉神剑",1,10],["乾坤大挪移",1,5],["紫霞神功",0,20],["降龙十八掌",0,10],["神龙心法",1,10]];


        this.equip_magic_data=[["内功","null"],["武功1","null"],["武功2","null"],["武功3","null"],["武功4","null"],["武功5","null"],["武功6","null"]];


        this.fight_ready_magic_data=["降龙十八掌","斗转星移","六脉神剑","金钟罩"];

        this.fight_magic_data=[];

        this.level_to_baseData=
        [10,30,50,100,200,
        500,1000,3000,5000,10000]
        this.level_to_up=
        [100,300,500,800,1500,
        3000,5000,8000,12000,20000];
        //武徒是零阶，后天是一阶，和索引是一样的
        this.level_to_name=
        ["武徒","武者","武师","宗师","大宗师",
         "武王","武皇","武圣","武仙","武道天尊"];
        this.sLevel_to_name=["零阶","一阶","二阶","三阶","四阶","五阶","六阶","七阶","八阶","九阶"];
        // this.level_to_name=
        // ["斗者","斗师","大斗师","斗灵","斗王",
        //  "斗皇","斗宗","斗尊","斗圣","斗帝"];
        // this.sLevel_to_name=["零星","一星","二星","三星","四星","五星","六星","七星","八星","九星"];

        this.cultivation_mod=false;

        this.all_cultivation_magic_data=0;


        this.listen_pop();
        this.listen_PopC_bag();
        this.listen_PopC_magic();
        this.listen_PopC_store();
        this.auto_figure();
        this.add_listen_to_listen();
        this.listen_function_click();
        this.listen_fight_signal();
        this.listen_move();
        this.listen_personControl();
        // event_bus.emit("localDb_search",{type:"magic",data:""});
        const begin_loading=setTimeout(()=>{
            event_bus.emit("localDb_search",{type:"bagMagic",data:""});
            console.log("localDb:初始化加载...")
        },1000);
        const timer=setInterval(()=>{
            console.log("localDb:定时自动存储-查询");
            event_bus.emit("localDb_search",{type:"bagMagic",data:""});
        },60000);

    }
//###############
//
//本地数据库只有被调用的资格，不存在主动调用的权力
//本地数据库只能对服务器发起调用，不能调用本地操作

//localDb需要作为一个核心调度的模块能力，对其它所有模块都具有主动调用的权限

//localDb只能对listen发起更改请求，不能发起搜索请求
//localDb的数据只能等待listen的自动程序给它定时更新

//#################################
//
//
//【面向云服务器】
//云服务-数据库请求操作区
//
//
//#################################

    store_person_base_data(){
        console.log("localDb请求更新数据库");
        event_bus.emit("localDb_renew_db",{type:"person_base_data",data:this.person_base_data});
    }

    update_backpack(data){
        //data:["物品名称","物品数量"]
        event_bus.emit("localDb_renew_db",{type:"backpack",data:data});
    }

//由于listen传来的是服务器信息，可以视为与服务器的交互
//对listen的监听，【重点】！！！
//收到信息只做更新，不做调用
//这里的逻辑，接收到服务器的最新数据后，会自动向子模块发起更新要求，但是这里需要设置检测机制，防止弹窗自动弹出
//【面向本地listen】
    add_listen_to_listen(){
        event_bus.on('gift_person_base_data',(data)=>{
            console.log(`localDb,收到人物基础数据${data}`);
            this.person_base_data=data;
            this.auto_figure();
            //对于panel的自动调用没有关系，不会触发弹窗
            event_bus.emit('localDb_panel_data',this.panel_data);
        })
        event_bus.on('gift_backpack',(data)=>{
            console.log(`localDb,收到背包数据${data}`);
            let data_list=data;
            let new_bag_data=[];
            data_list.forEach((item)=>{
                console.log(`localDb:物品${item[2]}数量${item[4]}`);
                let bag_data=[item[2],item[4]];
                new_bag_data.push(bag_data);
            })
            this.renew_bag_data(new_bag_data);
        })
        event_bus.on('gift_bagMagic',(data)=>{
            console.log(`localDb,收到武功数据${data}`);
            let new_bagMagic_data=[];
            let JiFa=0;
            data.forEach((item)=>{
                console.log(`localDb:武功${item[4]}激发${item[1]}等级${item[2]}`);
                if(item[1]=="True"){
                    JiFa=1;
                }else{
                    JiFa=0;
                }
                let bagMagic_data=[item[4],JiFa,item[2]];
                new_bagMagic_data.push(bagMagic_data);
            })
            this.renew_bagMagic_data(new_bagMagic_data);
        })
    }


//####################################
//
//【面向本地模块】
//本地数据库【监听】区
//
//
//##########################################


//监听来自人物操作的数据更改指令
//【面向人物总控】

    listen_personControl(){
        event_bus.on("personControl_cultivation_num",(data)=>{
            console.log("localDb,收到修炼成果",data);
            this.person_base_data[4]+=data;
            this.auto_figure();
        })
    }


//对本地其它功能模块的监听
    listen_move(){
        event_bus.on("Move_renew_mapSite",(data)=>{
            console.log(`localDb,收到地图数据${data}`);
            this.myMapSite=[data[0],data[1],data[2]];
            event_bus.emit("localDb_insert_myMapSite",{map_name:this.myMapSite[0],x:this.myMapSite[1],y:this.myMapSite[2]});
        })
    }

    listen_fight_signal(){
        event_bus.on("Pop_fight_begin",(data)=>{
            console.log("localDb,收到战斗开始指令！");
            this.personControl.start_fight(data);
        })
        // event_bus.on('fight_data',(data)=>{
        //     console.log(`localDb,收到战斗数据${data}`);
        // })
    }

//这里是对于function模块的监听，会根据function模块的点击来自动向数据库申请更新最新数据
//【面向本地功能模块点击】
//如果接收到有关人物的信息，调用人物总控实现具体功能
    listen_function_click(){
        event_bus.on('function_click',(data)=>{
            console.log(`localDB收到function点击${data}`);
            if (data=="打坐练功"){
                this.personControl.start_cultivation();
            }else if(data=="吐气收功"){
                this.personControl.stop_cultivation();
            }else if(data=="打开背包"){
                // this.store_person_base_data();
                event_bus.emit("localDb_search",{type:"backpack",data:""});
            }else if(data=="每日签到"){
                let item_list=["九转金丹","还魂丹","爱情仙蛊","黄龙丹"]
                let item=item_list[Math.floor(Math.random()*item_list.length)];
                event_bus.emit("localDb_renew_db",{type:"backpack",data:[item,1]});
            }else if(data=="修炼元神"){
                event_bus.emit("localDb_renew_db",{type:"bagMagic",act:"add",data:["降龙十八掌"]});
            }else if(data=="查看武功"){
                event_bus.emit("localDb_search",{type:"bagMagic",data:""});
            }
        })
    }

//对子弹窗的监听，这里是需要对数据库进行更改的逻辑判断，接收的是用户对于数据的操作
//
//【面向用户直接操作的本地模块】
//
//玩家直接操作接收，操作子弹窗接收格式，所属操作类+PopC+操作类型
//
//
//
//########################################
    listen_PopC_magic(){
        event_bus.on('magicPopC_use',(magic_name)=>{
            console.log(`localDb,收到运功${magic_name}`);
            this.bagMagic_data.forEach((magic)=>{
                console.log(magic[0]);
                if (magic[0]==magic_name){
                    magic[1]=1;
                    console.log("localDb,找到功法");

                }else{
                    console.log(`localDb,未找到${magic_name}`);
                }
            })
            event_bus.emit('localDb_renew_data',{type:'magic',data:this.bagMagic_data});
        })
        event_bus.on('magicPopC_stop',(magic_name)=>{
            console.log(`localDb,收到停止${magic_name}`);
            this.bagMagic_data.forEach((magic)=>{
                if (magic[0]==magic_name){
                    magic[1]=0;
                    console.log("localDb,找到功法");
                    
                }else{
                    console.log(`localDb,未找到${magic_name}`);
                }
            })
            event_bus.emit('localDb_renew_data',{type:'magic',data:this.bagMagic_data});
        })
    }


    listen_PopC_store(){
        event_bus.on('storePopC_buy',(buy_data)=>{
            console.log(`localDb,收到购买${buy_data}`);
            let buy_name=buy_data[0];
            let buy_num=buy_data[1];
            let buy_value=buy_data[2];
            let buy_value_num=buy_value[3];
            this.buy_store_thing([buy_name,buy_num,buy_value,buy_value_num]);
        })
    }



    listen_PopC_bag(){
        event_bus.on('bagPopC_use',(thing_name)=>{
            console.log(`localDb,收到使用${thing_name}`);

            this.delete_bag_data(thing_name[0]);
        })
    }

//#####################################
//
//【面向信息查询的本地模块】
//
//这里监听其它模块发起的信息查询要求，并返回本地数据库的数据
//
//####################################
    listen_pop(){
        event_bus.on('pop_beg_person_data',(data)=>{
            event_bus.emit('localDb_person_data',[this.person_base_data,this.person_fight_data]);

            event_bus.emit('localDb_panel_data',this.panel_data);
        })
        event_bus.on('Pop_beg_fightPerson_data',(data)=>{
            this.auto_figure();
            event_bus.emit('localDb_fightPerson_data',this.fight_data);
        })

        event_bus.on('pop_beg_bag_data',(data)=>{
            event_bus.emit('localDb_bag_data',this.bag_data);
        })
        event_bus.on('pop_beg_equipment_data',(data)=>{
            event_bus.emit('localDb_equipment_data',this.equipment_data);
        })

        event_bus.on('pop_beg_all_magic_data',(data)=>{
            event_bus.emit('localDb_all_magic_data',this.bagMagic_data);
        })

    }


//########################################
//
//
//【模块自用的综合逻辑方法】
//本地数据库综合【操作】区
//
//
//
//############################################

//#################################
//【边角料】
//自动计算区
//
    auto_figure(){
        let level=this.person_base_data[3];
        let level_num=Math.trunc(level/10);
        let level_sNum=level%10;
        let level_base_add_last=0;

        //计算增幅的时候，会把上个境界的全部增幅加上，避免高等级弱于低等级
        if(level_num==0){
            level_base_add_last=0;
        }else{
            level_base_add_last=this.level_to_baseData[level_num-1]*10;
        }
        let level_base_add=this.level_to_baseData[level_num]

        let blood=level_base_add*(level_num+level_sNum)+level_base_add_last;

        this.person_fight_data=[1*blood,1*blood,1*blood,1*blood,1*blood,1*blood];

        let name=this.person_base_data[0];
        let level_name=this.level_to_name[level_num]+this.sLevel_to_name[level_sNum];

        let spirit=this.person_fight_data[2];
        let exp=this.person_base_data[4];
        let up_exp=this.level_to_up[level_num];
        let magic=this.person_fight_data[1];

        if (exp>=up_exp){
            this.person_base_data[3]+=1;
            this.person_base_data[4]-=up_exp;
            this.auto_figure();
            //只有等级提高才会自动存储数据
            this.store_person_base_data();
        }else{
        // exp=this.person_base_data[4];
        // up_exp=this.level_to_up[level_num];

        this.panel_data=[name,level_name,[spirit,spirit],[exp,up_exp],[blood,blood],[magic,magic]];

        // let speed=this.
        this.fight_data=[name,blood,magic,spirit];
        event_bus.emit('localDb_panel_data',this.panel_data);
        // this.store_person_base_data();
        }

    }

    renew_person_data(data){
        if(data.type=="name"){
            this.person_data[0]=data.data;
        }
    }

    //
    renew_bagMagic_data(data){
        this.bagMagic_data=data;
        // event_bus.emit('localDb_renew_data',{type:'bagMagic',data:this.bagMagic_data});
        // event_bus.emit('localDb_all_magic_data',this.bagMagic_data);
    }

    //目前没有设置对bag的自动更新，所以这里面的弹窗没有被触发
    renew_bag_data(data){
        this.bag_data=data;
        event_bus.emit('localDb_renew_data',{type:'bag',data:this.bag_data});
    }

//用户发起物品购买请求，数据库验证后更新表单，用户唤起查询界面，查询子界面向数据库发起请求
    buy_store_thing(buy_data){
        let buy_name=buy_data[0];
        let buy_num=buy_data[1];
        let buy_value=buy_data[2];
        let buy_value_num=buy_value[3];
        console.log("localDb,准备发起购买物品...");
        //发起购买请求，这里只由本地数据库进行数据验证，检查是否有足够余额，可能存在不严谨的问题，暂且搁置，跑起来再说
        //发起对于背包表单的更新
        event_bus.emit("localDb_renew_db",{type:"backpack",data:[buy_name,buy_num]});
    }


    delete_bag_data(thing_name){
        console.log("localDb,开始删除流程");
        let num=0;
        for (let i = this.bag_data.length;num<i;num++) {
            if (this.bag_data[num][0] == thing_name) {
                console.log("localDb,找到物品");
                this.bag_data[num][1]-=1;
                if (this.bag_data[num][1] == 0) {
                    this.bag_data.splice(num,1);
                }
                console.log("localDb,更新背包");
                event_bus.emit('localDb_renew_data',{type:'bag',data:this.bag_data});
                break;
                // 如果只想删除第一个匹配项，可在此处加 break;
            }else{
                console.log(`${this.bag_data[num][0]}`);  
            }

        }
    }

    add_bag_data(thing_name){
        for (let i = 0; i < this.bag_data.length; i++) {
            if (this.bag_data[i][0] == thing_name) {
                this.bag_data[i][1]+=1;
                return;
            }else{
                this.bag_data.push([thing_name,1]);
            }
        }
    }

}