

  // CREATE A REFERENCE TO FIREBASE
  var rootUrl = "https://shining-fire-XXXX.firebaseio.com/"
  var dbRef = new Firebase('https://shining-fire-XXXX.firebaseio.com/');

  // REGISTER DOM ELEMENTS
  var emailField = $('#email');
  var pwdField = $('#pwd');

  //REGISTER NEW USER
$("#regUser").on("click", function(){

  dbRef.createUser({
  email    : $("#email").val(),
  password    : $("#pwd").val(),
}, function(error, userData) {
  if (error) {
      $("#error").text(error);
    console.log("Error creating user:", error);
  } else {
    console.log("Successfully created user account with uid:", userData.uid);
    var newUser = {
      email: dbRef.getAuth().password.email
    };
    this.saveUser(userData.uid,newUser)
  }
})
});

//SAVE/CREATE USER RECORD
var saveUser = function(id, userData){
  dbRef.child("users").child(id).set(userData);
};

//LOGIN USER
$("#loginUser").on("click", function(){

  dbRef.authWithPassword({
  email    : $("#email").val(),
  password    : $("#pwd").val(),
}, function(error, authData) {
  if (error) {
      $("#error").text(error);
    console.log("Login Failed!", error);


  } else {
    console.log("Login Success!:", authData);
      window.location.href = './views/profile.html';
  }
})
});





//profile
var loadCurrentUser = function(){
  var authData = dbRef.getAuth();

  if (authData) {
    var url = rootUrl + "users/" + authData.uid;
    var ref = new Firebase(url);
    var lessons = 'https://shining-fire-XXXX.firebaseio.com/users/a60a019a-3b07-4ea6-b52d-ee0ad15eac54/lessons/';
    var lessonsRef = new Firebase(lessons);

    ref.once("value", function(user){
      var test = user.val();
        $("#welcome").text('welcome ' + test.email);

    });

    lessonsRef.once("value", function(user){
      var test = getSynchronizedArray(lessonsRef);
        console.log(test);

    });

  }
}


//GET LESSONS -START-
function getSynchronizedArray(firebaseRef) {
  var list = [];
  syncChanges(list, firebaseRef);
  return list;
}
function syncChanges(list, ref) {
  ref.on('child_added', function _add(snap, prevChild) {
    var data = snap.val();
    data.$id = snap.key(); // assumes data is always an object
    var pos = positionAfter(list, prevChild);
    list.splice(pos, 0, data);
  });
}
// similar to indexOf, but uses id to find element
function positionFor(list, key) {
  for(var i = 0, len = list.length; i < len; i++) {
    if( list[i].$id === key ) {
      return i;
    }
  }
  return -1;
}
// using the Firebase API's prevChild behavior, we
// place each element in the list after it's prev
// sibling or, if prevChild is null, at the beginning
function positionAfter(list, prevChild) {
  if( prevChild === null ) {
    return 0;
  }
  else {
    var i = positionFor(list, prevChild);
    if( i === -1 ) {
      return list.length;
    }
    else {
      return i+1;
    }
  }
}
//GET LESSONS -END-

var createLesson = function(){
  var authData = dbRef.getAuth();

  var ref = new Firebase('https://shining-fire-XXXX.firebaseio.com/' + 'users/'+ authData.uid);


 var lessonRef =  ref.child("lessons");
 lessonRef.push({
   lesson: {
     name    : $("#lesson").val(),
     date    : $("#date").val(),
   }
 })
  }


//SAVE/CREATE USER RECORD
var saveLesson = function(id, lessonData){
  dbRef.child("users").child(id).set(userData);
};