$(document).ready(function () {
    $.ajax({
      url: "src/data/data.json",
      method: "GET",
      dataType: "json",
      success: (data) => {
        console.log("Données chargées :", data);
  
        const recettesParPage = 9;
        let recettes = data.recettes;
        let totalPages = Math.ceil(recettes.length / recettesParPage);
  
        function afficherRecettes(page) {
          let debut = (page - 1) * recettesParPage;
          let fin = debut + recettesParPage;
          let recettesPage = recettes.slice(debut, fin);
          let containerId = `#recettes-container-${page}`;
  
          $(containerId).empty();
  
          recettesPage.forEach(recette => {
            let recetteHTML = `
              <div class="col-md-4">
                <div class="card bg-secondary">
                  <img src="${recette.img}" class="card-img-top" alt="${recette.nom}">
                  <div class="card-body text-center">
                    <h2 class="card-title fs-5">${recette.nom}</h2>
                    <button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#detailsRecette-${recette.id}">Détails</button>
                    <button class="favorite-btn" data-id="${recette.id}" data-nom="${recette.nom}" data-img="${recette.img}">⭐</button>
                  </div>
                </div>
              </div>
  
              <div class="modal fade" id="detailsRecette-${recette.id}" tabindex="-1">
                <div class="modal-dialog">
                  <div class="modal-content text-dark">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5">${recette.nom}</h1>
                      <p class="fs-6 text-muted">${recette.categorie}</p>
                    </div>
                    <div class="modal-body">
                      <h2 class="fs-6">Liste d'ingrédients</h2>
                      <ul>${recette.ingredients.map(ing => `<li>${ing.nom}</li>`).join("")}</ul>
                      <h3 class="fs-6">${recette.etapes}</h3>
                      <p>Durée : ${recette.temps_preparation}</p>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Fermer</button>
                    </div>
                  </div>
                </div>
              </div>
            `;
            $(containerId).append(recetteHTML);
          });
        }
  
        for (let i = 1; i <= totalPages; i++) {
          afficherRecettes(i);
        }
  
        let suggestions = new Set();
        recettes.forEach(recette => {
          suggestions.add(recette.nom.toLowerCase());
          recette.ingredients.forEach(ingredient => {
            suggestions.add(ingredient.nom.toLowerCase());
          });
        });
  
        $("#search-bar").on("input", function () {
          const query = $(this).val().toLowerCase();
          const results = [...suggestions].filter(item => item.includes(query)).slice(0, 10);
  
          const $autocompleteList = $("#autocomplete-list");
          $autocompleteList.empty();
  
          if (query.length > 1 && results.length > 0) {
            results.forEach(result => {
              $autocompleteList.append(`<li class="list-group-item list-group-item-action">${result}</li>`);
            });
  
            $(".list-group-item").on("click", function () {
              const selected = $(this).text();
              $("#search-bar").val(selected);
              $autocompleteList.empty();
              rechercherRecettes(selected);
            });
          } else {
            $autocompleteList.empty();
          }
  
          rechercherRecettes(query);
        });
  
        function rechercherRecettes(terme) {
          const resultat = recettes.filter(recette =>
            recette.nom.toLowerCase().includes(terme.toLowerCase()) ||
            recette.ingredients.some(ingredient => ingredient.nom.toLowerCase().includes(terme.toLowerCase()))
          );
  
          $("#recettes-container-1").empty();
  
          if (resultat.length === 0) {
            $("#recettes-container-1").html("<p>Aucune recette trouvée.</p>");
          } else {
            resultat.forEach(recette => {
              let recetteHTML = `
                <div class="col-md-4">
                  <div class="card bg-secondary">
                    <img src="${recette.img}" class="card-img-top" alt="${recette.nom}">
                    <div class="card-body text-center">
                      <h2 class="card-title fs-5">${recette.nom}</h2>
                      <button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#detailsRecette-${recette.id}">Détails</button>
                      <button class="favorite-btn" data-id="${recette.id}" data-nom="${recette.nom}" data-img="${recette.img}">⭐</button>
                    </div>
                  </div>
                </div>
              `;
              $("#recettes-container-1").append(recetteHTML);
            });
          }
        }
      },
  
      error: (xhr, status, error) => {
        console.error("Erreur lors du chargement du fichier JSON :", error);
      }
    });
  });
  