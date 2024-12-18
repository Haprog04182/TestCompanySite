let Mx = 0;
let My = 0;
document.body.addEventListener('mousemove', e => {
    document.body.style.setProperty('--mouseX', e.clientX + 'px');
    document.body.style.setProperty('--mouseY', e.clientY + 'px');

    Mx = e.clientX;
    My = e.clientY;
})
const canvas = document.querySelector('.canvas_bg');
const ctx = canvas.getContext("2d"); 

ctx.fillStyle=`rgb(25,25,30)`;
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'rgb(122, 50, 24)';
let step = 10;
for(let i =0; i < canvas.width; i += step){
    ctx.fillRect(i, (canvas.width/2) * Math.sin(i*canvas.height), Math.random()*(step / i) * 20, canvas.height  );    
}
