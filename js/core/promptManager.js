import Handlebars from 'handlebars-template-loader/runtime';
import TemplateManager from './templateManager';
import modalTpl from '../templates/prompt.hbs';
import HttpService from './HttpService';
import {opacityAnim} from './animations/customGSAPAnim';


export default class PromptManager extends TemplateManager {
    constructor(tpl_data, method, extraData) {
        super($('#modal-append-wrap'), modalTpl, tpl_data);
        this.$modalWrap = $('#modal-append-wrap');
        this.method = method;
        this.extraData = extraData;
    }

    attachModalListeners(){
        $('.exit-modal').on('click',(e)=> {
            e.preventDefault();
            opacityAnim(this.$selector, 0);
            this.$modalWrap.empty();
        });
        
        $('.save-modal').on('click',(e)=> {
            e.preventDefault();
            this.makeApiRequest();
        });
    }

    insertTemplate(){
        let _template = this.prepareTemplate();
        this.$selector.append(_template);
        this.attachModalListeners();
        opacityAnim(this.$selector, 1);
    }

    getData(){
        let field_1 = $('#field_1');

        let data = {};
        data[field_1.data().name] = field_1.text();

        if(this.extraData){
            data = Object.assign(data, this.extraData);
        }

        return data;
    }

    makeApiRequest() {
        let httpService = new HttpService();
        let saveData = httpService.call(this.method, this.getData(), 'POST');

        saveData.then(response => {
            alertify.success('Operacja przebiegła poprawnie');
        }, reject => {
            let errorText = JSON.parse(reject.responseText)[0];
            alertify.error(errorText);
        });
    }

}