export const API_BASE_URL = 'http://localhost:3000/api/usuarios';

export async function registerUser(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to register user');
        }

        return await response.json();
    } catch (err) {
        throw err;
    }
}