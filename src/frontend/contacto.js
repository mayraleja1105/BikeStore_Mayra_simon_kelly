document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica de sesión de usuario ---
    const userSection = document.getElementById('userSection');
    const userName = document.getElementById('userName');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (usuario) {
        userName.textContent = `Bienvenido, ${usuario.nombre}`;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('usuario');
            localStorage.removeItem('carrito');
            window.location.href = 'index.html';
        });
    } else {
        userName.textContent = '';
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        loginBtn.addEventListener('click', () => {
            window.location.href = 'iniciar.html';
        });
    }

    // --- Función para abrir Google Maps ---
    window.abrirMapa = function() {
        const direccion = encodeURIComponent('Calle 123 #45-67, Bogotá, Colombia');
        const url = `https://www.google.com/maps/search/?api=1&query=${direccion}`;
        window.open(url, '_blank');
    };

    // --- Efectos visuales para los elementos de información ---
    const infoItems = document.querySelectorAll('.info-item');
    
    infoItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in');
    });

    // --- Efectos para redes sociales ---
    const redesSociales = document.querySelectorAll('.red-social');
    
    redesSociales.forEach((red, index) => {
        red.addEventListener('click', (e) => {
            e.preventDefault();
            
            const redSocial = red.querySelector('span').textContent.toLowerCase();
            let url = '#';
            
            switch(redSocial) {
                case 'facebook':
                    url = 'https://facebook.com/bikestore';
                    break;
                case 'instagram':
                    url = 'https://instagram.com/bikestore';
                    break;
                case 'whatsapp':
                    url = 'https://wa.me/573001234567';
                    break;
                case 'youtube':
                    url = 'https://youtube.com/bikestore';
                    break;
            }
            
            if (url !== '#') {
                window.open(url, '_blank');
            } else {
                alert('Enlace no disponible por el momento.');
            }
        });
    });

    // --- Animaciones CSS ---
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeInUp 0.6s ease-out forwards;
            opacity: 0;
            transform: translateY(20px);
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .info-item:hover {
            transform: translateY(-5px) !important;
        }
        
        .red-social:hover {
            transform: translateY(-5px) scale(1.05) !important;
        }
    `;
    document.head.appendChild(style);


}); 