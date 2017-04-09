$(document).ready(function(){

    $("#afficherPhotos").on("click", afficherPhotos);
    $(document).keypress(function(e) {
      if(e.which == 13) {
        afficherPhotos2();
      }
    });
    $("#nbPhotos").on("input", function(){
       $('.value').html( $(this).val() );
    });
    function afficherPhotos(){
      i = 0;
      $(".masonry").html(" ");
      $("#autocomplete").css("display", "block");
      $.ajax({
        url : 'https://api.flickr.com/services/rest/',
        type:'GET',
        dataType:'jsonp',
        jsonp: 'jsoncallback',
        data:'method=flickr.photos.search&api_key=4eb465e56335170d0ad0bf809b89c00f&tags='+$("#commune").val()+'&per_page='+$("#nbPhotos").val()+'&format=json&nojsoncallback=1',
        success:function(data){
          if (data.length == 0 ) {
            console.log("NO DATA!")
          }else{
            $(".masonry").html("");
            $('#tableau').DataTable().rows().clear();
            $.each(data.photos.photo, function(i,item){

              var photo = new Object();

              photo.id=item.id;
              photo.secret=item.secret;
              photo.photo = "https://farm"+item.farm+".staticflickr.com/"+item.server+"/"+item.id+"_"+item.secret+".jpg";
              i+=1;
              $("<div>").attr("class", "item").attr("id", "item-grille"+i).appendTo(".masonry");
              $("<img>").attr("src", photo.photo).appendTo("#item-grille"+i);
              $("#item-grille"+i).click({param1: photo},afficherInfos);

              $.ajax({
                url : 'https://api.flickr.com/services/rest/',
                type:'GET',
                dataType:'json',
                data:'method=flickr.photos.getInfo&api_key=4eb465e56335170d0ad0bf809b89c00f&photo_id='+photo.id+'&secret='+photo.secret+'&format=json&nojsoncallback=1',
                success:function(data){
                  console.log(data);
                  $.each(data, function(i,item){
                    photo.titre = item.title._content;
                    photo.datePost = item.dates.taken;
                    photo.auteurPseudo = item.owner.username;
                    photo.auteur = item.owner.realname;
                    tag ="";
                    for (j =0 ; j< item.tags.tag.length; j++){
                      tag += item.tags.tag[j].raw += " ";
                    }
                    photo.tags = tag;
                    photo.description = item.description._content;
                    console.log(photo);
                  })
                },
                error: function(resultat,statut,erreur){
                  alert("erreur : "+erreur);},
                });

              console.log(photo.titre);
              console.log(photo.date);
              imageStyle = "<div style='width: 300px; height: 200px; background-image: url("+photo.photo+"); background-position: 50% 50%; background-repeat: no-repeat;'></div>";
              $('#tableau').DataTable().row.add([
                imageStyle,
                photo.titre,
                photo.datePost,
                photo.auteur,
                photo.tags
              ]).draw( false );
            });
          }
        },
        error: function(resultat,statut,erreur){
          alert("erreur : "+erreur);},
        });

    }
    function afficherInfos(event){
        $("#autocomplete").css("display", "block");
        var titre, datePost, username;
        username = event.data.param1.auteurPseudo;
        titre = event.data.param1.titre;
        datePost = event.data.param1.datePost;
        dialog($(this).find('img').attr("src"), datePost, titre, username);
    }
    function dialog(src, datePost, titre, username) {
      var originalContent;
      console.log("titre 2 : "+titre);
      $("#dialog").dialog(
        {
          height: 'auto',
        	width: 'auto',
        	modal: true,
          resizable: false,
        },
        {
          open : function(event, ui) {
            originalContent = $("#dialog").html();
          },
          close : function(event, ui) {
            $("#dialog").html(originalContent);
          }
        }

      );
      console.log($(".ui-dialog-title"));
      $(".ui-dialog-title").text(titre);
      $("<img>").attr("src", src).appendTo("#dialog");
      $("<p>").text(titre).appendTo("#dialog");
      $("<p>").text(datePost).appendTo("#dialog");
      $("<p>").text(username).appendTo("#dialog");
    }
  }

);
