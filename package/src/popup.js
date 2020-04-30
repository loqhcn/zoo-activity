let isLock = false;

let zindex = 100;

let htmltop = 0;

// 弹出层锁定管理
let locks = {

};


class Popup {

    /**
     * 更新弹出层锁定背景
     * @param {*} newValue 显示状态
     * @param {*} name 弹出层名称
     * 
     * @demo 在有弹出层的页面监听visible;
     * 
     */
    updateLockStatus(newValue, name) {
        locks[name] = newValue;
        if (newValue) {
            htmltop =
                document.querySelector("html").scrollTop ||
                document.querySelector("body").scrollTop ||
                0;

            window.document.body.className = "noscroll";
            document.body.style.top = `-${htmltop}px`;
        } else {

            //是否已关闭所有弹出层
            let isClose = true;
            for (let x in locks) {
                if (locks[x]) {
                    isClose = false;
                    break;
                }
            }
            //关闭弹出层解除锁定
            if (isClose) {
                window.document.body.className = "";
                document.body.style.top = "";
                document.querySelector("html").scrollTop = document.querySelector(
                    "body"
                ).scrollTop = htmltop;
            }


        }
    }
}

export default new Popup;