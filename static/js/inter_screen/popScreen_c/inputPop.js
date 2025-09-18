
// import socket from '/static/js/db_io/io_socket.js'
import event_bus from "/static/js/event_bus.js";

const screenWidth=window.innerWidth;
const screenHeight=window.innerHeight;

const gameRatio=920/1800;
let gameWidth,gameHeight;

if(screenWidth /screenHeight>gameRatio){
    gameHeight=screenHeight;
    gameWidth=gameHeight * gameRatio;
}else{
    gameWidth=screenWidth;
    gameHeight=gameWidth / gameRatio;
}

class InputPop{

  constructor(site,size){
    this.site=site;
    this.size=size;
  }

  // Phaser场景中的登录按钮点击事件
  run(callback) {
    this.destroy();

    const size=this.size;
    // 1. 创建表单容器（用于定位和样式）
    const formContainer = document.createElement('div');
    formContainer.id = 'login-input';
    formContainer.style.position = 'absolute'; // 绝对定位，方便在画布上定位
    formContainer.style.left = '50%'; // 水平居中
    formContainer.style.top = '36%'; // 垂直居中
    formContainer.style.transform = 'translate(-50%, -50%)'; // 修正居中偏移
    formContainer.style.zIndex = '999'; // 确保在画布之上（z-index需大于画布）
    // formContainer.style.padding = '20px';
    formContainer.style.padding=`${size[1]/20}px`
    formContainer.style.backgroundColor = '#FFFACD';
    formContainer.style.border='2px solid #000';


    // 2. 创建账号输入框
    const accountInput = document.createElement('input');
    accountInput.type = 'text';
    accountInput.placeholder = '输入：';

    accountInput.style.fontSize=`${size[1]/25}px`;
    accountInput.style.width=`${size[0]/1.6}px`;
    accountInput.style.height=`${size[1]/20}px`;


    accountInput.style.marginBottom = `${size[1]/50}px`;

    accountInput.style.display = 'block';


    const buttonContainer=document.createElement('div');
    buttonContainer.style.display='flex';
    buttonContainer.style.gap='10px';
    buttonContainer.style.justifyContent='center';
    buttonContainer.style.marginTop='10px';


    const loginBtn = document.createElement('button');
    loginBtn.style.fontSize=`${size[1]/35}px`;
    loginBtn.style.width=`${size[0]/4}px`;
    // loginBtn.style.width='50%';
    loginBtn.style.height=`${size[1]/25}px`;
    loginBtn.style.position = 'flex';  // 设置定位方式
    loginBtn.style.left = `${size[0]*0.1}px`;  // 距离左侧的距离
    // loginBtn.style.top = `${size[1]*0.3}px`;   // 距离顶部的距离

    loginBtn.textContent = '输入';
    loginBtn.addEventListener('click', () => {
      // 处理登录逻辑
      // event_bus.emit("fight_message",`inputPop:${this.size[1]},${this.size[1]/20}`)
      const account = accountInput.value;
      console.log("弹窗输入成功！");
      callback(account);
      this.destroy();
    });


    const backBtn = document.createElement('button');
    backBtn.style.fontSize=`${size[1]/35}px`;
    backBtn.style.width=`${size[0]/4}px`;
    backBtn.style.height=`${size[1]/25}px`;
    backBtn.style.position = 'flex';  // 设置定位方式
    backBtn.style.left = `${size[0]*0.6}px`;  // 距离左侧的距离
    // backBtn.style.top = `${size[1]*0.1}px`;   // 距离顶部的距离


    backBtn.textContent = '取消';
    backBtn.addEventListener('click', () => {
      // 处理登录逻辑
      // const account = accountInput.value;
      // console.log("弹窗输入成功！");
      // callback(account);
      this.destroy();
    });


    // 5. 将元素组装到容器中
    buttonContainer.appendChild(loginBtn);
    buttonContainer.appendChild(backBtn);
    formContainer.appendChild(accountInput);
    // formContainer.appendChild(passwordInput);
    // formContainer.appendChild(loginBtn);
    // formContainer.appendChild(backBtn);
    formContainer.appendChild(buttonContainer);

    // 6. 插入到页面（如body，或游戏画布的父容器）
    document.body.appendChild(formContainer);

    console.log("创建原生登录组件over");
  }


