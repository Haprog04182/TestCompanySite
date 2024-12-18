let vec3 = (x, y, z) => ({ x, y, z });
let vec2 = (x, y) => ({ x, y });

// let vec4 = (x,y,z,w) => ({x,y,z,w});

let mat2 = (a1, a2, b1, b2) => ({ a1, a2, b1, b2 });
let matmul = (a, mat) => (vec2(a.x * mat.a1 + a.y * mat.a2, a.x * mat.b1 + a.y * mat.b2));
let add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
let sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
let mul = (a, b) => ({ x: a.x * b.x, y: a.y * b.y, z: a.z * b.z });
let mulS = (a, val) => ({ x: a.x * val, y: a.y * val, z: a.z * val });
let dot = (a, b) => a.z != null ? a.x * b.x + a.y * b.y + a.z * b.z : a.x * b.x + a.y * b.y;
let length = (a) => a.z != null ? Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z) : Math.sqrt(a.x * a.x + a.y * a.y);
let normalize = (a) => mulS(a, 1 / length(a));
let reflect = (a, n) => sub(a, mulS(a, 2 * dot(n, a)));
let clamp = (a, min, max) => Math.min(Math.max(a, min), max);
let cross = (a, b) => vec3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
let abs = (a) => vec3(Math.abs(a.x), Math.abs(a.y), Math.abs(a.z));
let maxv3 = (a, val) => vec3(Math.max(a.x, val), Math.max(a.y, val), Math.max(a.z, val));
let rot = (t) => mat2(Math.cos(t), Math.sin(t), -Math.sin(t), Math.cos(t));
function smin(a, b, k) {
  let res = Math.exp(-k * a) + Math.exp(-k * b);
  return -Math.log(res) / k;
}
document.querySelector('.table3d').addEventListener('mousemove', e => {
    Mx = e.offsetX;
    Mx = e.offsetY;
})

let chars = ['▮', '*', '&', '@', '□', '◆', '∎'];




const tab = document.querySelector('table');
const uvs = [];
let d ={
  x:61,
  y:61 * 0.4
}

for(let i = 0; i < d.y; i ++){

  let tr = document.createElement('tr');
  tr.classList = `${i}`;

  uvs[i] = tr;
  for(let j = 0; j < d.x; j ++){
    let td = document.createElement('td');
    uvs[i][j] = td;


  /*▮*/
    td.innerHTML = '∎';
    td.classList = `${j}`;

    tr.appendChild(td);   
    
  }
  tab.appendChild(tr);
  
  document.body.appendChild(tab);
}

function sdCube(p, s) {
  return length(  maxv3(sub(abs(p), s), 0));
}
function GetDist(p) {
  let s = length(sub(p, vec3(0+Math.cos(t/20), 2+Math.sin(t/20), 9))) - 1;
  let pl = p.y+2;
  let plane = smin(s, pl, 0.47);
  let cPos = sub(p, vec3(0,1,8));
  cPos = vec3(cPos.x, cPos.y, cPos.z);
  let c = sdCube(  cPos,   vec3(1,1,1));

  return smin(c, plane, 2)
}

function RayMarch(ro, rd) {
  let sD = 0;
  for (let i = 0; i < 100; i++) {
    let p = add(ro, mulS(rd, sD));
    let pd = GetDist(p);
    sD += pd;
    if (sD < 0.01 || sD > 100) break;
  }
  return sD;
}
function GetNormal(p) {
  let dp = GetDist(p);
  let ex = vec3(0.01, 0, 0);
  let ey = vec3(0, 0.01, 0);
  let ez = vec3(0, 0, 0.01);

  let n = vec3(
    dp - GetDist(sub(p, ex)),
    dp - GetDist(sub(p, ey)),
    dp - GetDist(sub(p, ez))
  );
  return normalize(n);
}

function GetLight(p) {
  let lPos = vec3(10*Math.cos(t/10) + 1/Mx, 450, 10*Math.sin(t/10) + 1/My);

  let l = normalize(sub(lPos, p));
  let n = GetNormal(p);
  let dif = clamp(dot(l, n), 0.1, 1);

  let d = RayMarch(add(p, mulS(n, (0.01 * 3))), l);
  if (d < length(sub(l, lPos))) dif *= 0.3;

  return dif;
}
function shad(t){
  for (let i = 0; i < d.y; i++) {
    for (let j = 0; j < d.x; j++) {
      let uv = vec2( j/d.x,  Math.abs( 1-(i/d.y) )  );
      uv.x -= 0.5;
      uv.y -= 0.5;


      let ro = vec3(0 + 1/(Mx/20), 3 + (My/20)/20  , -1);
      let rd = vec3(uv.x - 1/(Mx/20), uv.y - (1/(My/20)), 1);


      let dd = RayMarch(ro, rd);
      let col = vec3(1,1,1);
      if(dd < 70){
        let p = add(ro, mulS(rd, dd));
        let l = GetLight(p);
        col = vec3(l, l, l);
        col = mul(col, vec3(0.9, 0.4,0.3));
      }
      else{
        col = vec3(0.9, 0.5,0.2);
      }

      col = mulS(col, 255);



      uvs[i][j].style = `color:rgb(${col.x},${col.y},${col.z})`;
    }
  }
}

let t = 0;
shad();
setInterval( () => {
  t ++;
  shad(t);
}, 20)


