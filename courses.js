// js/liste_courses.js

let ingredients = new Set(JSON.parse(localStorage.getItem("listeCourses")) || []);

document.addEventListener("DOMContentLoaded", () => {
    afficherIngredients();

    const btnAjouter = document.getElementById("btn-ajouter");
    const input = document.getElementById("ingredientInput");

    btnAjouter.addEventListener("click", () => {
        const ingredient = input.value.trim();
        if (ingredient) {
            if (ingredients.has(ingredient)) {
                alert("Cet ingrédient est déjà dans la liste !");
            } else {
                ingredients.add(ingredient);
                enregistrerEtAfficher();
                input.value = "";
                alert(`${ingredient} a été ajouté à votre liste !`);
            }
        }
    });

    document.getElementById("btn-exporter").addEventListener("click", exporterListe);
    document.getElementById("btn-supprimer").addEventListener("click", supprimerListe);
});

function afficherIngredients() {
    const list = document.getElementById("ingredientList");
    list.innerHTML = "";
    
    if (ingredients.size === 0) {
        list.innerHTML = '<li class="list-group-item bg-dark text-white border-light">Aucun ingrédient pour le moment</li>';
        return;
    }

    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-light";
        li.innerHTML = `
            ${ingredient} 
            <button class="btn btn-danger btn-sm" onclick="supprimerIngredient('${ingredient.replace(/'/g, "\\'")}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        list.appendChild(li);
    });
}

function supprimerIngredient(ingredient) {
    ingredients.delete(ingredient);
    enregistrerEtAfficher();
}

function enregistrerEtAfficher() {
    localStorage.setItem("listeCourses", JSON.stringify(Array.from(ingredients)));
    afficherIngredients();
}

function exporterListe() {
    if (ingredients.size === 0) {
        alert("Votre liste de courses est vide !");
        return;
    }

    const contenu = Array.from(ingredients).join("\n");
    const blob = new Blob([contenu], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "liste_courses.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function supprimerListe() {
    if (confirm("Voulez-vous vraiment supprimer toute la liste de courses ?")) {
        ingredients.clear();
        localStorage.removeItem("listeCourses");
        afficherIngredients();
    }
}

// Fonction pour ajouter depuis d'autres pages
function ajouterIngredientALaListe(ingredient) {
    if (!ingredient) return;
    
    if (ingredients.has(ingredient)) {
        console.log("Ingrédient déjà présent");
        return;
    }
    
    ingredients.add(ingredient);
    enregistrerEtAfficher();
}