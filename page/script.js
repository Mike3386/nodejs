function CreateTable(data) {
    var table = "<p id='headerTb'>Книги</p><table border='1'><tr><th>Название</th><th>Год</th><th>Автор</th><th>Жанр</th><th>Доп действия</th></tr>";
    for(var i=0; i<data.length; i++)
        table+="<tr><td>"+data[i].bookName+"</td><td>"+data[i].year+"</td><td>"+data[i].author+"</td><td>"+data[i].genre+"</td><td>"+
        "<a href='http://localhost:1312/'>На главную</a></td></tr>";
    table+="</table>";
    var dataDiv = $('#data');
    dataDiv.html(table);
    currentBooksArray = data;
}

$('#getData').on('click', function () {
    var query = 'http://localhost:1312/GetBooks?';
    if($("#sort option:selected").text()!="") query+="sort="+$("#sort option:selected").text()+'&';
    var SearchBoxVal = $('#searchBox').val();
    if(SearchBoxVal!="") query+="search="+SearchBoxVal+'&';
    $.get(query).then(function (data) {
        CreateTable(data.arr);
    }).fail(function (err) {
        alert(err);
    });
});



var currentBooksArray;