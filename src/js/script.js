$(document).ready(function() {
    // 🔍 Redirection vers la page des recettes lors d'une recherche sur Entrée
    const searchBar = document.querySelector("#search-bar");
    if (searchBar) {
        searchBar.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                const query = searchBar.value.trim();
                if (query.length > 0) {
                    window.location.href = `recettes.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    // 🔄 Chargement des recettes aléatoires
    $.ajax({
        url: 'src/data/data.json',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            console.log(data);
            
            // Mélanger les recettes et sélectionner 3 aléatoirement
            let recettesAleatoires = data.recettes.sort(() => 0.5 - Math.random()).slice(0, 3);
            
            recettesAleatoires.forEach(function(recette) {
                let recetteHTML = `
                <div class="recipe-card w-25 m-2">
                    <h2>${recette.nom}</h2>
                    <img src="${recette.img}" alt="${recette.nom}" class="img-fluid rounded">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.</p>
                </div>
                `;

                $('#recettes-container').append(recetteHTML);
            });
        },
        error: () => {
            console.error('Une erreur est survenue lors de la récupération des recettes.');
            $('#recettes-container').html('<p>Une erreur est survenue lors de la récupération des recettes.</p>');
        }
    });
});
