// 初始文本内容
let text1 = `[O1]*%..
infp会喜欢
逛公园、观雨、看海、晒太阳

有个说法是
爱好广泛且愿意不断尝试的
这种叫生命力旺盛
所以三分钟热度也会有三分收获`;
let text2 = `[O2]..*+。
有时候我们不是不能接受坏事情发生
只是节奏被打乱的时候真的会大崩溃`;
let ratio = 0.25;
let maxDist = 60;
let duration = 1200;

// 位置参数初始值
let text1x = 80, text1y = 430, text2x = 180, text2y = 570;

function wrapChars(text, ratio) {
    // ratio概率参与动画
    // 先按行分割，逐行处理，行尾加<br>
    return text.split('\n').map(line =>
        line.replace(/./g, c => {
            if (c === '<') return c;
            const animate = Math.random() < ratio;
            return animate ? `<span class='char anim-char'>${c}</span>` : `<span class='char'>${c}</span>`;
        })
    ).join('<br>');
}

function applyTextPositions() {
    const t1 = document.getElementById('text1');
    const t2 = document.getElementById('text2');
    t1.style.left = text1x + 'px';
    t1.style.top = text1y + 'px';
    t2.style.left = text2x + 'px';
    t2.style.top = text2y + 'px';
    document.getElementById('text1-x-value').innerText = text1x;
    document.getElementById('text1-y-value').innerText = text1y;
    document.getElementById('text2-x-value').innerText = text2x;
    document.getElementById('text2-y-value').innerText = text2y;
}

function renderTexts() {
    document.getElementById('text1').innerHTML = wrapChars(text1, ratio);
    document.getElementById('text2').innerHTML = wrapChars(text2, ratio);
    document.querySelectorAll('.anim-char').forEach(c => c.classList.add('rise'));
    document.querySelectorAll('.char:not(.anim-char)').forEach(c => {c.style.opacity = 1;});
    applyTextPositions();
}

// 画布安全边距
const safeMargin = 20;
const canvasW = 550, canvasH = 750;

window.addEventListener('DOMContentLoaded', () => {
    renderTexts();
    const t1 = document.getElementById('text1');
    const t2 = document.getElementById('text2');
    t1.style.left = '0px'; t1.style.top = '0px';
    t2.style.left = '0px'; t2.style.top = '0px';
    void t1.offsetWidth; void t2.offsetWidth;
    let t1w = t1.offsetWidth, t1h = t1.offsetHeight;
    let t2w = t2.offsetWidth, t2h = t2.offsetHeight;
    let t1left = Math.max(safeMargin, Math.floor((canvasW - t1w) / 2));
    let t1top = safeMargin + 80;
    let t2left = Math.max(safeMargin, Math.floor((canvasW - t2w) / 2));
    let t2top = safeMargin + 380;
    if (t1top + t1h + 20 > t2top) {
        t2top = t1top + t1h + 20;
    }
    t1left = Math.min(canvasW - t1w - safeMargin, t1left);
    t1top = Math.min(canvasH - t1h - safeMargin, t1top);
    t2left = Math.min(canvasW - t2w - safeMargin, t2left);
    t2top = Math.min(canvasH - t2h - safeMargin, t2top);
    t1.style.left = t1left + 'px';
    t1.style.top = t1top + 'px';
    t2.style.left = t2left + 'px';
    t2.style.top = t2top + 'px';
});

document.getElementById('input1').value = text1.replace(/\n/g, '\n');
document.getElementById('input2').value = text2.replace(/\n/g, '\n');

document.getElementById('input1').addEventListener('input', e => {
    text1 = e.target.value.replace(/\\n/g, '\n');
    renderTexts();
});
document.getElementById('input2').addEventListener('input', e => {
    text2 = e.target.value.replace(/\\n/g, '\n');
    renderTexts();
});
document.getElementById('ratio').addEventListener('input', e => {
    ratio = parseInt(e.target.value) / 100;
    document.getElementById('ratio-value').innerText = `${e.target.value}%`;
    renderTexts();
});
document.getElementById('dist').addEventListener('input', e => {
    maxDist = parseInt(e.target.value);
    document.getElementById('dist-value').innerText = maxDist;
});
document.getElementById('dur').addEventListener('input', e => {
    duration = parseInt(e.target.value);
    document.getElementById('dur-value').innerText = duration;
});

