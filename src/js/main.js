///Импорт
import * as PIXI from 'pixi.js';
import {gsap} from "gsap";
import Assets from "./assetsList";

///Переменные
const maxWidth = 1390;
const maxHeight = 640;
const loader = PIXI.Loader.shared;
const canvasAppContainer = document.querySelector('#app');
let loadingText;
let ladders = [];
let laddersIcons = [];
let stairs = [];
let allowStairSwitch = true;
let buttonOk;
let isFinalShown = false;
let finalScreen = []

const app = new PIXI.Application({
    width: maxWidth,
    height: maxHeight,
    backgroundColor: 'black',
    resizeTo: document.querySelector('#app'),
    //resizeTo: window,
    view: canvasAppContainer,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    autoResize:true
});

//Контейнеры (стоит ли делать рефакторинг)
const containerApp = new PIXI.Container();
containerApp.position.set(0, 0);

const containerUI = new PIXI.Container();
containerUI.position.set(0, 0);

const containerStairs = new PIXI.Container();
containerStairs.position.set(1249, 340);

const containerDecClose = new PIXI.Container();
containerDecClose.position.set(0, 0);

const containerChooseStairs = new PIXI.Container();
containerChooseStairs.position.set(900, 80);

// Порядок назначения
app.stage.addChild(containerApp);
app.stage.addChild(containerStairs);
app.stage.addChild(containerDecClose);
app.stage.addChild(containerChooseStairs);
app.stage.addChild(containerUI);

///Вызов скалирования (взято с гайда по PIXI)
window.addEventListener("resize", function(event){
    scaleToWindow(app.renderer.view, "black");
});

function scaleToWindow(canvas, backgroundColor) {
    var scaleX, scaleY, scale, center;

    //1. Scale the canvas to the correct size
    //Figure out the scale amount on each axis
    scaleX = window.innerWidth / canvas.offsetWidth;
    scaleY = window.innerHeight / canvas.offsetHeight;

    //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
    scale = Math.min(scaleX, scaleY);
    canvas.style.transformOrigin = "0 0";
    canvas.style.transform = "scale(" + scale + ")";

    //2. Center the canvas.
    //Decide whether to center the canvas vertically or horizontally.
    //Wide canvases should be centered vertically, and
    //square or tall canvases should be centered horizontally
    if (canvas.offsetWidth > canvas.offsetHeight) {
        if (canvas.offsetWidth * scale < window.innerWidth) {
            center = "horizontally";
        } else {
            center = "vertically";
        }
    } else {
        if (canvas.offsetHeight * scale < window.innerHeight) {
            center = "vertically";
        } else {
            center = "horizontally";
        }
    }

    //Center horizontally (for square or tall canvases)
    var margin;
    if (center === "horizontally") {
        margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
        canvas.style.marginTop = 0 + "px";
        canvas.style.marginBottom = 0 + "px";
        canvas.style.marginLeft = margin + "px";
        canvas.style.marginRight = margin + "px";
    }

    //Center vertically (for wide canvases)
    if (center === "vertically") {
        margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
        canvas.style.marginTop = margin + "px";
        canvas.style.marginBottom = margin + "px";
        canvas.style.marginLeft = 0 + "px";
        canvas.style.marginRight = 0 + "px";
    }

    //3. Remove any padding from the canvas  and body and set the canvas
    //display style to "block"
    canvas.style.paddingLeft = 0 + "px";
    canvas.style.paddingRight = 0 + "px";
    canvas.style.paddingTop = 0 + "px";
    canvas.style.paddingBottom = 0 + "px";
    canvas.style.display = "block";

    //4. Set the color of the HTML body background
    document.body.style.backgroundColor = backgroundColor;

    //Fix some quirkiness in scaling for Safari
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") !== -1) {
        if (ua.indexOf("chrome") > -1) {
            // Chrome
        } else {
            // Safari
            canvas.style.maxHeight = "100%";
            canvas.style.minHeight = "100%";
        }
    }

    //5. Return the `scale` value. This is important, because you'll nee this value
    //for correct hit testing between the pointer and sprites
    return scale;
}
//////loader
loader.baseUrl = "assets";
loader.onProgress.add(loadProgressHandler);
loader.add(Assets.assetsData);
loader.load(init);
loader.onComplete.add(() => {
    hideLoadingText()
})


getLoadingText()

///// Маска
var px_mask_outter_bounds = new PIXI.Graphics();
px_mask_outter_bounds.beginFill(0xFFFFFF);
px_mask_outter_bounds.drawRect(0, 0, maxWidth, maxHeight);
px_mask_outter_bounds.endFill();
app.stage.addChild(px_mask_outter_bounds);
app.stage.mask = px_mask_outter_bounds;

