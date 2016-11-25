export default class EditComponent {
    constructor($container){
        this.$container = $container;
        this.$saveBtn = $container.find('.save-btn');
        this.$editBtn = $container.find('.edit-btn');
        this.$editMark = $container.find('.edit-mark');

        this.attachListener();
    }

    attachListener() {
        let $editBtn = this.$container.find('.edit-btn');
        $editBtn.on('click', (e)=> {
            e.preventDefault();
            this.makeContentEditable();
            this.manageBtnsState();
            this.markEditingContent();
        });
    }

    makeContentEditable (){
        let editableContent = this.$container.find('[editable]');
        $.each(editableContent, (index, item) => {
            $(item).attr('contenteditable', true);
        });
    }

    manageBtnsState(){
        this.$saveBtn.css('display', 'flex');
        this.$editBtn.css('display', 'none');
    }

    markEditingContent(){
        this.$editMark.addClass('edit-mark__active');
    }
}
