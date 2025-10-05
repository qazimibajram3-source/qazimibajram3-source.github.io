document.addEventListener('DOMContentLoaded', function() {
    // Protection globale contre les doubles soumissions
    if (window.formHandlerLoaded) {
        console.log('Gestionnaire de formulaire déjà chargé, évitement du double chargement');
        return;
    }
    window.formHandlerLoaded = true;
    
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzYKkI3bV2K8wrH0_WcOxzgrPTZbhxTK4S2Cvs2gcCbpOD55KeC0XbfFWTj2dnu_MFekw/exec';
    
    let isSubmitting = false;
    let submissionCount = 0;

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            // Compteur de soumissions pour debug
            submissionCount++;
            console.log(`=== TENTATIVE SOUMISSION #${submissionCount} ===`);
            
            if (isSubmitting) {
                console.log('BLOQUÉ: Soumission déjà en cours');
                return false;
            }
            
            isSubmitting = true;

            // Validation des champs requis
            const nom = form.querySelector('#nom').value.trim();
            const prenom = form.querySelector('#prenom').value.trim();
            const telephone = form.querySelector('#telephone').value.trim();
            const email = form.querySelector('#email').value.trim();
            const adresse = form.querySelector('#adresse').value.trim();
            const type_projet = form.querySelector('#type_projet').value.trim();
            const message = form.querySelector('#message').value.trim();

            if (!nom || !prenom || !telephone || !adresse || !type_projet || !message) {
                formMessage.textContent = 'Veuillez remplir tous les champs obligatoires marqués d\'un *.';
                formMessage.className = 'form-message error';
                isSubmitting = false;
                return false;
            }

            // Désactiver le bouton d'envoi
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Envoi en cours...';
            }

            // Afficher le message d'envoi
            formMessage.textContent = 'Envoi en cours...';
            formMessage.className = 'form-message info';

            try {
                // Préparer les données
                const uniqueId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
                const formData = {
                    nom: nom,
                    prenom: prenom,
                    telephone: telephone,
                    email: email,
                    adresse: adresse,
                    type_projet: type_projet,
                    message: message,
                    timestamp: new Date().toISOString(),
                    date_fr: new Date().toLocaleString('fr-FR'),
                    unique_id: uniqueId,
                    submission_count: submissionCount
                };

                console.log('Données à envoyer:', formData);

                // Créer l'URL avec les paramètres GET
                const urlParams = new URLSearchParams(formData);
                const getUrl = SCRIPT_URL + '?' + urlParams.toString();

                console.log('URL GET complète:', getUrl);
                console.log('Longueur URL:', getUrl.length);

                // Faire la requête avec fetch en mode no-cors (simple et efficace)
                const response = await fetch(getUrl, {
                    method: 'GET',
                    mode: 'no-cors'
                });

                console.log('✅ Requête envoyée avec succès');

                // Afficher le succès (en mode no-cors, on ne peut pas lire la réponse)
                formMessage.textContent = 'Message envoyé avec succès ! Nous vous recontacterons bientôt.';
                formMessage.className = 'form-message success';
                form.reset();
                console.log('✅ Succès confirmé');

            } catch (error) {
                console.error('Erreur lors de l\'envoi:', error);
                formMessage.textContent = "Une erreur s'est produite lors de l'envoi. Veuillez réessayer dans quelques instants.";
                formMessage.className = 'form-message error';
            } finally {
                // Réactiver le bouton après un délai
                setTimeout(() => {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                    }
                    isSubmitting = false;
                }, 3000);

                // Effacer le message après 6 secondes si c'est un succès
                setTimeout(() => {
                    if (formMessage.classList.contains('success')) {
                        formMessage.textContent = '';
                        formMessage.className = 'form-message';
                    }
                }, 6000);
            }
            
            return false;
        });
    }

    // Navigation toggle
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // Mise à jour automatique de l'année dans le footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});