function search(obj, str){
    let arr = Object.entries(obj)
    
    let results = {}
    arr.forEach(elm => {
        results[elm[0]] = 0

        elm[1].forEach(subelm => {
            let result = compare(subelm, str)
            if(result > results[elm[0]]){
                results[elm[0]] = result
            }
        })
    })

    results = Object.fromEntries(Object.entries(results).sort(([,a],[,b]) => a-b).reverse())

    return results
}

function squareAverage(arr){
    let sum = 0
    for(let i = 0; i < arr.length; i++){
        sum += arr[i] ** 2
    }
    return sum / arr.length
}

function compare(a,b) {
    var equivalency = 0;
    var minLength = (a.length > b.length) ? b.length : a.length;    
    var maxLength = (a.length < b.length) ? b.length : a.length;    
    for(var i = 0; i < minLength; i++) {
        if(a[i] == b[i]) {
            equivalency++;
        }
    }
    

    var weight = equivalency / maxLength;
    return (weight * 100);
}