export function scaleToWindow(canvas) {
    let screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    let scaleX, scaleY, scale, center;
    //Figure out the scale amount on each axis
    scaleX = screenWidth / canvas.offsetWidth;
    scaleY = screenHeight / canvas.offsetHeight;

    //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
    scale = Math.min(scaleX, scaleY);
    canvas.style.transformOrigin = "0 0";
    canvas.style.transform = "scale(" + scale + ")";

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
        margin = (screenWidth - canvas.offsetWidth * scale) / 2;
        canvas.style.marginTop = 0 + "px";
        canvas.style.marginBottom = 0 + "px";
        canvas.style.marginLeft = margin + "px";
        canvas.style.marginRight = margin + "px";
    }

    //Center vertically (for wide canvases)
    if (center === "vertically") {
        margin = (screenHeight - canvas.offsetHeight * scale) / 2;
        canvas.style.marginTop = margin + "px";
        canvas.style.marginBottom = margin + "px";
        canvas.style.marginLeft = 0 + "px";
        canvas.style.marginRight = 0 + "px";
    }

    canvas.style.paddingLeft = 0 + "px";
    canvas.style.paddingRight = 0 + "px";
    canvas.style.paddingTop = 0 + "px";
    canvas.style.paddingBottom = 0 + "px";
    canvas.style.display = "block";
    //Fix some quirkiness in scaling for Safari
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
        if (ua.indexOf("chrome") > -1) {
            // Chrome
        } else {
            // Safari
            canvas.style.maxHeight = "100%";
            canvas.style.minHeight = "100%";
        }
    }
    return scale;
}

////////Window Resize Test
function onWindowResize(app) {
    const maxWidth = 1390;
    const maxHeight = 640;
    let newW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let newH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const horizontalMargin = (newW - maxWidth) / 2;
    const verticalMargin = (newH - maxHeight) / 2;
    if (newW > maxWidth) {
        app.view.style.marginLeft = app.view.style.marginRight = `${horizontalMargin}px`;
        app.view.style.width = `${maxWidth}px`;
        app.width = Math.max(maxWidth || 0);
        app.resizeTo = document.querySelector('#app')
    } else {
        app.view.style.marginLeft = app.view.style.marginRight = `0`;
        app.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        app.view.style.width = `${app.width}px`;
        app.resizeTo = window
    }
    if (newH > maxHeight) {
        app.view.style.marginTop = app.view.style.marginBot = `${verticalMargin}px`;
        app.view.style.height = `${maxHeight}px`;
        app.height = Math.max(maxHeight || 0);
        app.resizeTo = document.querySelector('#app')
    } else {
        app.view.style.marginTop = app.view.style.marginBot = `0`;
        app.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        app.view.style.height = `${app.height}px`;
        app.resizeTo = window
    }
}