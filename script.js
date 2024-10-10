
const firebaseConfig = {
  apiKey: "AIzaSyAYos4oiAf1nhgmSC2l4DhNQzzgXXrnPTA",
  authDomain: "demoweb-32dd6.firebaseapp.com",
  projectId: "demoweb-32dd6",
  storageBucket: "demoweb-32dd6.appspot.com",
  messagingSenderId: "284825331676",
  appId: "1:284825331676:web:0eb9ed79330abd43589119"
};

firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase
// Alberto guapooo
const db = firebase.firestore();// db representa mi BBDD //inicia Firestore

//Función auxiliar para pintar una foto en el album
const printPhoto = (docName, docEmail, docComment, docUrl, docId) => {
  let card = document.createElement('article');
  card.setAttribute('class', 'card');
  let picture = document.createElement('img');
  picture.setAttribute('src', url);
  picture.setAttribute('style', 'max-width:250px');

  let dName = document.createElement('p');
  dName.innerHTML = docName;

  let dComment = document.createElement('p');
  comm.innerHTML = docComment;

  let id = document.createElement('p');
  id.innerHTML = docId;

  const dgetBId_usuarios = document.getElementById('usuarios');
  card.appendChild(picture);
  card.appendChild(dName);
  card.appendChild(id);
  dgetBId_usuarios.appendChild(card);
};

//Create
const createUsuario = (datosUsuario) => {

  db.collection("usuarios")
    .add(datosUsuario)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id)
      readAll();
    })
    .catch((error) => console.error("Error adding document: ", error));
}


//Read all
const readAll = () => {
  // Limpia el album para mostrar el resultado
  cleanUsuarios();

  //Petición a Firestore para leer todos los documentos de la colección album
  db.collection("usuarios")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        printPhoto(
          doc.id,
          doc.data().nombre, 
          doc.data().email,
          doc.data().imagen,
          doc.data().comentario
          )
      });
    })
    .catch(() => console.log('Error reading documents'));;
};

//Delete
const deletePicture = () => {
  const id = prompt('Introduce el ID a borrar');
  db.collection('album').doc(id).delete().then(() => {
    alert(`Documento ${id} ha sido borrado`);
    //Clean
    document.getElementById('usuarios').innerHTML = "";
    //Read all again
    readAll();
  })
    .catch(() => console.log('Error borrando documento'));
};

//Clean 
const cleanUsuarios = () => {
  document.getElementById('usuarios').innerHTML = "";
};

//Show on page load
/* readAll(); */

//**********EVENTS**********

//Create
document.getElementById("btn_enviar").addEventListener("click", (event) => {

  event.preventDefault(); // paraliza envío formulario

	let dgetBId_nombre = document.getElementById("nombre");
	let dgetBId_email = document.getElementById("email");
	let dgetBId_comentario = document.getElementById("comentario");
	let dgetBId_imagen = document.getElementById("imagen");

	let nombre = dgetBId_nombre.value;
	let email = dgetBId_email.value;
	let comentario = dgetBId_comentario.value;
	let imagen = dgetBId_imagen.value;

	// Debemos validar el formulario!
	const emailPattern = /^[a-zA-Z0-9]{2,}@[a-zA-Z]{3,}\.(?:[a-zA-Z]{2,4})$/;

	// Si el correo electrónico cumple con el patrón
	/* if (emailPattern.test(email)) {
	console.log("Correo electrónico válido.");
	alert("Correo electrónico válido.")
	return;
	} */

	createUsuario({
		nombre,
		email,
		comentario,
		imagen
	});
});

//Read all
document.getElementById("read-all").addEventListener("click", () => {
  readAll();
});

//Read one
document.getElementById('read-one').addEventListener("click", () => {
  const id = prompt("Introduce el id a buscar");
  readOne(id);
});

//Delete one
document.getElementById('delete').addEventListener('click', () => {
  deletePicture();
});

//Clean
document.getElementById('clean').addEventListener('click', () => {
  cleanUsuarios();
});

//********FIRESTORE USERS COLLECTION******

const createUser = (user) => {
  db.collection("usuarios")
    .add(user)
    .then((docRef) => console.log("Document written with ID: ", docRef.id))
    .catch((error) => console.error("Error adding document: ", error));
};

/* const readAllUsers = (born) => {
  db.collection("users")
    .where("first", "==", born)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
      });
    });
}; */

// Read ONE
function readOne(id) {
  // Limpia el album para mostrar el resultado
  cleanUsuarios();

  //Petición a Firestore para leer un documento de la colección album 
  var docRef = db.collection("usuarios").doc(id);

  docRef.get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc.data());
      printPhoto(doc.data().title, doc.data().url, doc.id);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });

}

/**************Firebase Auth*****************/

/*

const signUpUser = (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`)
      alert(`se ha registrado ${user.email} ID:${user.uid}`)
      // ...
      // Saves user in firestore
      createUser({
        id: user.uid,
        email: user.email,
        message: "hola!"
      });

    })
    .catch((error) => {
      console.log("Error en el sistema" + error.message, "Error: " + error.code);
    });
};


document.getElementById("form1").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email.value;
  let pass = event.target.elements.pass.value;
  let pass2 = event.target.elements.pass2.value;

  pass === pass2 ? signUpUser(email, pass) : alert("error password");
})


const signInUser = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha logado ${user.email} ID:${user.uid}`)
      alert(`se ha logado ${user.email} ID:${user.uid}`)
      console.log("USER", user);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode)
      console.log(errorMessage)
    });
}

const signOut = () => {
  let user = firebase.auth().currentUser;

  firebase.auth().signOut().then(() => {
    console.log("Sale del sistema: " + user.email)
  }).catch((error) => {
    console.log("hubo un error: " + error);
  });
}


document.getElementById("form2").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email2.value;
  let pass = event.target.elements.pass3.value;
  signInUser(email, pass)
})
document.getElementById("salir").addEventListener("click", signOut);

// Listener de usuario en el sistema
// Controlar usuario logado
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(`Está en el sistema:${user.email} ${user.uid}`);
    document.getElementById("message").innerText = `Está en el sistema: ${user.uid}`;
  } else {
    console.log("no hay usuarios en el sistema");
    document.getElementById("message").innerText = `No hay usuarios en el sistema`;
  }
});

*/

