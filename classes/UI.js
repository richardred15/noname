class UI {
    constructor(width, height) {
        this.visible = true;
        this.windows = [];
        this.open_windows = [];
        this.size = {
            w: width,
            h: height
        }
        this.hud = new HUD(width, height);
    }

    addWindow(window) {
        window.parent = this;
        this.windows.push(window);
    }

    update() {
        for (let w = this.open_windows.length - 1; w >= 0; w--) {
            let window = this.open_windows[w];
            if (window.is_open == false) {
                this.open_windows.splice(w, 1);
            }
        }
        for (let w = this.windows.length - 1; w >= 0; w--) {
            let window = this.windows[w];
            if (window.is_open) {
                this.open_windows.push(window);
            }
        }
    }

    render() {
        push();
        resetMatrix();
        this.hud.render();
        resetMatrix();
        for (let window of this.open_windows) {
            push();
            window.render();
            pop();
        }
        pop();
    }
}

class UIWindow {
    constructor(title, x, y) {
        this.is_open = false;
        this.parent = null;
        this.pos = {
            x: x,
            y: y
        }
        this.size = {
            w: 100,
            h: 100
        }
        this.title = title;
        this.components = [];
        this.header = false;
        if (title != "") {
            this.header = new TextBox(0, 0, this.title);
            this.header.setWidth(this.size.w);
        }
        this.pad = {
            left: 5,
            right: 5,
            top: 5,
            bottom: 5
        }
    }

    padding(l, r, t, b) {
        let len = arguments.length;
        switch (len) {
            case 0:
                return false;
                break;
            case 1:
                this.pad = {
                    left: l,
                    right: l,
                    top: l,
                    bottom: l
                }
                break;
            case 2:
                this.pad = {
                    left: l,
                    right: l,
                    top: r,
                    bottom: r
                }
                break;
            case 3:
                return false;
                break;
            case 4:
                this.pad = {
                    left: l,
                    right: r,
                    top: t,
                    bottom: b
                }
                break;
        }
        return true;
    }

    resize(width, height) {
        this.size = {
            w: width,
            h: height
        }
        this.header.setWidth(this.size.w);
    }

    open() {
        this.is_open = true;
        this.update();
    }

    close() {
        this.is_open = false;
        this.update();
    }

    addComponent(component) {
        this.components.push(component);
    }

    setHeader(header) {
        if (header != "") {
            this.header = new TextBox(0, 0, header);
            this.header.setWidth(this.size.w);
        } else {
            this.header = false;
        }
    }

    update() {
        if (this.parent) {
            this.parent.update();
        }
    }

    render() {
        translate(this.pos.x, this.pos.y);
        fill(0, 125);
        stroke(0);
        strokeWeight(2);
        rect(0, 0, this.size.w + (this.pad.left + this.pad.right), this.size.h + (this.pad.top + this.pad.bottom), 4);
        noStroke();
        if (this.header) {
            this.header.render();
            translate(0, this.header.height);
        }
        translate(this.pad.left, this.pad.top);
        for (let component of this.components) {
            push();
            component.render();
            pop();
        }
    }
}

class HUD {
    constructor(width, height) {
        this.size = {
            w: width,
            h: height
        }
        this.components = [];
    }

    addComponent(component) {
        this.components.push(component);
    }

    render() {
        for (let component of this.components) {
            push();
            component.render();
            pop();
        }
    }
}

class Component {
    constructor(x, y) {
        this.pos = {
            x: x,
            y: y
        }
    }

    render() {
        translate(this.pos.x, this.pos.y);
    }
}

class TextBox extends Component {
    constructor(x, y, text = "") {
        super(x, y);
        this.text = text;
        this.text_width = textWidth(this.text);
        this.fixed_width = -1;
        this.text_size = 12;
        this.pad = {
            left: 5,
            right: 5,
            top: 5,
            bottom: 5
        }
        this.height = this.text_size + this.pad.top + this.pad.bottom;
    }

    setTextSize(text_size) {
        this.text_size = text_size;
        this.height = this.text_size + this.pad.top + this.pad.bottom;
    }

    setWidth(width) {
        this.fixed_width = width;
        this.text_width = width;
    }

    setText(text) {
        this.text = text;
        this.text_width = this.fixed_width > -1 ? this.fixed_width : textWidth(this.text);
    }

    padding(l, r, t, b) {
        let len = arguments.length;
        switch (len) {
            case 0:
                return false;
                break;
            case 1:
                this.pad = {
                    left: l,
                    right: l,
                    top: l,
                    bottom: l
                }
                break;
            case 2:
                this.pad = {
                    left: l,
                    right: l,
                    top: r,
                    bottom: r
                }
                break;
            case 3:
                return false;
                break;
            case 4:
                this.pad = {
                    left: l,
                    right: r,
                    top: t,
                    bottom: b
                }
                break;
        }
        return true;
    }

    render() {
        super.render();
        textSize(this.text_size);
        fill(0, 125);
        rect(0, 0, this.text_width + (this.pad.right + this.pad.left), this.height);
        fill(255);
        text(this.text, this.pad.left, this.pad.top + this.text_size);
    }
}

class Renderer extends Component {
    constructor(x, y, renderer) {
        super(x, y);
        this.renderer = renderer;
    }

    render() {
        super.render();
        this.renderer.render();
    }
}