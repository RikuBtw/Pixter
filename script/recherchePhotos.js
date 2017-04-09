$(document).ready(function(){

    $("#afficherPhotos").on("click", afficherPhotos);
    $(document).keypress(function(e) {
      if(e.which == 13) {
        afficherPhotos();
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
              photo.titre = "test" ;
              photo.heurePost = "";
              photo.datePost = "";
              photo.auteurPseudo = "";
              photo.auteur = "";
              photo.tags ="";
              photo.description="";

              var titre = "test 1";
              $.ajax({
                url : 'https://api.flickr.com/services/rest/',
                type:'GET',
                dataType:'json',
                data:'method=flickr.photos.getInfo&api_key=4eb465e56335170d0ad0bf809b89c00f&photo_id='+photo.id+'&secret='+photo.secret+'&format=json&nojsoncallback=1',
                success:function(data){
                    photo.titre = data.photo.title._content;
                    var date = new Date(data.photo.dates.posted*1000);
                    var hours = date.getHours();
                    var minutes = "0" + date.getMinutes();
                    var seconds = "0" + date.getSeconds();
                    var day = "0"+date.getDate();
                    var month = ("0" + (date.getMonth() + 1)).slice(-2)
                    var year = date.getFullYear();
                    photo.heurePost = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                    photo.datePost = day+"/"+month+'/'+year;
                    photo.auteurPseudo = data.photo.owner.username;
                    tag ="";
                    for (j =0 ; j< data.photo.tags.tag.length; j++){
                      tag += data.photo.tags.tag[j].raw += " ";
                    }
                    photo.tags = tag;
                    photo.description = data.photo.description._content;
                    titre = "test 2";
                },
                async: false,
                error: function(resultat,statut,erreur){
                  alert("erreur : "+erreur);},
                });
              imageStyle = "<div style='width: 300px; height: 200px; background-image: url("+photo.photo+");background-repeat: no-repeat;background-size:cover;'></div>";
              $('#tableau').DataTable().row.add([
                imageStyle,
                photo.titre,
                photo.heurePost,
                photo.datePost,
                photo.auteurPseudo,
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
      $(".ui-dialog-title").text(titre);
      $("<img>").attr("src", src).appendTo("#dialog");
      $("<p>").text(titre).appendTo("#dialog");
      $("<p>").text(datePost).appendTo("#dialog");
      $("<p>").text(username).appendTo("#dialog");
    }
  }

);
