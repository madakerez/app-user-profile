import Handlebars from 'handlebars-template-loader/runtime';

export default class TemplateManager {
    constructor($appendTo, $tpl, data) {
        this.$sourceTpl = $tpl;
        this.tpl_data = data;
        this.$selector = $appendTo;
    }

    prepareTemplate(){
        return this.$sourceTpl(this.tpl_data);
    }

    insertTemplate(){
       let _template = this.prepareTemplate();
       this.$selector.append(_template);
   }

    registerHelper(name, callback){
        Handlebars.registerHelper(name, callback);
    }

}