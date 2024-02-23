const puppeteer = require('puppeteer');

async function enviarDatosFormulario(url, datos) {
  // Inicia el navegador
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navega a la URL del formulario
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Aquí asumimos que `datos` es un array de objetos, donde cada objeto tiene las claves
  // correspondientes a los nombres de los campos del formulario y los valores que deseas enviar.
  for (let dato of datos) {
    for (let [campo, valor] of Object.entries(dato)) {
      // Rellena cada campo del formulario. Asegúrate de ajustar los selectores según tu formulario.
      await page.type(`input[name="${campo}"]`, valor);
    }
    
    // Envía el formulario. Ajusta el selector según tu formulario.
    await page.click('button[type="submit"]');
    
    // Espera a que la página se recargue o a alguna señal de que el formulario se ha enviado correctamente.
    await page.waitForNavigation();
  }

  // Cierra el navegador
  await browser.close();
}

// Ejemplo de uso
const url = 'https://ejemplo.com/formulario';
const datos = [
  { nombre: 'Juan', email: 'juan@example.com' },
  { nombre: 'Ana', email: 'ana@example.com' }
];

enviarDatosFormulario(url, datos).then(() => console.log('Formularios enviados.'));
