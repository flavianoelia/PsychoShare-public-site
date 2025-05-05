const API_BASE_URL = 'http://localhost:3000/api/usuarios';

document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault(); 


    const formData = {
        nombre: document.getElementById('nombre').value,
        mail: document.getElementById('mail').value,
        nickname: document.getElementById('nickname').value,
        password: document.getElementById('password').value
    };

    try {
    
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to register user');
        }

        const result = await response.json();
        console.log('User registered successfully:', result);

        
        alert('User registered successfully!');
        window.location.href = '/profile.html'; 
    } catch (error) {
        console.error('Error registering user:', error.message);
        alert(`Error: ${error.message}`);
    }
});