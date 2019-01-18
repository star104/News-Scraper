function getSaved () {
    $.get('/favorite', function(data){
        $(".table tbody").empty();
        for (var i = 0; i < data.length; i++) {
            $(".table tbody").append(`<tr><td>${data[i].title}</td><td class="link-text"><a href="${data[i].link}">Link to article</a></td><td><p>Note</td><td><button data-value=${data[i]._id} class="setfavorite">Delete</button></td></tr>`);
        }
    })

  }

  $(document).on('click', '.setfavorite', function () {

    var id = $(this).attr('data-value');
   
    $.ajax({
        method: 'PUT',
        url: '/record/' + id,
        data: { favorite: false} 
    }).then( function(data){
        console.log(data)
        location.reload();
    })
})

  getSaved();