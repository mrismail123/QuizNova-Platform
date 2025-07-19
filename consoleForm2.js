
document.addEventListener("DOMContentLoaded", function() {
    const myForm = document.getElementById("newAccountForm");

    myForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const myFormDataStudent = {
            nom: myForm.nom.value,
            prenom: myForm.prenom.value,
            email: myForm.email.value,
            etablissement: myForm.etablissement.value,
            dateDeNaissance: myForm.date.value,
            filiere: myForm.fil.value,
            sexe: myForm.gender.value,
            motDePasse: myForm.password.value
        };
        localStorage.setItem("studentData", JSON.stringify(myFormDataStudent));
        window.location.href = "passingExam.html";
        fetch("http://localhost:5000/api/auth/inscription", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(myFormDataStudent)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Succès:", data);
            localStorage.setItem("studentData", JSON.stringify(myFormDataStudent));
            window.location.href = "passingExam.html";
        })
        .catch((error) => {
            console.error("Erreur:", error);
            alert("Il y a eu une erreur lors de l'envoi de vos données. Veuillez réessayer.");
        });
    });

    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
    
        const storedData = localStorage.getItem("studentData");
    
        if (!storedData) {
            alert("Aucun utilisateur trouvé ! Veuillez créer un compte ou vérifier votre email/mot de passe.");
            return;
        }
    
        const parsedData = JSON.parse(storedData);
    
        if (parsedData.email === email && parsedData.motDePasse === password) {
            alert("Connexion réussie !");
            localStorage.setItem("loginDataStudent", JSON.stringify({ email, password }));
            window.location.href = "passingExam.html";
        } else {
            alert("Aucune correspondance trouvée. Veuillez vérifier l'email ou le mot de passe.");
        }
    });
    

    const switchToSignup = document.getElementById("switchToSignup");
    switchToSignup.addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("newAccountForm").style.display = "block";
    });
    
    const switchToLogIn = document.getElementById("switchTologIn");
    switchToLogIn.addEventListener("click" , function(event) {
        event.preventDefault();
        
        document.getElementById("loginSection").style.display = "flex";
        document.getElementById("newAccountForm").style.display = "none";
    });
});