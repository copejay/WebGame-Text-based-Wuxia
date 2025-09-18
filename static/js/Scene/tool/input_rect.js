
import socket from '/static/js/db_io/io_socket.js'


function detectDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // 检测是否是移动设备的关键词
  const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  socket.emit("client_message",`设备类型${userAgent}`);

  
  if (isMobile) {
    return 'mobile';
  } else {
    return 'desktop';
  }
}


export class InputRect{
    constructor(size,scene){
        this.size=size;
        this.scene=scene;
        this.formData = { username: '', password: '' };
        this.activeInput = null; 

    }

    create() {
        // // 背景
        // this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);
        const inputXY=[this.size[0]*0.5,this.size[1]*0.3];
        const inputSize=[this.size[0]*0.6,this.size[1]*0.06];
        
        // 标题
        this.scene.add.text(inputXY[0], inputXY[1]*0.5, '纯 Phaser 表单', {
            fontSize: inputSize[1]*0.5,
            fill: '#e94560',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // 1. 用户名输入框（手动实现）
        const x=inputXY[0];
        const y=inputXY[1];
        const w=inputSize[0];
        const h=inputSize[1];

        const usernameInput = this.createInputField(x, y, w , h, '用户名:', false,this.scene);
        // 2. 密码输入框
        const passwordInput = this.createInputField(x, y+h*1.5, w, h, '密码:', true,this.scene);

        // 3. 提交按钮
        this.createButton(x, y+h*3, w*0.4,h*0.9, '提交',this.scene, () => {
            alert(`提交数据：\n用户名：${this.formData.username}\n密码：${this.formData.password}`);
        });

        this.createButton(x,y+h*5,w*0.4,h*0.9, '返回',this.scene, () => {
            this.scene.scene.start('BeginScene');
        });

        // this.createButton(x,y+h*7,w*0.4,h*0.9,"全屏",this.scene,()=>{
        //     if(!this.scene.scale.isFullscreen){
        //         this.scene.scale.startFullscreen();
        //     }
        // });

        this.scene.input.on('pointerdown',(pointer)=>{
            if(!usernameInput.getBounds().contains(pointer.x,pointer.y)&&!passwordInput.getBounds().contains(pointer.x,pointer.y)){

            const hiddenInput= document.getElementById('hiddenInput');
            hiddenInput.setAttribute('readonly','true');

            hiddenInput.blur();
            }

        })


    }

    // 手动创建输入框
    createInputField(x, y,width,height, labelText, isPassword,scene) {
        // 输入框背景
        const bg = scene.add.rectangle(0, 0, width, height, 0x0f3460)
            .setStrokeStyle(1, 0x4a47a3);
        
        // 标签文本
        const label = scene.add.text(-width*0.5, 0, labelText, {
            fontSize: height*0.5,

            fill: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // 输入显示文本（实际输入内容存在 formData 中）
        const displayText = scene.add.text(-width*0.15, 0, '', {
            fontSize: height*0.5,
            fill: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // 光标（闪烁效果）
        const cursor = scene.add.rectangle(0, 0, 2, 20, 0xffffff)
            .setVisible(false);
        
        // 容器（用于整体定位）
        const container = scene.add.container(x, y, [bg, label, displayText, cursor]);
        

        // 激活输入
        container.setInteractive(new Phaser.Geom.Rectangle(-width/2, -height/2, width, height), Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => {
                const hiddenInput= document.getElementById('hiddenInput');
                hiddenInput.removeAttribute('readonly');
                hiddenInput.focus();

                console.log("input click");
                this.activeInput = {
                    displayText,
                    cursor,
                    isPassword,
                    value: isPassword ? this.formData.password : this.formData.username,
                    key: isPassword ? 'password' : 'username'
                };
                // 显示光标并开始闪烁
                cursor.setVisible(true);
                scene.tweens.add({
                    targets: cursor,
                    alpha: 0,
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
                // 更新光标位置
                this.updateCursorPosition();
            });

        if (detectDeviceType()==='mobile'){

        socket.emit('client_message',"手机端检测成功");


        const hiddenInput= document.getElementById('hiddenInput');
        hiddenInput.addEventListener('keydown',(event)=>{
            if (!this.activeInput) return;

            // this.activeInput.value=hiddenInput.value;

            // socket.emit('client_message',`手机端输入了${hiddenInput.value}`);

            if (event.key === 'Backspace') {
                // 退格删除
                socket.emit('client_message',`手机端删除了${hiddenInput.value}`);

                this.activeInput.value = this.activeInput.value.slice(0, -1);
                this.formData[this.activeInput.key] = this.activeInput.value;
                this.activeInput.displayText.setText(this.activeInput.value);
                this.updateCursorPosition();

            } else if (event.key === 'Enter') {
                this.activeInput.value=hiddenInput.value;

                socket.emit('client_message',`手机端输入了${this.activeInput.value}`);

                // hiddenInput.value="";

                const displayValue = this.activeInput.isPassword 
                    ? '*'.repeat(this.activeInput.value.length)
                    : this.activeInput.value;
                socket.emit('client_message',`实际显示检测${displayValue}`);

                this.activeInput.displayText.setText(displayValue);
                
                // 更新表单数据
                socket.emit('client_message',`输入前检测${this.activeInput.value}`);

                this.formData[this.activeInput.key] = this.activeInput.value;

                socket.emit('client_message',`输入后检测${this.formData[this.activeInput.key]}`);

                
                // 更新光标位置
                this.updateCursorPosition();

                // 回车失焦
                this.activeInput.cursor.setVisible(false);
                hiddenInput.value="";
                // this.activeInput = null;
                // return;//标记一下，找bug快一个小时，。。
            } else if (event.key.length === 1 && event.key !== ' ') {
                // 输入字符
                this.activeInput.value += event.key;
            }
            
            // 更新显示（密码用*代替）
            // const displayValue = this.activeInput.isPassword 
            //     ? '*'.repeat(this.activeInput.value.length)
            //     : this.activeInput.value;
            // socket.emit('client_message',`实际显示检测${displayValue}`);

            // this.activeInput.displayText.setText(displayValue);
            
            // // 更新表单数据
            // socket.emit('client_message',`输入前检测${this.activeInput.value}`);

            // this.formData[this.activeInput.key] = this.activeInput.value;

            // socket.emit('client_message',`输入后检测${this.formData[this.activeInput.key]}`);

            
            // // 更新光标位置
            // this.updateCursorPosition();

            //输入完成清空
            // if (event.key === 'Enter') {
            //     hiddenInput.value="";
            // }
        });

        }else{
        socket.emit('client_message',"pc端检测成功");

        
        // 监听键盘输入
        scene.input.keyboard.off('keydown')
        scene.input.keyboard.on('keydown', (event) => {
            if (!this.activeInput) return;
            
            if (event.key === 'Backspace') {
                // 退格删除
                this.activeInput.value = this.activeInput.value.slice(0, -1);
            } else if (event.key === 'Enter') {
                // 回车失焦
                this.activeInput.cursor.setVisible(false);
                this.activeInput = null;
                return;
            } else if (event.key.length === 1 && event.key !== ' ') {
                // 输入字符
                this.activeInput.value += event.key;
            }
            
            // 更新显示（密码用*代替）
            const displayValue = this.activeInput.isPassword 
                ? '*'.repeat(this.activeInput.value.length)
                : this.activeInput.value;
            this.activeInput.displayText.setText(displayValue);
            
            // 更新表单数据
            this.formData[this.activeInput.key] = this.activeInput.value;
            
            // 更新光标位置
            this.updateCursorPosition();
        });
        
        return container;
    }
    }

    // 更新光标位置（跟随文本）
    updateCursorPosition() {
        if (!this.activeInput) return;
        const textWidth = this.activeInput.displayText.width;
        // socket.emit('client_message',`显示端检测${this.activeInput.displayText}`);

        this.activeInput.cursor.setX(this.activeInput.displayText.x + textWidth + 5);
    }

    // 手动创建按钮
    createButton(x, y,width,height, text,scene, callback) {
        const bg = scene.add.rectangle(0, 0, width, height, 0xe94560)
            .setInteractive()
            .on('pointerdown', () => {
                bg.setFillStyle(0xca1f48); // 按下效果
                callback();
            })
            .on('pointerup', () => bg.setFillStyle(0xe94560))
            .on('pointerout', () => bg.setFillStyle(0xe94560));
        
        const textObj = scene.add.text(0, 0, text, {
            fontSize: height*0.5,
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        return scene.add.container(x, y, [bg, textObj]);
    }
}
