$(document).ready(function(){
    $("img").on("click", showcasePhotos);
    $("#afficherPhotos").on("click", afficherPhotos);
    $(document).keypress(function(e) {
      if(e.which == 13) {
        afficherPhotos();
      }
    });
    function afficherPhotos(){
      i = 0;
      $(".masonry").html(" ");
      $("#autocomplete").css("display", "block");
      $.ajax({

        url : 'https://api.flickr.com/services/rest/',
        type:'GET',
        dataType:'json', // a renseigner d'après la doc du service, par défaut callback
        data:'method=flickr.photos.search&api_key=4eb465e56335170d0ad0bf809b89c00f&tags='+$("#commune").val()+'&per_page='+$("#nbPhotos").val()+'&format=json&nojsoncallback=1',
        success:function(data){
          if (data.length == 0 ) {
            console.log("NO DATA!")
          }else{
            $(".masonry").html("");
            $.each(data.photos.photo, function(i,item){
              i+=1;
              $("<div>").attr("class", "item").attr("id", "item"+i).appendTo(".masonry");
              $("<img>").attr("src", "https://farm"+item.farm+".staticflickr.com/"+item.server+"/"+item.id+"_"+item.secret+".jpg").appendTo("#item"+i);
            });
          }
        },
        error: function(resultat,statut,erreur){
          alert("erreur : "+erreur);},
        });
    }

  function showcasePhotos(){
    console.log("test");
    $("div").attr("class", "showcase").appendTo("body");
    $("img").attr("src","https://farm4.staticflickr.com/3827/32869677673_22221ba5d8.jpg").appendTo(".showcase");
  }

});
