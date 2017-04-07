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
        url : 'http://api.flickr.com/services/feeds/photos_public.gne',
        type:'GET',
        dataType:'jsonp',
        jsonp: 'jsoncallback',
        data: 'tags='+$("#commune").val()+'&tagmode=any&format=json',
        success:function(data){
          if (data.length == 0 ) {
            console.log("NO DATA!")
          }else{
            $(".masonry").html("");
            $('#tableau').DataTable().rows().clear();
            $.each(data.items, function(i,item){
              i+=1;
              $("<div>").attr("class", "item").attr("id", "item-grille"+i).appendTo(".masonry");
              $("<img>").attr("src", item.media.m).appendTo("#item-grille"+i);
              $("#item-grille"+i).click(afficherInfos);

              image =  item.media.m;
              imageStyle = "<div style='width: 300px; height: 200px; background-image: url("+image+"); background-position: 50% 50%; background-repeat: no-repeat;'></div>";
              nom = item.title;
              heure = item.date_taken;
              auteur = item.author.substring(20).slice(0,-2);
              id_auteur = item.author_id;
              tags = item.tags;
              tags = tags.replace(new RegExp(" ", "g"), ", ");
              description = item.description;

              $('#tableau').DataTable().row.add([
                imageStyle,
                nom,
                heure,
                auteur,
                tags
              ]).draw( false );
              if ( i == $("#nbPhotos").val() ) return false ;
            });
          }
        },
        error: function(resultat,statut,erreur){
          alert("erreur : "+erreur);},
        });

    }
    function afficherInfos(){
        $("#autocomplete").css("display", "block");
        var titre, datePost, username;
        $.ajax({
          url : 'https://api.flickr.com/services/rest/',
          type:'GET',
          dataType:'json',
          data:'method=flickr.photos.getInfo&api_key=4eb465e56335170d0ad0bf809b89c00f&photo_id='+$(this).data("id")+'&secret='+$(this).data("secret")+'&format=json&nojsoncallback=1',
          success:function(data){
              username = data.photo.owner.username;
              titre = data.photo.title._content;
              datePost = formattedDate;


          },
          error: function(resultat,statut,erreur){
            alert("erreur : "+erreur);
          },
          async: false
          });
          console.log(titre);
          console.log(datePost);
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
