import { initializeApp } from 'firebase/app';
import { getStorage, ref, deleteObject } from "firebase/storage";

// Configuración de Firebase (reemplaza esto con tu propia configuración)
const firebaseConfig = {
    apiKey: "AIzaSyDJ2rOt-c3yW5Hr1xXcgvGInOLuNcqhd-E",
    authDomain: "autoconta-12190.firebaseapp.com",
    projectId: "autoconta-12190",
    storageBucket: "autoconta-12190.appspot.com",
    messagingSenderId: "708761002838",
    appId: "1:708761002838:web:2b5b67ee260c5e9d2facf7",
    measurementId: "G-QC0KSQVV9S"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtiene una instancia de Firebase Storage
const storage = getStorage(app);

// Crea una referencia al archivo que deseas eliminar
const fileRef = ref(storage, 'RepositoryDocumentsByCompany/71/1707135674016z09013529500152400000898.pdf');

// Elimina el archivo
deleteObject(fileRef).then(() => {
  console.log("Archivo eliminado con éxito");
}).catch((error) => {
  console.error("Error al eliminar el archivo:", error);
});


