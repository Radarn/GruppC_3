function setChoosen(e){var n=dbRef.getAuth(),t="https://shining-fire-7520.firebaseio.com/users/"+n.uid+"/lessons/"+e,o=new Firebase(t);o.once("value",function(n){var t=n.val();console.log(t.lesson.date),$("#choosenTitle").text("Vald föreläsning: "+t.lesson.name),$("#choosenId").text(e)}),this.getNote(e)}function getNote(e){var n=dbRef.getAuth(),t="https://shining-fire-7520.firebaseio.com/users/"+n.uid+"/lessons/"+e,o=new Firebase(t);o.once("value",function(e){var n=e.val(),t=n.notes;t?($("#note").text(t.note.content),console.log(t.note.content)):$("#note").text("")})}function getSynchronizedArray(e){var n=[];return syncChanges(n,e),n}function syncChanges(e,n){n.on("child_added",function(n,t){var o=n.val();o.$id=n.key();var i=positionAfter(e,t);e.splice(i,0,o)})}function positionFor(e,n){for(var t=0,o=e.length;o>t;t++)if(e[t].$id===n)return t;return-1}function positionAfter(e,n){if(null===n)return 0;var t=positionFor(e,n);return-1===t?e.length:t+1}var rootUrl="https://shining-fire-7520.firebaseio.com/",dbRef=new Firebase("https://shining-fire-7520.firebaseio.com/"),emailField=$("#email"),pwdField=$("#pwd");$("#regUser").on("click",function(){dbRef.createUser({email:$("#email").val(),password:$("#pwd").val()},function(e,n){if(e)$("#error").text(e),console.log("Error creating user:",e);else{console.log("Successfully created user account with uid:",n.uid);var t={email:$("#email").val()};this.saveUser(n.uid,t)}})});var saveUser=function(e,n){dbRef.child("users").child(e).set(n)};$("#loginUser").on("click",function(){dbRef.authWithPassword({email:$("#email").val(),password:$("#pwd").val()},function(e,n){e?($("#error").text(e),console.log("Login Failed!",e)):(console.log("Login Success!:",n),window.location.href="./views/profile.html")})});var loadCurrentUser=function(){var e=dbRef.getAuth();if(e){var n=rootUrl+"users/"+e.uid,t=new Firebase(n),o="https://shining-fire-7520.firebaseio.com/users/"+e.uid+"/lessons/",i=new Firebase(o);t.once("value",function(e){var n=e.val();$("#welcome").text("welcome "+n.email)}),i.once("value",function(e){var n=getSynchronizedArray(i);console.log(n);for(var t=document.getElementById("allLessons"),o=0;o<n.length;o++){var s=n[o].lesson.name,r=$("<li></li>").text(s);$(r).attr({id:n[o].$id}).appendTo(t),console.log(n[o].$id),$(r).bind("click",function(){setChoosen(this.id)})}})}},createLesson=function(){var e=dbRef.getAuth(),n=new Firebase("https://shining-fire-7520.firebaseio.com/users/"+e.uid),t=n.child("lessons");t.push({lesson:{name:$("#lesson").val(),date:$("#date").val()}}),loadCurrentUser()},saveLesson=function(e,n){dbRef.child("users").child(e).set(userData)},saveNote=function(){var e=$("#choosenId").text(),n=dbRef.getAuth(),t=new Firebase("https://shining-fire-7520.firebaseio.com/users/"+n.uid+"/lessons/"+e),o=t.child("notes");o.set({note:{content:$("#note").val()}})};$(".rtBtn").click(function(){var e=$(this),n=e.attr("name");dbRef.child("status").set({style:n},function(e){null!==e&&alert("Unable to push comments to Firebase!")})});var statusRef=dbRef.child("status");statusRef.on("child_changed",function(e){var n=e.val();highLight(n)});var highLight=function(e){$("#highLightParent").children().each(function(){var n=$(this).attr("id");n===e&&($("#"+n).addClass("highlighted"),window.setTimeout(function(){$("#"+n).removeClass("highlighted")},3e3))})},chatRef=dbRef.child("chat");$("#submit-btn").bind("click",function(){var e=$("#comments"),n=$.trim(e.val());if(console.log(n.length),n.length<1)alert("Kommentar måste vara längre");else{var t=dbRef.getAuth();chatRef.push({comment:{user:t.password.email,content:n}},function(e){null!==e&&alert("Error")}),e.val("")}return!1}),chatRef.on("child_added",function(e){var n=e.val().comment,t=$("#comments-container");$("<div/>",{"class":"comment-container"}).html('<span class="label label-default">'+n.user+"</span>"+n.content).appendTo(t),t.scrollTop(t.prop("scrollHeight"))}),$("#reset-btn").bind("click",function(){chatRef.remove()});