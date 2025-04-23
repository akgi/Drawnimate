var canvas1 = document.querySelector('#canvas1');
var canvas2 = document.querySelector('#canvas2');

const c1 = canvas1.getContext('2d');
const c2 = canvas2.getContext('2d');

let drawing = false;
let xLast, yLast;
const colorButton = document.querySelectorAll('.colorButton');
const colorPicker = document.getElementById('colorPicker');
let currentColor = '#000000';
c1.lineCap = 'round';
c2.lineCap = 'round';
let brushWidth = 15;
let imageCount = 0;
let fps = 15;
let animationInterval = 1000/fps;

let activeCanvas = 1;

function switchCanvas() {
    if (activeCanvas === 1) {
        activeCanvas = 2;
        canvas1.style.zIndex = '0';
        canvas2.style.zIndex = '1';
        canvas2.style.opacity = '1';
        canvas1.style.opacity = '0.5';
    } else {
        activeCanvas = 1;
        canvas1.style.zIndex = '1';
        canvas2.style.zIndex = '0';
        canvas1.style.opacity = '1';
        canvas2.style.opacity = '0.5';
    }
}

function resizeCanvases() {
    const width = window.innerWidth;
    const height = window.innerHeight * 0.9;

    canvas2.width = width;
    canvas2.height = height;
    canvas1.width = width;
    canvas1.height = height;
}

window.addEventListener('resize', resizeCanvases);
resizeCanvases();

colorButton.forEach(button => {
    button.addEventListener('click', function () {
        currentColor = button.dataset.color;
    });
});

colorPicker.addEventListener('input', function () {
    currentColor = colorPicker.value;
});

colorPicker.addEventListener('click', function () {
    currentColor = colorPicker.value;
});

clearButton.addEventListener('click', () => {
    if (activeCanvas === 1) {
        c1.clearRect(0, 0, canvas1.width, canvas1.height);
    } else {
        c2.clearRect(0, 0, canvas2.width, canvas2.height);
    }
});

let prevPageButton = document.querySelector("#prevPageButton"); // FIX ISSUES WITH THIS
prevPageButton.addEventListener('click', () => {
    loadImage();
    switchCanvas();
});

let nextPageButton = document.querySelector("#nextPageButton");
nextPageButton.addEventListener('click', () => {
    saveImage();
    if (activeCanvas === 1) {
        c2.clearRect(0, 0, canvas2.width, canvas2.height);
    } else {
        c1.clearRect(0, 0, canvas1.width, canvas1.height);
    }
    switchCanvas();
});

let clearAnimationButton = document.querySelector("#clearAnimationButton");
clearAnimationButton.addEventListener('click', () => {
    allImages = [];
});

canvas1.addEventListener('mousedown', (e) => {
    drawing = true;
    [xLast, yLast] = [e.offsetX, e.offsetY];
});

canvas2.addEventListener('mousedown', (e) => {
    drawing = true;
    [xLast, yLast] = [e.offsetX, e.offsetY];
});

canvas1.addEventListener('mousemove', drawOnCanvas);
canvas2.addEventListener('mousemove', drawOnCanvas);

canvas1.addEventListener('mouseup', () => drawing = false);
canvas2.addEventListener('mouseup', () => drawing = false);

canvas1.addEventListener('mouseout', () => drawing = false);
canvas2.addEventListener('mouseout', () => drawing = false);

document.getElementById("brushSizeSlide").oninput = function() {
    brushWidth = document.getElementById("brushSizeSlide").value;
    document.getElementById("brushSizeOut").innerHTML = brushWidth + ' px ';
}

function drawOnCanvas(e) {
    if (!drawing) return;
    let c = activeCanvas === 1 ? c1 : c2;

    c.strokeStyle = currentColor;
    c.lineWidth = brushWidth;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(xLast, yLast);
    c.lineTo(e.offsetX, e.offsetY);
    c.stroke();
    [xLast, yLast] = [e.offsetX, e.offsetY];
}

document.getElementById("fpsIn").oninput = function () {
    fps = document.getElementById("fpsIn").value;
    document.getElementById("fpsOutput").innerHTML = fps + ' fps';
};

let allImages=[];
function saveImage() {
    let canvas = activeCanvas === 1 ? canvas1 : canvas2;
    let base64 = canvas.toDataURL("image/png");
    const image=new Image();
    image.src=base64;
    allImages.push(image);
    /*
    let a = document.createElement("a");
    a.href = image;
    a.download = `img${imageCount}.png`;
    a.click();
    imageCount++;
    */
}

function loadImage() {
    let canvas;
    if(activeCanvas==1){
        canvas = canvas2;
    }else if (activeCanvas==2){
        canvas = canvas1;
    }
    let ctx = canvas.getContext('2d');
    let prevCount = imageCount - 2;
    let imageUrl = `images/img${prevCount}.png`;
    let img = new Image();

    img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = imageUrl;
}

function animate(){
    let frame = 0;
    clearInterval(animationInterval);
    c1.clearRect(0, 0, canvas1.width, canvas1.height);
    canvas1.style.opacity = '0';

    animationInterval = setInterval(() => {
       /*let imgUrl = `images/img${frame}.png`;
        console.log(imgUrl);
        let img = new Image();
        img.onload = function() {
            c2.clearRect(0, 0, canvas2.width, canvas2.height);
            c2.drawImage(img, 0, 0, canvas2.width, canvas2.height);
        };

        img.onerror = function() {
            clearInterval(animationInterval);
        }

        img.src = imgUrl;
        */
        const image=allImages[frame];
        if(image){
         c2.clearRect(0, 0, canvas2.width, canvas2.height);
         c2.drawImage(allImages[frame], 0, 0, canvas2.width, canvas2.height);
         frame++;
       }else{
         clearInterval(animationInterval);
       }
    }, 1000/fps);
}

animateButton.addEventListener('click', () => {
    animate();
});
