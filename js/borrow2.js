alasql.fn.DD = function(thisVal) { 
    if(thisVal > 0) {
    return ExcelDateToJSDate(thisVal).toDateString();
    } else {
        return "no date specified"
    }
}

alasql('CREATE TABLE noelbexcel');

//initialize fulldata
var fullData;

$('#loader-wrapper, #info-box, #table-div, #top-header').removeClass('hide');

alasql.promise('SELECT * INTO noelbexcel FROM xlsx("test-db.xlsx")').
then(function(data){
        $('#loader-wrapper').addClass('hide');
    }).
then(function(data){
        //select everything --can we concatenate?
        var initData = alasql.promise('SELECT CONCAT(abstract,description,target_audience) as concated FROM noelbexcel');
        return initData;
        }).
then(function(initData){       //delete this section later         
    alasql.tables.testtable.data = initData; 
    return initData;
    }).
then(function(initData){
    var fullText = initData.map(function(elem){ 
        return elem.concated; 
        }).join(",");
    console.log('fullText: ');
    console.log(fullText);
    return fullText 
    }).
then(function(fullText){
    return first_pass = fullText.replace(/[\W_]+/g," "); }).
then(function(first_pass){
    var count_words = count(first_pass);
    console.log('count_words: ');
    console.log(count_words);
    return count_words;        
    }).
then(function(count_words){
    var output = Object.entries(count_words).
        map(([word, occurrence]) => ({word,occurrence}));
    console.log('output: ');
    console.log(output);
    return output
    }).
then(function(output){                
    //window.fullData = output;
    alasql.tables.fullWords.data = output; }).
then(function(output){
    var fullData = alasql("SELECT word FROM fullWords WHERE word NOT IN ('and','a','the','or') ORDER BY occurrence DESC"); 
    console.log('fullData..: ');
    console.log(fullData);
    return fullData
    });

/* TRY THE QUERIES BELOW:

    alasql.promise('WITH foo AS (select word from fullWords), bar AS (select * from noelbexcel) SELECT foo.word, count(bar.abstract) as counter FROM foo JOIN bar ON foo.word LIKE concat("%",bar.abstract,"%")');

alasql.promise('WITH foo AS (select word from fullWords), bar AS (select * from noelbexcel) SELECT foo.word, count(bar.abstract) as counter FROM foo JOIN bar ON foo.word = bar.abstract');

https://github.com/agershun/alasql/issues/832

https://dba.stackexchange.com/questions/97180/mysql-count-rows-from-another-table-for-each-record-in-table


*/
                /*
                then(function(fullData){
                        $('#noel-table').DataTable({
                                "aaData": fullData,
                                "aoColumns": [
                                    { "mData": "word" },
                                    { "mData": "occurrence" },
                                ],
                                mark: true,
                                fixedHeader: true,
                                responsive: true,
                                "initComplete": function( settings, json ) {
                                                $('#loader-wrapper').addClass('hide');
                                                var tag2 = tag.toString().replace(/'/g, '');
                                                var fintag = tag2.replace(/,/g , " ");
                                                $('input[aria-controls="noel-table"]').val(fintag).trigger('keyup');
                                                //console.log(fintag);
                                                //console.log(tag);
                                                //console.log(xlsxdata);
                                                $('input[aria-controls="noel-table"]').val('');
                                },
                                "sDom": '<"top"iflpB<"clear">>rt<"bottom"iflpB<"clear">>',
                                "oLanguage": {
                                                "sSearch": "Quick Search:"
                                                },
                                buttons: [
                                    {
                                        extend: 'excelHtml5',
                                        text: 'Export to Excel',
                                        title: 'Data Export'
                                        }
                                ]
                        });

                    });

*/
        /*
            return alasql.tables.fullWords.data = output;            
        }).then(function(output){
            window.fullData = alasql("SELECT * FROM fullWords WHERE occurrence > 50 and word NOT IN ('the','or') ORDER BY occurrence DESC");
        });

        */
alasql('CREATE TABLE fullWords');
alasql('CREATE TABLE testtable');

var common_words = ["and","of","able"];
   

function count(sentence) {
  var list = sentence.toString().split(/,| /);
  var words = {};
  for (var i = 0; i < list.length; i++) {
    if (!(words.hasOwnProperty(list[i]))) {
      words[list[i]] = 0;
    }
    ++words[list[i]];
  }
  return words;
}



function returnArr(text) {
    var str = text;
    var tokens = [].concat.apply([], str.split('"').map(function(v,i){
       return i%2 ? v : v.split(' ')
    })).filter(Boolean);
return tokens;
}



$('#info, #info-box-close').on('click',function(){
    $('#info-box').toggleClass('info-init-state');
});