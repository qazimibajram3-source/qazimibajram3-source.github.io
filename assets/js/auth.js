// Système de protection par mot de passe
(function() {
    const CORRECT_PASSWORD = '12345';
    const SESSION_KEY = 'menuiserie_auth';
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

    // Vérifier si l'utilisateur est déjà authentifié
    function isAuthenticated() {
        const authData = localStorage.getItem(SESSION_KEY);
        if (!authData) return false;

        try {
            const { timestamp, authenticated } = JSON.parse(authData);
            const now = new Date().getTime();
            
            // Vérifier si la session n'a pas expiré
            if (now - timestamp > SESSION_DURATION) {
                localStorage.removeItem(SESSION_KEY);
                return false;
            }
            
            return authenticated;
        } catch (error) {
            localStorage.removeItem(SESSION_KEY);
            return false;
        }
    }

    // Sauvegarder l'authentification
    function setAuthenticated() {
        const authData = {
            authenticated: true,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(authData));
    }

    // Créer l'interface de connexion
    function createLoginInterface() {
        // Créer l'overlay
        const overlay = document.createElement('div');
        overlay.id = 'auth-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // Créer la boîte de connexion
        const loginBox = document.createElement('div');
        loginBox.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 400px;
            width: 90%;
        `;

        loginBox.innerHTML = `
            <h2 style="margin: 0 0 20px 0; color: #333;">Accès protégé</h2>
            <p style="margin: 0 0 30px 0; color: #666;">Veuillez entrer le code d'accès pour continuer</p>
            <form id="auth-form">
                <input 
                    type="password" 
                    id="password-input" 
                    placeholder="Code d'accès"
                    style="
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #ddd;
                        border-radius: 5px;
                        font-size: 16px;
                        margin-bottom: 20px;
                        box-sizing: border-box;
                    "
                    maxlength="10"
                    required
                />
                <button 
                    type="submit"
                    style="
                        width: 100%;
                        padding: 12px;
                        background: #007cba;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: background 0.3s;
                    "
                    onmouseover="this.style.background='#005a87'"
                    onmouseout="this.style.background='#007cba'"
                >
                    Accéder au site
                </button>
            </form>
            <div id="error-message" style="
                margin-top: 15px;
                color: #d32f2f;
                font-size: 14px;
                display: none;
            "></div>
        `;

        overlay.appendChild(loginBox);
        document.body.appendChild(overlay);

        // Gestionnaire du formulaire
        const form = document.getElementById('auth-form');
        const passwordInput = document.getElementById('password-input');
        const errorMessage = document.getElementById('error-message');

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const enteredPassword = passwordInput.value.trim();

            if (enteredPassword === CORRECT_PASSWORD) {
                setAuthenticated();
                overlay.remove();
                showContent();
            } else {
                errorMessage.textContent = 'Code incorrect. Veuillez réessayer.';
                errorMessage.style.display = 'block';
                passwordInput.value = '';
                passwordInput.focus();
                
                // Effet de secousse pour indiquer l'erreur
                loginBox.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    loginBox.style.animation = '';
                }, 500);
            }
        });

        // Focus automatique sur le champ de saisie
        setTimeout(() => passwordInput.focus(), 100);
    }

    // Masquer le contenu du site
    function hideContent() {
        const style = document.createElement('style');
        style.id = 'auth-hide-style';
        style.textContent = `
            body > *:not(#auth-overlay) {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Afficher le contenu du site
    function showContent() {
        const hideStyle = document.getElementById('auth-hide-style');
        if (hideStyle) {
            hideStyle.remove();
        }
        document.body.style.visibility = 'visible';
    }

    // Ajouter les styles CSS pour l'animation de secousse
    function addShakeAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Fonction de déconnexion (optionnelle)
    function logout() {
        localStorage.removeItem(SESSION_KEY);
        location.reload();
    }

    // Initialisation
    function init() {
        console.log('Auth script initialized');
        addShakeAnimation();
        
        if (isAuthenticated()) {
            console.log('User already authenticated');
            showContent();
        } else {
            console.log('User not authenticated, showing login');
            hideContent();
            // Attendre que le DOM soit complètement chargé avant de créer l'interface
            setTimeout(() => {
                createLoginInterface();
            }, 100);
        }
    }

    // Exposer la fonction logout globalement (optionnel)
    window.menuiserieLogout = logout;

    // Démarrer immédiatement
    init();
})();