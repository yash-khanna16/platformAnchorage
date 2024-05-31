"use server"

export async function loginAdmin(email: string, password: string) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/admin/loginAdmin`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                email: email,
                password: password,
            },
            cache: "no-cache",
        });

        if (!response.ok) {
            return response.status;
        }

        const data = await response.json(); // Parse the JSON response
        return data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}