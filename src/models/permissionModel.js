async function obtenerAccessToken() {

    const domain = 'dev-w1j3tra2.us.auth0.com';
    const clientId = 'in8vha00TxNfLFN1BbvQIOfCHm1h5SiB';
    const clientSecret = 'IWA9OHErN3vYDQz4ydaMJl664NDU7plE0SBwAd8-_JcIkeA98YIJ-t-rAgNpv3dD';
    const audience = `Conta_apiGeneral`;
  
    try {
      const response = await axios.post(`https://${domain}/oauth/token`, new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        audience: audience
      }), {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      });
  
      return response.data.access_token;
    } catch (error) {
      console.error('Error al obtener el token de acceso:', error);
      throw error;
    }
  }


exports.getPermissions = async (roleIds) => {
    try {
        const domain = 'dev-w1j3tra2.us.auth0.com'; // Reemplaza con tu dominio de Auth0
        const accessToken = await obtenerAccessToken(); // Obtiene el token de acceso

        console.log("token"+accessToken);
   
        // Preparar todas las promesas de llamadas a la API para cada roleId
        const promises = roleIds.map(roleId => {
            const url = `https://${domain}/api/v2/roles/${roleId}/permissions`;
            return axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(response => response.data.map(permiso => permiso.permission_name));
        });

        // Ejecutar todas las promesas en paralelo y esperar a que todas se resuelvan
        const results = await Promise.all(promises);

        // Concatenar todos los permisos en un único array
        const permisosTotales = results.flat();

        // Opcional: Eliminar duplicados
        const permisosUnicos = [...new Set(permisosTotales)];

        return permisosUnicos;
    } catch (error) {
        console.error('Error al obtener permisos:', error);
        throw error;
    }
};