////Установка объектов
function init(loader, resources) {
    scaleToWindow(app.renderer.view);
    //onWindowResize()
    ///Обычная загрузка
    const bg = new PIXI.Sprite(loader.resources["back"].texture);
    bg.position.set(maxWidth / 2, maxHeight / 2);
    bg.anchor.set(0.5);
    containerApp.addChild(bg);
    /// Загрузка через обьект
    const dec_book = new PlaceObject("dec_book", containerApp, {posX: 940, posY: 72});
    const dec_pot_bot = new PlaceObject("dec_pot_bot", containerDecClose, {posX: 1250, posY: 555});
    const dec_pot_right = new PlaceObject("dec_pot_right", containerApp, {posX: 1175, posY: 240});
    const austin = new PlaceObject("austin", containerApp, {posX: 755, posY: 260});
    const dec_pot_top = new PlaceObject("dec_pot_top", containerApp, {posX: 510, posY: 40});

    const dec_globe = new PlaceObject("dec_globe", containerApp, {posX: 160, posY: 200});
    const dec_table = new PlaceObject("dec_table", containerApp, {posX: 355, posY: 305});
    const dec_sofa = new PlaceObject("dec_sofa", containerApp, {posX: 330, posY: 480});
    //лестницы
    const stair_def = new PlaceObject("stair_def", containerStairs, {posX: 0, posY: 0, isStair: true});
    const stair_new_1 = new PlaceObject("stair_new_1", containerStairs, {
        posX: -81,
        posY: 0,
        visible: false,
        isStair: true
    });
    const stair_new_2 = new PlaceObject("stair_new_2", containerStairs, {
        posX: -91,
        posY: -10,
        visible: false,
        isStair: true
    });
    const stair_new_3 = new PlaceObject("stair_new_3", containerStairs, {
        posX: -61,
        posY: -30,
        visible: false,
        isStair: true
    });

    //управление лестницами - названо ladder, чтобы не запутаться
    const ladder_1_bg = new PlaceObject("ladder_bg", containerChooseStairs, {
        posX: 40,
        posY: 0,
        interact: true,
        visible: false,
        isLadder: true,
        ladderNumber: 1,
    });
    const ladder_1 = new PlaceObject("ladder_1", containerChooseStairs, {
        posX: 70,
        posY: -15,
        visible: false,
        isLadderIcon: true,
    });

    const ladder_2_bg = new PlaceObject("ladder_bg", containerChooseStairs, {
        posX: 170,
        posY: 0,
        interact: true,
        visible: false,
        isLadder: true,
        ladderNumber: 2,
    });
    const ladder_2 = new PlaceObject("ladder_2", containerChooseStairs, {
        posX: 225,
        posY: -20,
        visible: false,
        isLadderIcon: true,
    });

    const ladder_3_bg = new PlaceObject("ladder_bg", containerChooseStairs, {
        posX: 300,
        posY: 0,
        interact: true,
        visible: false,
        isLadder: true,
        ladderNumber: 3,
    });
    const ladder_3 = new PlaceObject("ladder_3", containerChooseStairs, {
        posX: 320,
        posY: -10,
        visible: false,
        isLadderIcon: true,
    });
    //UI
    const fade = new PlaceObject("final_layer_1", containerUI, {
        posX: maxWidth / 2,
        posY: maxHeight / 2,
        visible: false,
        isFinal: true
    });
    const logo = new PlaceObject("logo", containerUI, {posX: 180, posY: 50});
    const final = new PlaceObject("final_layer_2", containerUI, {
        posX: maxWidth / 2,
        posY: 250,
        visible: false,
        isFinal: true
    });
    const btn = new PlaceObject("btn", containerUI, {posX: 700, posY: 550, interact: true, anim: true, scale: 1.5});
    const btn_ok = new PlaceObject("btn_ok", containerChooseStairs, {
        posX: 0,
        posY: 0,
        interact: true,
        visible: false,
        chooseButton: true
    });
    const icon_hammer = new PlaceObject("icon_hammer", containerStairs, {
        posX: -125,
        posY: -80,
        interact: true,
        anim: true,
        appear: 2
    });
}

///Сокращаем текст
let PlaceObject = function (texName, parent, params) {
    this.params = params || {};
    this.parent = parent;
    this.posX = this.params.posX || 0;
    this.posY = this.params.posY || 0;
    this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[texName].texture);
    this.texName = texName;
    this.isLadder = this.params.isLadder;
    this.isvisible = this.params.visible
    this.interact = (this.params.interact);
    //this.scale = (this.params.scale);
    this.anim = (this.params.anim)
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.sprite.x = this.posX;
    this.sprite.y = this.posY;
    if (this.isvisible === false) {
        this.sprite.visible = false
    }
    if (this.interact) {
        this.interactable()
    }
    if (this.params.isLadder) {
        this.ladderNumber = this.params.ladderNumber;
        ladders.push(this)
    }
    if (this.params.isStair) {
        stairs.push(this)
    }
    if (this.params.isLadderIcon) {
        laddersIcons.push(this)
    }
    if (this.anim) {
        this.startAnimation()
    }
    if (this.params.chooseButton) {
        buttonOk = this
    }
    if (this.params.isFinal) {
        finalScreen.push(this)
    }
    this.parent.addChild(this.sprite);

}


