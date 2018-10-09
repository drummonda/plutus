import firebase from "firebase"

const config = {
  apiKey: "AIzaSyCFEfQbsRpLN3BgPkPA8Ohr9k3zc-Buzkg",
  authDomain: "plutus-6a4af.firebaseapp.com",
  databaseURL: "https://plutus-6a4af.firebaseio.com",
  projectId: "plutus-6a4af",
  storageBucket: "plutus-6a4af.appspot.com",
  messagingSenderId: "896938911920"
};

firebase.initializeApp(config)

export default firebase.database()
