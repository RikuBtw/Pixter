$(document).ready(function(){

  $("#commune").on("keyup", function(){
    $("#suggestions").html("");
    if($(this).val().length !== 0 ){
      $("#autocomplete").css("display", "block");
      $.ajax({
        url : 'http://infoweb-ens.iut-nantes.univ-nantes.prive/~jacquin-c/codePostal/commune.php',
        type:'GET',
        dataType:'json', // a renseigner d'après la doc du service, par défaut callback
        data:'commune='+$("#commune").val()+"&maxRows=20",
        success:function(data){
          $.each(data, function(i,item){
            $("<option />").attr("value", item.Ville).appendTo("#suggestions");
            });
        },
        error: function(resultat,statut,erreur){
          alert("erreur : "+erreur);},
         });
       }
    });

  });