PlaceObject.prototype.interactable = function () {
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    const textureButtonOver = PIXI.Texture.from("ladder_bg_chosen");
    const textureButtonDefault = PIXI.Texture.from("ladder_bg");
    if (this.texName === 'icon_hammer') {
        this.sprite.on('pointerdown', onClickHammer);
    }
    if (this.texName === 'ladder_bg') {
        this.sprite.on('pointerdown', e => {
            fillBg(e, this.ladderNumber);
        });
    }

    function fillBg(e, j) {
        if (allowStairSwitch && !isFinalShown) {
            let setLadder = j - 1
            for (let i = 0; i < ladders.length; i++) {
                if (i !== setLadder) {
                    ladders[i].sprite.texture = textureButtonDefault
                }
            }
            ladders[setLadder].sprite.texture = textureButtonOver;
            getStair(j)
            createOkBtn(setLadder);
        }
    }

    function getStair(j) {
        if (!isFinalShown) {
            let setStair = j
            allowStairSwitch = false
            for (let i = 0; i < stairs.length; i++) {
                stairs[i].sprite.alpha = 0;
            }
            for (let i = 0; i < stairs.length; i++) {
                if (i !== setStair) {
                    stairs[setStair].sprite.visible = false;
                }
            }
            stairs[setStair].sprite.visible = true;
            stairs[setStair].sprite.alpha = 1;
            gsap.from(stairs[setStair].sprite, {
                y: -150, alpha: 0.0, duration: 0.5, onComplete: () => {
                    allowStairSwitch = true
                }
            });

        }
    }

    function moveOkBtn(j) {
        let changeY = 90;
        let moveX = ladders[j].posX;
        let moveY = ladders[j].posY + changeY;
        buttonOk.sprite.x = moveX
        buttonOk.sprite.y = moveY

    }
    function createOkBtn(j) {
        if(!buttonOk.sprite.visible){
            buttonOk.sprite.visible = true;
            buttonOk.sprite.on('pointerup', showFinalScreen);
            moveOkBtn(j)
        }
        else {
            moveOkBtn(j)
        }

    }

    function showFinalScreen() {
        isFinalShown = true;
        for (let i = 0; i < finalScreen.length; i++) {
            finalScreen[i].sprite.visible = true
            gsap.from(finalScreen[i].sprite, {
                alpha: 0.0, duration: 0.5,
            });
        }
        disableAll();
    }

    function onClickHammer() {
        gsap.to(this, {
            y: "-=50", alpha: 0.0, duration: 0.5, onComplete: () => {
                this.visible = false
            }
        });
        for (let i = 0; i < ladders.length; i++) {
            ladders[i].sprite.visible = true
            gsap.from(ladders[i].sprite, {
                y: "+=50", alpha: 0.0, duration: 0.5,
            });
        }
        for (let i = 0; i < laddersIcons.length; i++) {
            laddersIcons[i].sprite.visible = true
            gsap.from(laddersIcons[i].sprite, {
                y: "-=50", alpha: 0.0, duration: 0.5, delay: 0.2
            });
        }
    }
}

PlaceObject.prototype.startAnimation = function () {
    this.scale = (this.params.scale);
    this.appear = (this.params.appear);
    if (this.scale) {
        gsap.to(this.sprite.scale, {
            x: 1.2, y: 1.2, duration: this.scale, repeat: -1, yoyoEase: true, ease: "power1.inOut"
        });
    }
    if (this.appear) {
        this.sprite.alpha = 0;
        gsap.to(this.sprite, {
            y: "+=50", alpha: 1.0, duration: this.appear, delay: 1, ease: "elastic"
        });
    }
}

function disableAll() {
    buttonOk.sprite.interactive = false
    for (let i = 0; i < ladders.length; i++) {
        ladders[i].sprite.interactive = false
    }
}

////Загрузочный текст
function getLoadingText() {
    const style = {font: 'bold italic 36px Arial', fill: ['#ffffff', '#ecbf01']};
    loadingText = new PIXI.Text("Идет Загрузка... ", style);
    loadingText.position.set(maxWidth / 2, maxHeight / 2);
    loadingText.anchor.set(0.5, 0.5);
    return loadingText;
}

function hideLoadingText() {
    loadingText.visible = false
}

app.stage.addChild(loadingText);

function updateLoadingText(message) {
    loadingText.text = "Загрузка... " + message + "%";
}

function loadProgressHandler(loader, resource) {
    updateLoadingText(loader.progress.toFixed(2))
}


