$(document).ready(function () {
    function getAllData() {
        $.getJSON("/all", function (data) {
            console.log(data);
            $(".table tbody").empty();
            for (var i = 0; i < data.length; i++) {
                $(".table tbody").append(`<tr><td>${data[i].title}</td><td class="link-text"><a href="${data[i].link}">Link to article</a></td><td><button data-value=${data[i]._id} class="setfavorite">Save</button></td></tr>`);
            }
        });
    }

    $("#scrape-data").on("click", function (e) {
        e.preventDefault();
        $.getJSON("/scrape", function (data) {
            if (data) {
                getAllData();
            }
        })
    });

    $(document).on('click', '.setfavorite', function () {

        var id = $(this).attr('data-value');
        // alert(id);
        $.ajax({
            method: 'PUT',
            url: '/record/' + id,
            data: { favorite: true} 
        }).then( function(data){
            console.log(data)
        })
    })

    
});