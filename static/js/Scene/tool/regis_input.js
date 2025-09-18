
import socket from '/static/js/db_io/io_socket.js'


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

class InputRect{

  constructor(size){
    this.size=size;

  }

  // Phaser场景中的登录按钮点击事件
  onClickLogin() {
    const size=this.size;
    // 1. 创建表单容器（用于定位和样式）
    const formContainer = document.createElement('div');
    formContainer.id = 'register-input';
    formContainer.style.position = 'absolute'; // 绝对定位，方便在画布上定位
    formContainer.style.left = '50%'; // 水平居中
    formContainer.style.top = '36%'; // 垂直居中
    formContainer.style.transform = 'translate(-50%, -50%)'; // 修正居中偏移
    formContainer.style.zIndex = '999'; // 确保在画布之上（z-index需大于画布）
    formContainer.style.padding = '20px';
    formContainer.style.backgroundColor = 'white';

    // 2. 创建账号输入框
    const accountInput = document.createElement('input');
    accountInput.type = 'text';
    accountInput.placeholder = '账号';
    accountInput.style.fontSize=`${size[1]/25}px`;
    accountInput.style.width=`${size[0]/1.6}px`;
    accountInput.style.height=`${size[1]/20}px`;


    accountInput.style.marginBottom = `${size[1]/50}px`;

    accountInput.style.display = 'block';

    // 3. 创建密码输入框
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = '密码';
    passwordInput.style.fontSize=`${size[1]/25}px`;
    passwordInput.style.width=`${size[0]/1.6}px`;
    passwordInput.style.height=`${size[1]/20}px`;


    passwordInput.style.marginBottom = `${size[1]/50}px`;

    passwordInput.style.display = 'block';

    // 4. 创建登录按钮
    const loginBtn = document.createElement('button');
    loginBtn.style.fontSize=`${size[1]/35}px`;
    loginBtn.style.width=`${size[0]/4}px`;
    loginBtn.style.height=`${size[1]/25}px`;

    loginBtn.textContent = '注册';
    loginBtn.addEventListener('click', () => {
      // 处理登录逻辑
      const account = accountInput.value;
      const password = passwordInput.value;
      console.log('注册信息：', account, password);

      socket.emit('register',{
        account:account,
        password:password
      })

      socket.off('register_response');

      socket.on('register_response',(data)=>{
        if(data.code==0){
          console.log("注册成功");
          alert("注册成功");
        }else{
          console.log("注册失败");
          alert("注册失败");
        }
      })


      // 登录后移除表单
      // formContainer.remove();
    });

    // 5. 将元素组装到容器中
    formContainer.appendChild(accountInput);
    formContainer.appendChild(passwordInput);
    formContainer.appendChild(loginBtn);

    // 6. 插入到页面（如body，或游戏画布的父容器）
    document.body.appendChild(formContainer);

    console.log("创建原生登录组件over");
  }


  remove(){
    socket.off('register_response');
    const formContainer = document.getElementById('register-input');
    if (formContainer) {
      formContainer.remove();
    }
  }

}

export default InputRect;