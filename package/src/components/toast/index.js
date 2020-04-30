import Vue from 'vue'
import Toast from './Toast'

let mainConstructor = Vue.extend(Toast);

let instance = null;
let instances = [];

/**
 * 显示一个轻提示
 * 
 * @param {*} msg 
 * @param {*} time
 * 
 * @return false;
 */
export default function (msg, duration) {
    //组件实例
    instance = new mainConstructor({
        data: {
            msg: msg || 'toast msg',
            duration: duration || 2000
        }
    });
    //挂载
    instance.$mount();
    document.body.appendChild(instance.$el);
    
    //显示
    instance.show();
}