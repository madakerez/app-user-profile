import Handlebars from 'handlebars-template-loader/runtime';
import ToggleElement from '../core/animations/toggleElement';
import ModalManager from '../core/modalManager';
import PromptManager from '../core/promptManager';
import TemplateManager from '../core/templateManager';
import HttpService from '../core/HttpService';
import EditComponent from '../core/EditComponent';
import SaveComponent from '../core/SaveComponent';


import { isJSON, replacEmptyObjsVal, numberToString, queryString, isActive, cutString } from '../core/utils';
import {heightAnim} from '../core/animations/customGSAPAnim'
import customerProfileTpl from '../templates/pages/customer_profile.hbs';
import transactionDetailsTpl from '../templates/pages/transaction_details.hbs';


export default class customerProfile {
    constructor() {
        this.pageDOM_ID = $('#user_profile');
        this.userId = queryString().id;

        //modals instances
        this.addCardModal = null;
        this.addPointsModal = null;
        this.subtractPointsModal = null;
        this.blockUserModal = null;
    }

    init(){
        this.setPageContent();
    }

    modifyURL(){
        let url = `/klienci/szczegoly?id=${this.userId}`;
        window.history.pushState("Klienci", "Klienci", url);
    }

    setPageContent(){
        let httpService = new HttpService();
        let customerDetailsPromise = httpService.call('/webapi/customer/details', {id: this.userId});

        customerDetailsPromise.then(response => {
            //JSON parse, null replace and main page template init
            let validData = this.prepareObjectData(response);
            let customerTemplate = new TemplateManager(this.pageDOM_ID, customerProfileTpl, validData);

            //Handlebars template - convert 1 and 0 to string yes or no value
            customerTemplate.registerHelper('numberToString', numberToString);
            customerTemplate.registerHelper('isActive', isActive);
            customerTemplate.insertTemplate();

            this.setPageToggleAnim();
            this.prepareModalsInstances();
            this.attachListeners();
            this.manageBreadcrumbs();
            //this.modifyURL();

        }, reject => {
            httpService.onErrorResponse(reject);
        })

    }

    manageBreadcrumbs(){

        //set user FullName
        let $userFullNameWrap = $('#user_full_name');
        let $firstName = $('[data-name="first_name"]').text();
        let $lastName = $('[data-name="last_name"]').text();
        let fullName = `${$firstName} ${$lastName}`;
        $userFullNameWrap.text(fullName);

        let $searchInput = $('#search');
        let $searchBtn = $('#search-btn');

        $searchBtn.one('click', () => {
            this.pageDOM_ID.empty();
            this.userId = $searchInput.val();
            this.setPageContent();
        });
    }

    prepareModalsInstances(){

        //add card
        let addCardData = {
            title: 'Dodaj kartę',
            label_1_text: 'ID UŻYTKOWNIKA',
            label_1_name: 'id',
            label_1_content: this.userId,
            label_2_text: 'EAN',
            label_2_name: 'ean',
            reject: 'Anuluj',
            accept: 'Potwierdź'
        };

        //add Points
        let addPointsData = {
            title: 'Dodaj punkty',
            label_1_text: 'ID UŻYTKOWNIKA',
            label_1_name: 'id',
            label_1_content: this.userId,
            label_2_text: 'PUNKTY',
            label_2_name: 'points',
            reject: 'Anuluj',
            accept: 'Potwierdź'
        };

        //subtract Points
        let subtractPointsData = {
            title: 'Odejmij punkty',
            label_1_text: 'ID UŻYTKOWNIKA',
            label_1_name: 'id',
            label_1_content: this.userId,
            label_2_text: 'PUNKTY',
            label_2_name: 'points',
            reject: 'Anuluj',
            accept: 'Potwierdź'
        };

        //block User
        let blockUserData = {
            title: 'Czy na pewno chcesz zablokować użytkownika?',
            label_1_text: 'ID UŻYTKOWNIKA',
            label_1_name: 'id',
            label_1_content: this.userId,
            reject: 'Anuluj',
            accept: 'Potwierdź'
        };

        this.addCardModal = new ModalManager(addCardData, '/webapi/customer/add-card');
        this.addPointsModal = new ModalManager(addPointsData, '/webapi/transaction/add', {bonus: '1'});
        this.subtractPointsModal = new ModalManager(subtractPointsData, '/webapi/transaction/add', {bonus: '0'})
        this.blockUserModal = new PromptManager(blockUserData, '/webapi/customer/ban-user')
    }

