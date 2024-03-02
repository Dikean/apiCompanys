const db = require('../utils/db');
const { bucket } = require('../utils/configFirebase'); 
const fs = require('fs');
const { log } = require('console');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

exports.allDataCompanys = async () => {
    try {
        const [results] = await db.query('SELECT * FROM Companys');
        return results;
    } catch (error) {
        throw error;
    }

};



// Función para generar un código aleatorio de 8 caracteres
async function generateRandomCode(length = 8) {
    // Definir los caracteres que se pueden incluir
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result; // La función es asíncrona, pero esta operación es síncrona
}

exports.insertCompany = async (companyData, userId , UserPhoto, EmailUserSeeRol) => {
    try {
        // Generar un UUID para CompanyId
        const companyId = uuidv4();

        // Generar un código aleatorio de 8 caracteres de forma asíncrona
        const randomCode = await generateRandomCode();

        // Insertar en la tabla Companys con el UUID generado
        const queryCompany = 'INSERT INTO Companys (CompanyId, NameCompany, Codigo, Ubicacion, Email, Access_key) VALUES (?, ?, ?, ?, ?, ?)';
        const valuesCompany = [companyId, companyData.NameCompany, randomCode, companyData.Ubicacion, companyData.Email, companyData.Access_key];

        await db.query(queryCompany, valuesCompany);

        // Insertar en la tabla UserCompany usando el mismo UUID
        const queryUserCompany = 'INSERT INTO UserCompany (CompanyId, UserId, Rol, Date, UserPhoto, Email) VALUES (?, ?, "Administrator", NOW(), ?, ?)';
        const valuesUserCompany = [companyId, userId, UserPhoto, EmailUserSeeRol];

        await db.query(queryUserCompany, valuesUserCompany);

        return companyId; // Retorna el UUID generado
    } catch (error) {
        throw error;
    }
};


exports.updateCompany = async (companyId, companyData) => {
    try {
        const query = 'UPDATE Companys SET NameCompany = ?, Ubicacion = ?,  Email = ?, Access_key = ? WHERE CompanyId = ?';
        // Asegúrate de que los valores coincidan en orden con los marcadores de posición en la consulta
        const values = [companyData.NameCompany, companyData.Ubicacion, companyData.Email,  companyData.Access_key, companyId];

        // Ejecutar la consulta preparada
        const [results] = await db.query(query, values);
        return results;
    } catch (error) {
        throw error;
    }
};

exports.getCompanysByUserId = async (userId) => {
    try {
        const query = `
            SELECT Companys.* 
            FROM Companys
            JOIN UserCompany ON Companys.CompanyId = UserCompany.CompanyId
            WHERE UserCompany.UserId = ?
        `;
        const [companys] = await db.query(query, [userId]);
        return companys;
    } catch (error) {
        throw error;
    }
};

exports.getCompanysByUserIdCity = async (userId) => {
    try {
        const query = `
            SELECT Companys.Ubicacion 
            FROM Companys
            JOIN UserCompany ON Companys.CompanyId = UserCompany.CompanyId
            WHERE UserCompany.UserId = ?
        `;
        const [companys] = await db.query(query, [userId]);

        // Calcular los porcentajes
        const cityCounts = companys.reduce((acc, company) => {
            acc[company.Ubicacion] = (acc[company.Ubicacion] || 0) + 1;
            return acc;
        }, {});

        const total = companys.length;
        const cityPercentages = Object.keys(cityCounts).map(city => ({
            city,
            percentage: (cityCounts[city] / total) * 100
        }));

        return cityPercentages;
    } catch (error) {
        throw error;
    }
};

exports.getCompanyById = async (companyId) => {
    try {
        const query = `
            SELECT * 
            FROM Companys
            WHERE CompanyId = ?
        `;

        const token = process.env.OPENAI_TOKEN; // Ahora, 'token' contiene el valor de tu variable de entorno
        console.log("TOken env"+token);

        const [company] = await db.query(query, [companyId]);
        return company;
    } catch (error) {
        throw error;
    }
};

exports.deleteDocumentById = async (companyId) => {
    try {
        const query = `
        DELETE FROM Repository
        WHERE RepositoryId = ?        
        `;
        const [company] = await db.query(query, [companyId]);
        return company;
    } catch (error) {
        throw error;
    }
};

