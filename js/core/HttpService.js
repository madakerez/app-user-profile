import utils from './utils';

export default class HttpService {
    constructor(){}

    call(url, data, method){
        return new Promise((resolve, reject) => {
            method = method || 'GET';

            $.ajax({
                type: method,
                url: url,
                data: data,
                dataType: 'text'
            }).success((data, xhr)=>{
                resolve({
                    status: xhr,
                    body: data
                })
            }).error(reject)

        })
    }

    onErrorResponse(error){
        let errorText = JSON.parse(error.responseText)[0];
        alertify.error(errorText);
    }
}
