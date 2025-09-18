


function ClickButton(x, y,width,height, text,scene) {
    const bg = scene.add.rectangle(0, 0, width, height, 0xe94560)
        .setInteractive()
        .on('pointerdown', () => {
            bg.setFillStyle(0xca1f48); // 按下效果
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

export default ClickButton;