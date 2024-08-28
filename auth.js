document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const signInForm = document.getElementById('signin-form');

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                event.preventDefault();
                alert('Passwords do not match');
            }
            
        });
    }

    if (signInForm) {
        signInForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(signInForm);
            const response = await fetch('/signin', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                window.location.href = '/heartfulhub    ';
            } else {
                const errorText = await response.text();
                alert(errorText);
            }
        });
    }
});