    attachListeners(){

        //add card modal listener

        let $addCardBtn = $('#add_card');
        $addCardBtn.on('click', (e)=> {
            e.preventDefault();
            this.addCardModal.insertTemplate();
        });


        let $addPointsBtn = $('#add_points');
        $addPointsBtn.on('click', (e) => {
           e.preventDefault();
            this.addPointsModal.insertTemplate();
        });


        let $subtractPointsBtn = $('#subtract_points');
        $subtractPointsBtn.on('click', (e) => {
           e.preventDefault();
            this.subtractPointsModal.insertTemplate();
        });


        let $blockUserBtn = $('#block-user');
        $blockUserBtn.on('click', (e) => {
            e.preventDefault();
            this.blockUserModal.insertTemplate();
        });

        let cardData = {
            title: 'Czy na pewno chcesz usunąć kartę?',
            label_1_text: 'EAN KARTU',
            label_1_name: 'ean',
            reject: 'Anuluj',
            accept: 'Potwierdź'
        };

        let $removeCardBtn = $('.remove-card');
        $.each($removeCardBtn, (index, item) => {
            $(item).on('click', (e) => {
                e.preventDefault();
                let $wrap = $(item).closest('.card-table-row');
                let ean = $wrap.find('.ean-field').text();

                let data = Object.assign(cardData, {
                    label_1_content : ean
                });

                let prompt = new PromptManager(data, '/webapi/customer/ban-card', {id: this.userId});
                prompt.insertTemplate();
                
            })
        });

        //user details save and edit
        let $userDetailsWrap = $('#user-details');
        let editComponent = new EditComponent ($userDetailsWrap);
        let saveComponent = new SaveComponent ($userDetailsWrap, '/webapi/customer/update');

        let detailsBtns = $('.details-btn');

        $.each(detailsBtns, (index, item) => {
            $(item).on('click', (e)=> {
               e.preventDefault();
                let $wrap = $(item).closest('.table-row-wrap');
                let $appendWrap = $wrap.find('.table-details')
                let _transaction_id = $wrap.data().transactionId;

                //check if content do not exist else make request
                if(!$appendWrap.children().size()) {
                    this.setDetailsView(_transaction_id, $appendWrap);
                }
                else {
                    //toggle details anim
                    let wrap = $appendWrap.closest('.table-row-wrap');
                    wrap.addClass('table-row-wrap__active');
                    let el_height = $appendWrap.data().height;
                    heightAnim($appendWrap, el_height);
                }
            });
        });

        let $resendBtns = $('.resend-btn');

        $.each($resendBtns, (index, item) => {
            $(item).on('click', function(e) {
                e.preventDefault();
                let elementID = $(this).data().contactId;
                let httpService = new HttpService();
                let resendPromise = httpService.call('/webapi/customer/resend-token', {id: elementID});
                resendPromise.then(response => {}, reject => {
                    httpService.onErrorResponse(reject);
                });
            })
        });

    }

    setDetailsView(transaction_id, $appendWrap){
        let httpService = new HttpService();
        let transactionDetailsPromise = httpService.call('/webapi/transaction/details', {id: transaction_id});

        transactionDetailsPromise.then(response => {
            let validData = JSON.parse(response.body);
            let transactionDetailsTemplate = new TemplateManager($appendWrap, transactionDetailsTpl, validData);

            transactionDetailsTemplate.insertTemplate();

            let wrap = $appendWrap.closest('.table-row-wrap');
            wrap.addClass('table-row-wrap__active');
            wrap.find('.roll-up').on('click', (e)=>{
                e.preventDefault();
                wrap.removeClass('table-row-wrap__active');

                let element = wrap.find('.table-details');
                heightAnim(element, 0);

            });

            this.setElementHeight(wrap);

        }, reject => {
            httpService.onErrorResponse(reject);
        });

    }

    prepareObjectData(response){
        if(isJSON(response.body)) {
            let data = JSON.parse(response.body);
            let validData = replacEmptyObjsVal(data, '-');

            return validData;
        }
    }
    
    setElementHeight($wrap){
        let element = $(element);
        element = $wrap.find('.table-details');
        let el_height = $(element).height();
        element.height(0);
        element.attr('data-height', el_height);

        heightAnim(element, el_height);
    }

    setPageToggleAnim(){
        let $wrap = $('.card');
        $.each($wrap, function (index, item) {
            let _clickNode = $(item).find('.card-arrow');
            let _animNode = $(item).find('.card-container');
            let toggle = new ToggleElement(_clickNode, _animNode);
            toggle.init();
        });
    }

}