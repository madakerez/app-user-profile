import HttpService from './HttpService';

export default class SaveComponent {
    constructor($container, $method) {
        this.$container = $container;
        this.$method = $method;
        this.$saveBtn = $container.find('.save-btn');
        this.$editBtn = $container.find('.edit-btn');
        this.$editMark = $container.find('.edit-mark')

        this.attachListener();
    }

    attachListener() {
        let $saveBtn = this.$container.find('.save-btn');
        $saveBtn.on('click', (e)=> {
            e.preventDefault();
            this.makeApiRequest();
        });
    }

    getData() {
        let data = {};
        let sendableContent = this.$container.find('[sendable]');

        $.each(sendableContent, (index, item)=> {
            let objectKey = $(item).data().name;
            data[objectKey] = $(item).text();
        });

        return data;
    }

    makeApiRequest() {
        let httpService = new HttpService();
        let saveData = httpService.call(this.$method, this.getData(), 'POST');

        saveData.then(response => {
            alertify.success('Edycja danych przebiegła poprawnie');
            this.revertState();
        }, reject => {
            let errorText = JSON.parse(reject.responseText)[0];
            alertify.error(errorText);
        });
    }

    revertState() {
        this.manageBtnsState();
        this.unmakeContentEditable();
        this.unmarkEditingContent();
    }

    manageBtnsState() {
        this.$saveBtn.css('display', 'none');
        this.$editBtn.css('display', 'flex');
    }

    unmarkEditingContent() {
        this.$editMark.removeClass('edit-mark__active');
    }

    unmakeContentEditable() {
        let editableContent = this.$container.find('[editable]');
        $.each(editableContent, (index, item)=> {
            $(item).attr('contenteditable', false);
        });
    }
}