function animateFloat(containerId, delay=0) {
    const chars = Array.from(document.querySelectorAll(`#${containerId} .anim-char`));
    const indices = chars.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    chars.forEach((char, i) => {
        const y = 30 + Math.random() * (maxDist - 30);
        const rot = -30 + Math.random() * 60;
        const randomDelay = Math.floor(Math.random() * chars.length * 60);
        setTimeout(() => {
            char.style.transform = `translateY(-${y}px) rotateZ(${rot}deg)`;
            char.classList.add('float');
            char.classList.remove('rise');
        }, randomDelay + delay);
        setTimeout(() => {
            char.classList.remove('float');
            char.classList.add('rise');
            char.style.transform = '';
        }, duration + randomDelay + delay);
    });
}

// 确保图片样式支持left/top变化
document.querySelector('.img1').style.position = 'absolute';
document.querySelector('.img2').style.position = 'absolute';
document.querySelector('.img1').style.left = '60px';
document.querySelector('.img1').style.top = '70px';
document.querySelector('.img2').style.left = '180px';
document.querySelector('.img2').style.top = '340px';

// 背景和上层图片池
const bgImages = [
    './pic/img1.jpg',
    './pic/img2.jpg',
    './pic/img3.webp',
    './pic/img4.png'
];

function getRect(img) {
    return {
        left: parseInt(img.style.left),
        top: parseInt(img.style.top),
        width: parseInt(img.style.width),
        height: parseInt(img.style.height)
    };
}

function overlapArea(r1, r2) {
    const x_overlap = Math.max(0, Math.min(r1.left + r1.width, r2.left + r2.width) - Math.max(r1.left, r2.left));
    const y_overlap = Math.max(0, Math.min(r1.top + r1.height, r2.top + r2.height) - Math.max(r1.top, r2.top));
    return x_overlap * y_overlap;
}

function isValidOverlap(r1, r2) {
    const area1 = r1.width * r1.height;
    const area2 = r2.width * r2.height;
    const overlap = overlapArea(r1, r2);
    return overlap <= 0.5 * area1 && overlap <= 0.5 * area2;
}

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomizeImages() {
    let pool = [...bgImages];
    const idxBg = Math.floor(Math.random() * pool.length);
    const bgSrc = pool.splice(idxBg, 1)[0];
    const idx1 = Math.floor(Math.random() * pool.length);
    const src1 = pool.splice(idx1, 1)[0];
    const src2 = pool[0];
    const bg = document.querySelector('.bg');
    bg.src = bgSrc;
    bg.style.objectFit = 'cover';
    bg.style.width = '100%';
    bg.style.height = '100%';
    const imgs = [
        document.querySelector('.img1'),
        document.querySelector('.img2')
    ];
    // 随机决定上层图片数量 0, 1, 2
    const showCount = Math.floor(Math.random() * 3); // 0, 1, 2
    if (showCount === 0) {
        imgs.forEach(img => img.style.display = 'none');
        return;
    }
    if (showCount === 1) {
        // 随机选一个显示
        const showIdx = Math.floor(Math.random() * 2);
        imgs.forEach((img, i) => {
            if (i === showIdx) {
                img.style.display = '';
                // 随机宽高和位置
                let tries = 0;
                let w, h, left, top;
                do {
                    w = Math.round(200 + Math.random() * 300); // 200~500px
                    h = Math.round(300 + Math.random() * 100); // 300~400px
                    left = getRandomInRange(safeMargin, canvasW - w - safeMargin);
                    top = getRandomInRange(safeMargin, canvasH - h - safeMargin);
                    tries++;
                } while ((w <= 0 || h <= 0) && tries < 10);
                img.style.width = w + 'px';
                img.style.height = h + 'px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '0';
                img.style.transition = 'left 0.7s, top 0.7s, width 0.7s, height 0.7s, transform 0.7s';
                img.style.left = left + 'px';
                img.style.top = top + 'px';
                img.src = showIdx === 0 ? src1 : src2;
            } else {
                img.style.display = 'none';
            }
        });
        return;
    }
    // showCount === 2
    let tries = 0;
    let valid = false;
    let props = [];
    while (!valid && tries < 30) {
        props = [];
        for (let i = 0; i < 2; i++) {
            const w = Math.round(200 + Math.random() * 300); // 200~500px
            const h = Math.round(300 + Math.random() * 100); // 300~400px
            const left = getRandomInRange(safeMargin, canvasW - w - safeMargin);
            const top = getRandomInRange(safeMargin, canvasH - h - safeMargin);
            props.push({w, h, left, top});
        }
        valid = isValidOverlap(
            {left: props[0].left, top: props[0].top, width: props[0].w, height: props[0].h},
            {left: props[1].left, top: props[1].top, width: props[1].w, height: props[1].h}
        );
        tries++;
    }
    imgs.forEach((img, i) => {
        img.style.display = '';
        img.style.width = props[i].w + 'px';
        img.style.height = props[i].h + 'px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '0';
        img.style.transition = 'left 0.7s, top 0.7s, width 0.7s, height 0.7s, transform 0.7s';
        img.style.left = props[i].left + 'px';
        img.style.top = props[i].top + 'px';
        img.src = i === 0 ? src1 : src2;
    });
}

