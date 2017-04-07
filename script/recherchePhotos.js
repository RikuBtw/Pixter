$(document).ready(function(){

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
            $("#tableau tbody").empty();
            $.each(data.photos.photo, function(i,item){
              i+=1;
              $("<div>").attr("class", "item").attr("id", "item-grille"+i).appendTo(".masonry");
              $("<img>").attr("src", "https://farm"+item.farm+".staticflickr.com/"+item.server+"/"+item.id+"_"+item.secret+".jpg").appendTo("#item-grille"+i);
              $("#item-grille"+i).click(dialog);

              image = "https://farm"+item.farm+".staticflickr.com/"+item.server+"/"+item.id+"_"+item.secret+".jpg";
              imageStyle = "<div style='width: 300px; height: 200px; background-image: url("+image+"); background-position: 50% 50%; background-repeat: no-repeat;'></div>";
              nom = "Nom";
              heure = "Heure";
              auteur = "Auteur";
              tags = "Tags";
              geolocalisation = "Geo";
              content = "<tr><td>"+imageStyle+"</td><td>"+nom+"</td><td>"+heure+"</td><td>"+auteur+"</td><td>"+tags+"</td><td>"+geolocalisation+"</td></tr>";
              $('#tableau').append(content);
            });
          }
          $('#tableau').DataTable();
        },
        error: function(resultat,statut,erreur){
          alert("erreur : "+erreur);},
        });

    }
    function dialog() {
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
      $("<img>").attr("src", $(this).find('img').attr("src")).appendTo("#dialog");
    }
  }

);