exports.joinCompany = async(codigo, userId, UserPhoto, Email) =>{
    try {
        // Paso 1: Verificar si existe el código y obtener el CompanyId
        const queryCheckCode = 'SELECT CompanyId FROM Companys WHERE Codigo = ?';
        const [companyResults] = await db.query(queryCheckCode, [codigo]);

        if (companyResults.length > 0) {
            const companyId = companyResults[0].CompanyId;

            // Paso 2: Insertar en la tabla UserCompany
            const queryInsertUserCompany = 'INSERT INTO UserCompany (CompanyId, UserId, Rol, Date, UserPhoto, Email) VALUES (?, ?, "Lector", NOW(), ?, ?)';
            await db.query(queryInsertUserCompany, [companyId, userId,  UserPhoto, Email]);

            console.log(`Registro insertado correctamente con CompanyId: ${companyId} y UserId: ${userId}`);
        } else {
            console.log('El código proporcionado no existe en la tabla Companys.');
        }
    } catch (error) {
        console.error('Error al insertar en UserCompany:', error);
    }
};

//storage
exports.uploadFileToFirebase = async (file, companyId, UserID, name, category) => {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        //al agregar al lado el sub del usuario ya lo guarda por carpeta
        const fileName = `RepositoryDocumentsByCompany/${companyId}/`+Date.now() + file.originalname;
        const fileUpload = bucket.file(fileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        const streamPromise = new Promise((resolve, reject) => {
            blobStream.on('error', error => reject(error));
            blobStream.on('finish', () => resolve());

            if (file.buffer) {
                // Si el archivo se almacena en un buffer
                console.log("Tamaño del buffer:", file.buffer.length);
                blobStream.end(file.buffer);
            } else {
                // Si el archivo se almacena en el disco
                const readStream = fs.createReadStream(file.path);
                readStream.pipe(blobStream);
            }
            
        });

        await streamPromise;
        await fileUpload.makePublic();

        const publicUrl = await fileUpload.publicUrl();

        // Inserta la ruta del archivo y el userID en la base de datos
        const query = "INSERT INTO Repository (CompanyId,  name, rutadelarchivo, categoria, UserId) VALUES (?, ?, ?, ?, ?)";
        db.query(query, [companyId, name, publicUrl, category, UserID], (err, result) => {
            if (err) throw err;
            console.log("Registro insertado en la base de datos", result);
        });

        return publicUrl;

        
        
    } catch (error) {
        console.error('Error al subir archivo a Firebase:', error);
        throw new Error('Error al subir archivo a Firebase');
    }
};

exports.getDocumentsByCompany = async (companyId) => {
    try {
        const query = `
            SELECT * 
            FROM Repository
            WHERE CompanyId = ?
        `;
        const [company] = await db.query(query, [companyId]);
        return company;
    } catch (error) {
        throw error;
    }
};

//siigo
exports.getTokenSiigo = async (username , access_key) => {
     try {
         const response = await axios.post('https://api.siigo.com/auth', {
            username: username,
            access_key: access_key
        });

         const token = response.data; 
         return token;
     } catch (error) {
         console.error("Error al obtener el token de Siigo:", error);
         throw error;
     }
  
};

exports.getSalesInvocesSiigo = async (companyId , Menssages) => {
   
    try {
    
        const findCompany = await exports.getCompanyById(companyId);

        // const username =  findCompany[0].Email;
        // const accessKey = findCompany[0].Access_key;
        
        const username = "hotelginebrasincelejo@hotmail.com";
        const accessKey = "MjJlNDkzMjctN2E0NS00ZmE3LTkwYzQtYmNkNDJjNTlhN2YxOk1+NzVyMVQ/flk="

        //get token siigo by user
        const tokenSiigo = await exports.getTokenSiigo(username, accessKey );
        // Acceder al access_token y guardarlo en una variable
        const accessToken = tokenSiigo.access_token;
        if (!accessKey) {
            throw new Error('Access_key no encontrado para la compañía');
        }

        // URL de la API externa
        const apiUrl = 'https://api.siigo.com/v1/invoices'; // URL de la API externa

        const params = {
            created_start: '2024-02-20'
        };

        const response = await axios.get(apiUrl, {
            params: params,
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Usar Access_key como Bearer Token
                'Partner-Id': 'Dikean' // Agregar el header Partner-Id
            }
        });

        console.log("siigo sales invoces"+ JSON.stringify(response.data));

        const data = {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "Eres un asistente de negocios para hacer crecer empresas, responde de manera formal y sencilla pero no muy sencilla a los usuarios."
              },
              {
                role: "user",
                content: JSON.stringify(response.data)+" Responde deacuerdo a esta data y a la siguiente pregunta que te hago : "+Menssages
              }
            ]
          };
        // Aquí manejas la respuesta de la API y envia a Gpt
    
        const token = "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";

        return axios.post(`https://api.openai.com/v1/chat/completions`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
         })
        .then(response => response.data) // Devuelve directamente response.data
        .catch(error => {
                console.error("Error en la solicitud:", error);
                throw error; // Propaga el error para manejarlo en el .catch de la llamada
         });
        
        } catch (error) {       
         throw error;
         }
};