// 页面初始时设置背景图固定
window.addEventListener('DOMContentLoaded', () => {
    // 随机初始背景图
    const bg = document.querySelector('.bg');
    const bgSrc = bgImages[Math.floor(Math.random() * bgImages.length)];
    bg.src = bgSrc;
    bg.style.objectFit = 'cover';
    bg.style.width = '100%';
    bg.style.height = '100%';
    // 随机初始上层图片数量 0, 1, 2
    const imgs = [
        document.querySelector('.img1'),
        document.querySelector('.img2')
    ];
    const allImgs = ['./pic/img1.jpg','./pic/img2.jpg','./pic/img3.webp','./pic/img4.png'];
    let pool = [...allImgs];
    const showCount = Math.floor(Math.random() * 3); // 0, 1, 2
    if (showCount === 0) {
        imgs.forEach(img => img.style.display = 'none');
        return;
    }
    if (showCount === 1) {
        const showIdx = Math.floor(Math.random() * 2);
        const idx1 = Math.floor(Math.random() * pool.length);
        const src1 = pool.splice(idx1, 1)[0];
        imgs.forEach((img, i) => {
            if (i === showIdx) {
                img.style.display = '';
                let tries = 0;
                let w, h, left, top;
                do {
                    w = Math.round(200 + Math.random() * 300);
                    h = Math.round(300 + Math.random() * 100);
                    left = getRandomInRange(safeMargin, canvasW - w - safeMargin);
                    top = getRandomInRange(safeMargin, canvasH - h - safeMargin);
                    tries++;
                } while ((w <= 0 || h <= 0) && tries < 10);
                img.style.width = w + 'px';
                img.style.height = h + 'px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '0';
                img.style.transition = 'left 0.7s, top 0.7s, width 0.7s, height 0.7s, transform 0.7s';
                img.style.left = left + 'px';
                img.style.top = top + 'px';
                img.src = src1;
            } else {
                img.style.display = 'none';
            }
        });
        return;
    }
    // showCount === 2
    const idx1 = Math.floor(Math.random() * pool.length);
    const src1 = pool.splice(idx1, 1)[0];
    const src2 = pool[0];
    let tries = 0;
    let valid = false;
    let props = [];
    while (!valid && tries < 30) {
        props = [];
        for (let i = 0; i < 2; i++) {
            const w = Math.round(200 + Math.random() * 300);
            const h = Math.round(300 + Math.random() * 100);
            const left = getRandomInRange(safeMargin, canvasW - w - safeMargin);
            const top = getRandomInRange(safeMargin, canvasH - h - safeMargin);
            props.push({w, h, left, top});
        }
        valid = isValidOverlap(
            {left: props[0].left, top: props[0].top, width: props[0].w, height: props[0].h},
            {left: props[1].left, top: props[1].top, width: props[1].w, height: props[1].h}
        );
        tries++;
    }
    imgs.forEach((img, i) => {
        img.style.display = '';
        img.style.width = props[i].w + 'px';
        img.style.height = props[i].h + 'px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '0';
        img.style.transition = 'left 0.7s, top 0.7s, width 0.7s, height 0.7s, transform 0.7s';
        img.style.left = props[i].left + 'px';
        img.style.top = props[i].top + 'px';
        img.src = i === 0 ? src1 : src2;
    });
});

