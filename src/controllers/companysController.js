const companysController = require('../models/companysModel');
const axios = require('axios');

exports.getAllCompanys = async (req, res) => {
    try {
        const companys = await companysController.allDataCompanys();
        res.json(companys);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
};

exports.createCompany = async (req, res) => {
    try {
        const companyData = req.body;
        const localUserId = companyData.userId; // ID del usuario en tu sistema
        // Asegúrate de eliminar el userId del objeto companyData antes de pasarlo
        delete companyData.userId;
        const companyId = await companysController.insertCompany(companyData, localUserId);

        // Datos del usuario para Auth0
        const userData = {
            email: companyData.Email,
            password: companyData.Email, // Usando el email como contraseña
            connection: 'Username-Password-Authentication' // Asegúrate de usar la conexión correcta
        };

        // Crear usuario en Auth0
        const auth0Response = await axios.post('https://dev-w1j3tra2.us.auth0.com/api/v2/users', userData, {
            headers: {
                'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im9uRF9HeEh4LTJKOXVqQlhkMGhGciJ9.eyJodHRwczovL21pYXBwLmNvbS9yb2xlcyI6WyJNb2R1bG9BdWRpdG9yaWFfQWRtaW5pc3RyYWRvciJdLCJnaXZlbl9uYW1lIjoiRHlsYW4iLCJmYW1pbHlfbmFtZSI6IkFwb250ZSBKaW3DqW5leiIsIm5pY2tuYW1lIjoiZHlsYW4wMWFwb250ZSIsIm5hbWUiOiJEeWxhbiBBcG9udGUgSmltw6luZXoiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS3ZQQ1F5c0xkclJ4Z3Y0ZDBNRTZ0QWE2VURCTU5OQnFfRTV1S0E0YnhRRlZrPXM5Ni1jIiwibG9jYWxlIjoiZXMiLCJ1cGRhdGVkX2F0IjoiMjAyNC0wMS0xNlQyMToxMDoxNy4zMTFaIiwiZW1haWwiOiJkeWxhbjAxYXBvbnRlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2Rldi13MWozdHJhMi51cy5hdXRoMC5jb20vIiwiYXVkIjoiaW44dmhhMDBUeE5mTEZOMUJidlFJT2ZDSG0xaDVTaUIiLCJpYXQiOjE3MDU0Mzk0MjAsImV4cCI6MTcwNTQ3NTQyMCwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDg5MDM3NjkxNTA4NTgxNzk5NzAiLCJzaWQiOiJOeVVkbmxlVERQUWVtNy1TTU5DdFk5S1B4aENzVDA1bSIsIm5vbmNlIjoiTkRsWVJrUTBRMkZpUlRGRmVHOXZZWFpyWkVJNVNtUjBPREZ0VDB4U2RUQlhka05FTjNkNFVYQXVRZz09In0.mtOjanrX1B1V5puWvEaubZK5DGVbshw3-wPP6zgr_9jTY0m74EX_w57SxsnJs6AJOYqFPagWPxAJArX3VEKLPw-DtUqtjkqS61P_0oLZTUuJUo33EjeAIeXZ8PF10DBMgOU5fHdzhYXydtPUcdE6XpU3KMWPRA3FMhSpOFe0eMD2jrKP4CZDDtm1WVQ8-vNYxQ4qXALXsqGINLUENC67x_Jn3x4soX6my67pX7KBBUU3z7SHOEqDBPcmZbhlxgKBwRHTdYyN7HZB1LNhvYkgiZ_fPcvnB4jASfHN3rtTfXz9HxPfnkM8PA4Lh5dsxOeD0mnMEWsOD9mAghp9jHI-IQ`
            }
        });

        // Obtener el ID del usuario creado en Auth0
        const auth0UserId = auth0Response.data.user_id;

        // ID del rol a asignar
        const roleId = 'rol_g3SUmI4drIpWyvH3'; // Reemplaza con el ID del rol que quieres asignar
        const roleData = {
            roles: [roleId]
        };

        // Asignar rol al usuario en Auth0
        await axios.post(`https://dev-w1j3tra2.us.auth0.com/api/v2/users/${auth0UserId}/roles`, roleData, {
            headers: {
                'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im9uRF9HeEh4LTJKOXVqQlhkMGhGciJ9.eyJodHRwczovL21pYXBwLmNvbS9yb2xlcyI6WyJNb2R1bG9BdWRpdG9yaWFfQWRtaW5pc3RyYWRvciJdLCJnaXZlbl9uYW1lIjoiRHlsYW4iLCJmYW1pbHlfbmFtZSI6IkFwb250ZSBKaW3DqW5leiIsIm5pY2tuYW1lIjoiZHlsYW4wMWFwb250ZSIsIm5hbWUiOiJEeWxhbiBBcG9udGUgSmltw6luZXoiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS3ZQQ1F5c0xkclJ4Z3Y0ZDBNRTZ0QWE2VURCTU5OQnFfRTV1S0E0YnhRRlZrPXM5Ni1jIiwibG9jYWxlIjoiZXMiLCJ1cGRhdGVkX2F0IjoiMjAyNC0wMS0xNlQyMToxMDoxNy4zMTFaIiwiZW1haWwiOiJkeWxhbjAxYXBvbnRlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2Rldi13MWozdHJhMi51cy5hdXRoMC5jb20vIiwiYXVkIjoiaW44dmhhMDBUeE5mTEZOMUJidlFJT2ZDSG0xaDVTaUIiLCJpYXQiOjE3MDU0Mzk0MjAsImV4cCI6MTcwNTQ3NTQyMCwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDg5MDM3NjkxNTA4NTgxNzk5NzAiLCJzaWQiOiJOeVVkbmxlVERQUWVtNy1TTU5DdFk5S1B4aENzVDA1bSIsIm5vbmNlIjoiTkRsWVJrUTBRMkZpUlRGRmVHOXZZWFpyWkVJNVNtUjBPREZ0VDB4U2RUQlhka05FTjNkNFVYQXVRZz09In0.mtOjanrX1B1V5puWvEaubZK5DGVbshw3-wPP6zgr_9jTY0m74EX_w57SxsnJs6AJOYqFPagWPxAJArX3VEKLPw-DtUqtjkqS61P_0oLZTUuJUo33EjeAIeXZ8PF10DBMgOU5fHdzhYXydtPUcdE6XpU3KMWPRA3FMhSpOFe0eMD2jrKP4CZDDtm1WVQ8-vNYxQ4qXALXsqGINLUENC67x_Jn3x4soX6my67pX7KBBUU3z7SHOEqDBPcmZbhlxgKBwRHTdYyN7HZB1LNhvYkgiZ_fPcvnB4jASfHN3rtTfXz9HxPfnkM8PA4Lh5dsxOeD0mnMEWsOD9mAghp9jHI-IQ`
            }
        });

        res.status(201).json({ message: "Company and UserCompany created successfully", CompanyId: companyId });
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.updateCompany = async (req, res) => {
    try {
        const companyData = req.body; // Datos de la compañía para actualizar
        const companyId = companyData.CompanyId; // Asegúrate de que el ID de la compañía esté incluido en el cuerpo de la solicitud

        // Llama a una función del modelo para actualizar la compañía
        const result = await companysController.updateCompany(companyId, companyData);
        res.status(200).json({ message: "Company updated successfully", result });
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.getCompanysByUser = async (req, res) => {
    try {
        const userId = req.params.userId; // O req.userId si estás obteniendo el ID del usuario de la sesión o token
        const companys = await companysController.getCompanysByUserId(userId);
        res.json(companys);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
