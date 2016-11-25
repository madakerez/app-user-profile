export function isJSON (str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function replacEmptyObjsVal(data, str) {
    $.each(data, function (index, el) {
      $.each(el, function (index, item) {
          if(!item){
             el[index] = str;
          }
      })
    });

    return data;
}

export function numberToString (string) {
    if(string == 1) {
        return 'TAK'
    } else {
        return 'NIE'
    }
}

export function isActive (string) {
    if(string == 0) {
        return 'aktywna'
    } else {
        return 'nieaktywna'
    }
}

export function cutString() {
    let cut= s.indexOf(' ', n);
    if(cut== -1) return s;
    return s.substring(0, cut)
}

export function queryString (){
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}

