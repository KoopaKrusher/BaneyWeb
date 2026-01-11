// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// RSVP Modal functionality
const modal = document.getElementById('rsvp-modal');
const openBtn = document.getElementById('open-rsvp-btn');
const closeBtn = document.querySelector('.close');

openBtn.addEventListener('click', function() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// RSVP Form submission
const rsvpForm = document.getElementById('rsvp-form');
const formMessage = document.getElementById('form-message');

rsvpForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        guests: document.getElementById('guests').value,
        dietary: document.getElementById('dietary').value,
        message: document.getElementById('message').value
    };

    try {
        // Send to backend
        const response = await fetch('/api/rsvp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            // Show success message
            formMessage.className = 'form-message success';
            formMessage.textContent = result.message;

            // Reset form
            rsvpForm.reset();

            // Close modal after 3 seconds
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                formMessage.style.display = 'none';
            }, 3000);
        } else {
            // Show error message
            formMessage.className = 'form-message error';
            formMessage.textContent = result.message;
        }
    } catch (error) {
        console.error('Error:', error);
        formMessage.className = 'form-message error';
        formMessage.textContent = 'An error occurred. Please try again.';
    }
});

// Mobile menu toggle (for future enhancement)
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
});

// Add active class styling for mobile menu
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 2rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for fade-in animations (optional enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animations
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Don't animate hero section
const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.style.opacity = '1';
    heroSection.style.transform = 'translateY(0)';
}

console.log('Wedding website loaded successfully!');