function isOverlap(r1, r2) {
    return !(r1.left + r1.width < r2.left ||
             r2.left + r2.width < r1.left ||
             r1.top + r1.height < r2.top ||
             r2.top + r2.height < r1.top);
}

function randomizeTexts() {
    const t1 = document.getElementById('text1');
    const t2 = document.getElementById('text2');
    t1.style.left = '0px'; t1.style.top = '0px';
    t2.style.left = '0px'; t2.style.top = '0px';
    void t1.offsetWidth; void t2.offsetWidth;
    let t1w = t1.offsetWidth, t1h = t1.offsetHeight;
    let t2w = t2.offsetWidth, t2h = t2.offsetHeight;
    let t1left = safeMargin, t1top = safeMargin;
    let t2left = safeMargin, t2top = safeMargin;
    if (t1w < canvasW - 2 * safeMargin && t1h < canvasH - 2 * safeMargin) {
        t1left = getRandomInRange(safeMargin, canvasW - t1w - safeMargin);
        t1top = getRandomInRange(safeMargin, canvasH - t1h - safeMargin);
    }
    let tries = 0, overlap = false;
    do {
        if (t2w < canvasW - 2 * safeMargin && t2h < canvasH - 2 * safeMargin) {
            t2left = getRandomInRange(safeMargin, canvasW - t2w - safeMargin);
            t2top = getRandomInRange(safeMargin, canvasH - t2h - safeMargin);
        } else {
            t2left = safeMargin; t2top = safeMargin;
        }
        overlap = isOverlap(
            {left: t1left, top: t1top, width: t1w, height: t1h},
            {left: t2left, top: t2top, width: t2w, height: t2h}
        );
        tries++;
    } while (overlap && tries < 30);
    t1left = Math.max(safeMargin, Math.min(canvasW - t1w - safeMargin, t1left));
    t1top = Math.max(safeMargin, Math.min(canvasH - t1h - safeMargin, t1top));
    t2left = Math.max(safeMargin, Math.min(canvasW - t2w - safeMargin, t2left));
    t2top = Math.max(safeMargin, Math.min(canvasH - t2h - safeMargin, t2top));
    t1.style.transition = 'left 0.7s, top 0.7s';
    t2.style.transition = 'left 0.7s, top 0.7s';
    t1.style.left = t1left + 'px';
    t1.style.top = t1top + 'px';
    t2.style.left = t2left + 'px';
    t2.style.top = t2top + 'px';
    // 随机对齐
    const aligns = ['left', 'center', 'right'];
    t1.style.textAlign = aligns[Math.floor(Math.random() * 3)];
    t2.style.textAlign = aligns[Math.floor(Math.random() * 3)];
    text1x = t1left; text1y = t1top; text2x = t2left; text2y = t2top;
}

// 修改按钮事件，先随机图片和文字再播放动画
document.getElementById('playBtn').onclick = () => {
    // 随机切换背景图
    const bg = document.querySelector('.bg');
    const bgSrc = bgImages[Math.floor(Math.random() * bgImages.length)];
    bg.src = bgSrc;
    // 随机opacity，1的概率80%，0的概率20%
    bg.style.opacity = Math.random() < 0.8 ? '1' : '0';
    randomizeImages();
    randomizeTexts();
    document.querySelectorAll('.anim-char').forEach(c => {
        c.classList.remove('rise');
        c.classList.remove('float');
        c.style.transform = '';
    });
    setTimeout(() => {
        animateFloat('text1', 0);
        animateFloat('text2', 1200);
    }, 50);
}; 