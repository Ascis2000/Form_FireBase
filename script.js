
const firebaseConfig = {
	apiKey: "AIzaSyAYos4oiAf1nhgmSC2l4DhNQzzgXXrnPTA",
	authDomain: "demoweb-32dd6.firebaseapp.com",
	projectId: "demoweb-32dd6",
	storageBucket: "demoweb-32dd6.appspot.com",
	messagingSenderId: "284825331676",
	appId: "1:284825331676:web:0eb9ed79330abd43589119"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();// db representa mi BBDD //inicia Firestore

function dgById(obj){
	if(document.getElementById(obj) != null){
		return document.getElementById(obj);
	}
}
// Create
const createUsuario = (datosUsuario) => {

	db.collection("usuarios")
		.add(datosUsuario)
		.then((docRef) => {
			console.log("Documento registrado con ID: ", docRef.id)
			readAll();
		})
		.catch((error) => console.error("Error al registrar el documento: ", error));
}

// Read all
const readAll = async () => {
	// Limpia del DOM los usuarios
	cleanUsuarios();

	try {
		// Petición asincrona para leer todos los documentos de la colección usuarios
		const querySnapshot = await db.collection("usuarios").get();

		// Recorremos la colección y pintamos cada documento
		querySnapshot.forEach((doc) => {
			const data = doc.data();
			console.log("doc:", doc);
			console.log("data.comentario:", data.comentario);
			let dId = doc.id;
			let dNombre = data.nombre;
			let dEmail = data.email;
			let dImagen = data.imagen;
			let dComentario = data.comentario;

			// llamamos a la función pasando un objeto como argumento
			printUsuario({
				dId,
				dNombre, 
				dEmail,
				dComentario,
				dImagen
			});
		});
	} catch (error) {
		console.log('Error reading documents', error);
	}
};

// Editar
const editarUsuario = () => {
	alert("Estamos en construcción");
	return;
};

// Delete
const deletePicture = (identificador) => {

	// dgById("overlay").style.display = 'block';
    // dgById("modal").style.display = 'block';

	const id = prompt('Introduce el ID a borrar');
	db.collection('usuarios').doc(id).delete().then(() => {
		alert(`Documento ${id} ha sido borrado`);
		//Clean
		document.getElementById('usuarios').innerHTML = "";
		document.querySelector('.container').innerHTML = "";
		//Read all again
		readAll();
	})
	.catch(() => console.log('Error borrando documento'));
};

// Función para pintar una foto en el album
const printUsuario = (doc) => {

	let card = document.createElement('article');
	card.setAttribute('class', 'card');
	/*   let picture = document.createElement('img');
	picture.setAttribute('src', doc.dImagen);
	picture.setAttribute('style', 'max-width:250px'); */

	let id = document.createElement('p');
	id.innerHTML = doc.dId;

	let dName = document.createElement('p');
	dName.innerHTML = doc.dNombre;

	let dEmail = document.createElement('p');
	dEmail.innerHTML = doc.dEmail;

	let ddComentario = document.createElement('p');
	ddComentario.innerHTML = doc.dComentario;

	let dImagen = document.createElement('p');
	dImagen.innerHTML = doc.dImagen;

	card.appendChild(id);
	card.appendChild(dName);
	card.appendChild(dEmail);
	card.appendChild(ddComentario);
	card.appendChild(dImagen);
	//dgById('usuarios').appendChild(card);

	let html = `
        <div class="box box1" id="${doc.dId}">
            <div class="datos"><strong>Usuario:</strong> <label>${doc.dNombre}</label></div>
            <div class="datos"><strong>Email:</strong> <label>${doc.dEmail}</label></div>
            <div class="datos"><strong>Comentario:</strong> <label>${doc.dComentario}</label></div>
            <div class="datos"><strong>Imagen:</strong> <label>${doc.dImagen}</label></div>
			<div class="datos"><strong>ID:</strong> <label>${doc.dId}</label></div>

            <div class="icon-container">
                <i onclick="editarUsuario('${doc.dId}')" class="fas fa-edit edit-icon" title="Editar ficha de ${doc.dNombre}"></i>
                <i onclick="deletePicture('${doc.dId}')"class="fas fa-trash delete-icon" title="Eliminar ficha de ${doc.dNombre}"></i>
            </div>
        </div>
    `;
	document.querySelector('.container').innerHTML += html;
};

// Clean 
const cleanUsuarios = () => {
	dgById('usuarios').innerHTML = "";
	document.querySelector('.container').innerHTML = "";
};

//Show on page load
/* readAll(); */

//**********EVENTS**********

// Create
document.querySelector("#form_main").addEventListener("submit", (event) => {

	event.preventDefault(); // paraliza envío formulario

	const nombre = event.target.nombre.value;
	const email = event.target.email.value;
	const comentario = event.target.comentario.value;
	const imagen = event.target.imagen.value;

	// Debemos validar el formulario!
	const emailPattern = /^[a-zA-Z0-9]{2,}@[a-zA-Z]{3,}\.(?:[a-zA-Z]{2,4})$/;

	// Si el correo electrónico cumple con el patrón
	if (emailPattern.test(email)) {
		console.log("Correo electrónico válido.");
		
		createUsuario({
			nombre,
			email,
			comentario,
			imagen
		});
	} else {
		console.log("Correo electrónico no válido.");
		return false;
	}
});

// Read all
document.getElementById("read-all").addEventListener("click", () => {
	readAll();
});

// Read one
document.getElementById('read-one').addEventListener("click", () => {
	const id = prompt("Introduce el id a buscar");
	readOne(id);
});

// Clean
document.getElementById('clean').addEventListener('click', () => {
	cleanUsuarios();
});

// Cancelar Delete
document.getElementById('btn_cancelar_delete').addEventListener('click', () => {
	document.getElementById('modal').style.display = "none";
	document.getElementById('overlay').style.display = "none";
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

	//Petición a Firestore para leer un documento de la colección usuarios 
	var docRef = db.collection("usuarios").doc(id);

	docRef.get()
	.then((doc) => {
		if (doc.exists) {
			console.log("Document data:", doc.data());

			const data = doc.data();
			let dId = doc.id;
			let dNombre = data.nombre;
			let dEmail = data.email;
			let dImagen = data.imagen;
			let dComentario = data.comentario;

			printUsuario({
				dId,
				dNombre, 
				dEmail,
				dComentario,
				dImagen
			});
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