  destroy(){
    const formContainer = document.getElementById('login-input');
    if (formContainer) {
      formContainer.remove();
    }
  }

}

export default InputPop;





// import socket from '/static/js/db_io/io_socket.js'

// const screenWidth=window.innerWidth;
// const screenHeight=window.innerHeight;

// const gameRatio=920/1800;
// let gameWidth,gameHeight;

// if(screenWidth /screenHeight>gameRatio){
//     gameHeight=screenHeight;
//     gameWidth=gameHeight * gameRatio;
// }else{
//     gameWidth=screenWidth;
//     gameHeight=gameWidth / gameRatio;
// }

// class InputPop{

//   constructor(site,size){
//     this.site=site;
//     this.size=size;
//   }

//   // Phaser场景中的登录按钮点击事件
//   run(callback) {
//     this.destroy();

//     const size=this.size;
//     // 1. 创建表单容器（用于定位和样式）
//     const formContainer = document.createElement('div');
//     formContainer.id = 'login-input';
//     formContainer.style.position = 'absolute'; // 绝对定位，方便在画布上定位
//     formContainer.style.left = '50%'; // 水平居中
//     formContainer.style.top = '36%'; // 垂直居中
//     formContainer.style.transform = 'translate(-50%, -50%)'; // 修正居中偏移
//     formContainer.style.zIndex = '999'; // 确保在画布之上（z-index需大于画布）
//     formContainer.style.padding = '20px';
//     formContainer.style.backgroundColor = '#FFFACD';
//     formContainer.style.border='2px solid #000';


//     // 2. 创建账号输入框
//     const accountInput = document.createElement('input');
//     accountInput.type = 'text';
//     accountInput.placeholder = '输入：';

//     accountInput.style.fontSize=`${size[1]/25}px`;
//     accountInput.style.width=`${size[0]/1.6}px`;
//     accountInput.style.height=`${size[1]/20}px`;


//     accountInput.style.marginBottom = `${size[1]/50}px`;

//     accountInput.style.display = 'block';


//     const loginBtn = document.createElement('button');
//     loginBtn.style.fontSize=`${size[1]/35}px`;
//     loginBtn.style.width=`${size[0]/4}px`;
//     loginBtn.style.height=`${size[1]/25}px`;
//     loginBtn.style.position = 'absolute';  // 设置定位方式
//     loginBtn.style.left = `${size[0]*0.1}px`;  // 距离左侧的距离
//     // loginBtn.style.top = `${size[1]*0.3}px`;   // 距离顶部的距离

//     loginBtn.textContent = '输入';
//     loginBtn.addEventListener('click', () => {
//       // 处理登录逻辑
//       event_bus.emit("fight_message",`inputPop:${this.size[1]},${this.size[1]/20}`)
//       const account = accountInput.value;
//       console.log("弹窗输入成功！");
//       callback(account);
//       this.destroy();
//     });


//     const backBtn = document.createElement('button');
//     backBtn.style.fontSize=`${size[1]/35}px`;
//     backBtn.style.width=`${size[0]/4}px`;
//     backBtn.style.height=`${size[1]/25}px`;
//     backBtn.style.position = 'absolute';  // 设置定位方式
//     backBtn.style.left = `${size[0]*0.4}px`;  // 距离左侧的距离
//     // backBtn.style.top = `${size[1]*0.1}px`;   // 距离顶部的距离


//     backBtn.textContent = '取消';
//     backBtn.addEventListener('click', () => {
//       // 处理登录逻辑
//       // const account = accountInput.value;
//       // console.log("弹窗输入成功！");
//       // callback(account);
//       this.destroy();
//     });


//     // 5. 将元素组装到容器中
//     formContainer.appendChild(accountInput);
//     // formContainer.appendChild(passwordInput);
//     formContainer.appendChild(loginBtn);
//     formContainer.appendChild(backBtn);

//     // 6. 插入到页面（如body，或游戏画布的父容器）
//     document.body.appendChild(formContainer);

//     console.log("创建原生登录组件over");
//   }


//   destroy(){
//     const formContainer = document.getElementById('login-input');
//     if (formContainer) {
//       formContainer.remove();
//     }
//   }

// }

// export default InputPop;