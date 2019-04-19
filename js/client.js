window.addEventListener('DOMContentLoaded', function(){
    var numberJoueur = 0
    var monBody = window.document.body;
    monBody.style.background = 'url("../images/topbar-bg.png")';
    monBody.style.margin = "0 0 0 0";
   
    var maDivSupp = window.document.getElementsByClassName('maDivLogin')[0];
    var maDiv = window.document.getElementsByClassName("div-identification")[0];
    var monInput = document.getElementById("monInput");
    var monForm = document.getElementById("form_chall");

    monForm.onsubmit = function (event) {
    var limiteValue = parseInt(monInput.value);
    
    if (monInput.value === "" || limiteValue > 8) {
       alert('Vous devez entrer un identifiant, ne pas dépasser 8 caractéres');
    } 
    else {
        console.log(limiteValue.length);
        maDivSupp.style.display = "none";
        event.preventDefault();

    var websocketConnection = io('https://sniper-game.herokuapp.com/');
    // Je défini le port et l'adresse ip de connection
    
    var monNameID = {}
    monNameID.monName = monInput.value 
    websocketConnection.emit('monNameID', monNameID);



    var maDivBackground = window.document.createElement('div');
    maDivBackground.style.margin = "0 0";
    maDivBackground.style.background = "url('../images/background.jpg') 0% 0% / 100% 720px no-repeat";
    maDivBackground.style.height = "720px";
    maDivBackground.style.width = "100%";
    window.document.body.appendChild(maDivBackground);


    var monMenu = window.document.createElement('div');
    monMenu.style.width = "100%";
    monMenu.style.height = "100px";
    monMenu.style.position = "absolute";
    monMenu.style.background = "rgba(25, 25, 22, 0.97)";
    monMenu.style.right = "3px";
    monMenu.style.top = "521px";
    monMenu.style.width = "45%";
    monMenu.style.height = "125px";
    monMenu.style.position = "absolute";
    // monMenu.style.border = "4px solid rgb(158, 41, 41)";
    monMenu.style.borderRadius = "0px";
    window.document.body.appendChild(monMenu);

var monTrue = true
var monSet = window.setInterval(function () {
    if (numberJoueur === 1 && monTrue) {
    var patientier = window.document.getElementById('chargement')
    patientier.style.display = "block" // à modifier une fois terminé
    // alert("Vous devez patientez qu'une seconde personne se connecte");
    monTrue = false;
    }
    if (numberJoueur === 2) {
        // alert("Vous pouvez maintenant commencer la partie");
        var patientier = window.document.getElementById('chargement')
        patientier.style.display = "none"
        window.clearInterval(monSet);
    }
        }, 1000);


    // Je défini le port et l'adresse ip de connection

    // ICI tous les déplacement de la souris sont envoyés au server.
    var xPercent;
    var yPercent;
    var mouse;
    var maCibles;

    window.addEventListener('mousemove', function( mouseMove ){
            
            mouse = {
                top: mouseMove.clientY,
                left: mouseMove.clientX,
                leftpct: xPercent,
                topPctObj: yPercent
            };
            xPercent = mouse.left/window.innerWidth;
            yPercent = mouse.top/window.innerHeight;
            // A chaque fois que la souris se déplace on envoie ses coordonnées au back end.
           
            websocketConnection.emit('mouseCoordinates', mouse);
        });

    
    // Je gére ici la position de ma souri
    var mouseClick;
    function playSound() {
        var sound = document.getElementById("audio");
        sound.play();
    }
    var monClick = window.addEventListener('click', function(){
        playSound()
            mouseClick = {
                mouseClickTop : (mouse.top + -97),
                mouseClickLeft : mouse.leftpct * 100,
            }

            websocketConnection.emit('mouseClickCoordinates', mouseClick);
        });

        // Je gére ici les informations de mes clics
             websocketConnection.on('InformationdeMesClick', function( mesObjetsCarreNonGlobal ) {
                
                console.log("Mon ID" + mesObjetsCarreNonGlobal.id + "test top" + mesObjetsCarreNonGlobal.clickTop);
                console.log("Mon ID" + mesObjetsCarreNonGlobal.id + "test left" + mesObjetsCarreNonGlobal.clickLeft);
                
                var monBoolean = true
               
        });
       
        websocketConnection.on('listedesjoueurs', function( docs ) {
          var test =  Object.keys(docs)
            if (test.length === 10) {
                if (docs[0].monID !== undefined) {
                    var j0 = window.document.getElementById('J0');
                    j0.innerHTML = docs[0].monID + " :" + " " + docs[0].score;
                    }
                    if (docs[1].monID !== undefined) {
                    var j1 = window.document.getElementById('J1');
                    j1.innerHTML = docs[1].monID + " :" + " " + docs[1].score;
                    }
                    if (docs[2].monID !== undefined) {
                    var j2 = window.document.getElementById('J2');
                    j2.innerHTML = docs[2].monID + " :" + " " + docs[2].score;
                    }
                    if (docs[3].monID !== undefined) {
                    var j3 = window.document.getElementById('J3');
                    j3.innerHTML = docs[3].monID + " :" + " " + docs[3].score; 
                    }
                    if (docs[4].monID !== undefined) {
                    var j4 = window.document.getElementById('J4');
                    j4.innerHTML = docs[4].monID + " :" + " " + docs[4].score;
                    }
                    if (docs[5].monID !== undefined) {
                    var j5 = window.document.getElementById('J5');
                    j5.innerHTML = docs[5].monID + " :" + " " + docs[5].score;
                    }
                    if (docs[6].monID !== undefined) {
                    var j6 = window.document.getElementById('J6');
                    j6.innerHTML = docs[6].monID + " :" + " " + docs[6].score;
                    }
                    if (docs[7].monID !== undefined) {
                    var j7 = window.document.getElementById('J7');
                    j7.innerHTML = docs[7].monID + " :" + " " + docs[7].score;
                    }
                    if (docs[8].monID !== undefined) {
                    var j8 = window.document.getElementById('J8');
                    j8.innerHTML = docs[8].monID + " :" + " " + docs[8].score;
                    }
                    if (docs[9].monID !== undefined) {
                    var j9= window.document.getElementById('J9');
                    j9.innerHTML = docs[9].monID + " :" + " " + docs[9].score;
                    }
                    
            }




    });


        websocketConnection.on('monTableauGagnant', function( monTableauGagnant ) {
            
            if (monTableauGagnant[0].monID !== 0 && monTableauGagnant[0].monTrue ) {
               
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[0].monID + 'Y';
                macroix.className = monTableauGagnant[0].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[0].monID).style.color;
                macroix.style.top = monTableauGagnant[0].mapositionT;
                macroix.style.left = monTableauGagnant[0].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[1].monID !== 0 && monTableauGagnant[1].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[1].monID + 'Y';
                macroix.className = monTableauGagnant[1].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[1].monID).style.color;
                macroix.style.top = monTableauGagnant[1].mapositionT;
                macroix.style.left = monTableauGagnant[1].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[2].monID !== 0 && monTableauGagnant[2].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[2].monID + 'Y';
                macroix.className = monTableauGagnant[2].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[2].monID).style.color;
                macroix.style.top = monTableauGagnant[2].mapositionT;
                macroix.style.left = monTableauGagnant[2].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[3].monID !== 0 && monTableauGagnant[3].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[3].monID + 'Y';
                macroix.className = monTableauGagnant[3].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[3].monID).style.color;
                macroix.style.top = monTableauGagnant[3].mapositionT;
                macroix.style.left = monTableauGagnant[3].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[4].monID !== 0 && monTableauGagnant[4].monTrue) {

                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[4].monID + 'Y';
                macroix.className = monTableauGagnant[4].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[4].monID).style.color;
                macroix.style.top = monTableauGagnant[4].mapositionT;
                macroix.style.left = monTableauGagnant[4].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[5].monID !== 0 && monTableauGagnant[5].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[5].monID + 'Y';
                macroix.className = monTableauGagnant[5].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[5].monID).style.color;
                macroix.style.top = monTableauGagnant[5].mapositionT;
                macroix.style.left = monTableauGagnant[5].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[6].monID !== 0 && monTableauGagnant[6].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[6].monID + 'Y';
                macroix.className = monTableauGagnant[6].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[6].monID).style.color;
                macroix.style.top = monTableauGagnant[6].mapositionT;
                macroix.style.left = monTableauGagnant[6].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[7].monID !== 0 && monTableauGagnant[7].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[7].monID + 'Y';
                macroix.className = monTableauGagnant[7].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[7].monID).style.color;
                macroix.style.top = monTableauGagnant[7].mapositionT;
                macroix.style.left = monTableauGagnant[7].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }

            if (monTableauGagnant[8].monID !== 0 && monTableauGagnant[8].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[8].monID + 'Y';
                macroix.className = monTableauGagnant[8].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[8].monID).style.color;
                macroix.style.top = monTableauGagnant[8].mapositionT;
                macroix.style.left = monTableauGagnant[8].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[9].monID !== 0 && monTableauGagnant[9].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[9].monID + 'Y';
                macroix.className = monTableauGagnant[9].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[9].monID).style.color;
                macroix.style.top = monTableauGagnant[9].mapositionT;
                macroix.style.left = monTableauGagnant[9].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[10].monID !== 0 && monTableauGagnant[10].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[10].monID + 'Y';
                macroix.className = monTableauGagnant[10].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[10].monID).style.color;
                macroix.style.top = monTableauGagnant[10].mapositionT;
                macroix.style.left = monTableauGagnant[10].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[11].monID !== 0 && monTableauGagnant[11].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[11].monID + 'Y';
                macroix.className = monTableauGagnant[11].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[11].monID).style.color;
                macroix.style.top = monTableauGagnant[11].mapositionT;
                macroix.style.left = monTableauGagnant[11].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[12].monID !== 0 && monTableauGagnant[12].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[12].monID + 'Y';
                macroix.className = monTableauGagnant[12].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[12].monID).style.color;
                macroix.style.top = monTableauGagnant[12].mapositionT;
                macroix.style.left = monTableauGagnant[12].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[13].monID !== 0 && monTableauGagnant[13].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[13].monID + 'Y';
                macroix.className = monTableauGagnant[13].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[13].monID).style.color;
                macroix.style.top = monTableauGagnant[13].mapositionT;
                macroix.style.left = monTableauGagnant[13].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[14].monID !== 0 && monTableauGagnant[14].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[14].monID + 'Y';
                macroix.className = monTableauGagnant[14].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[14].monID).style.color;
                macroix.style.top = monTableauGagnant[14].mapositionT;
                macroix.style.left = monTableauGagnant[14].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[15].monID !== 0 && monTableauGagnant[15].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[15].monID + 'Y';
                macroix.className = monTableauGagnant[15].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[15].monID).style.color;
                macroix.style.top = monTableauGagnant[15].mapositionT;
                macroix.style.left = monTableauGagnant[15].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[16].monID !== 0 && monTableauGagnant[16].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[16].monID + 'Y';
                macroix.className = monTableauGagnant[16].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[16].monID).style.color;
                macroix.style.top = monTableauGagnant[16].mapositionT;
                macroix.style.left = monTableauGagnant[16].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            if (monTableauGagnant[17].monID !== 0 && monTableauGagnant[17].monTrue) {
                
                var macroix = window.document.createElement('div')
                window.document.body.appendChild(macroix);
                maCibles = monTableauGagnant[17].monID + 'Y';
                macroix.className = monTableauGagnant[17].monID + 'Y';
                macroix.style.textAlign = "center";
                macroix.style.height = '18px';
                macroix.style.width = '12px';
                macroix.style.background = window.document.getElementById(monTableauGagnant[17].monID).style.color;
                macroix.style.top = monTableauGagnant[17].mapositionT;
                macroix.style.left = monTableauGagnant[17].mapositionL;
                macroix.style.position = "absolute";
                macroix.style.fontSize = "10px"
            }
            
            
        });
// ICI on reçoit les données nécessaire au dessin de n'importe quel carré
websocketConnection.on('CreationdeMonCarre', function( mesObjetsCarreNonGlobal ) {

            var cible1 = window.document.createElement('div');
            cible1.className = "cible1H"
            cible1.innerHTML = "<h3 style='color: white'>1</h3>";

            var cible2 = window.document.createElement('div');
            cible2.style.right = "24%";
            cible2.className = "cible2H"
            cible2.innerHTML = "&#10060";

            var cible3 = window.document.createElement('div');
            cible3.className = "cible2H"
            cible3.innerHTML = "&#10060";

            var cible4 = window.document.createElement('div');
            cible4.style.right = "12.5%";
            cible4.className = "cible2H"
            cible4.innerHTML = "&#10060";

            var cible5 = window.document.createElement('div');
            cible5.style.right = "7%";
            cible5.className = "cible2H"
            cible5.innerHTML = "&#10060";

            var cible6 = window.document.createElement('div');
            cible6.style.right = "1%";
            cible6.className = "cible1H"
            cible6.innerHTML = "<h3 style='color: white'>2</h3>";

            //

            var cible1B = window.document.createElement('div');
            cible1B.className = "cible1Hb"
            cible1B.innerHTML = "<h3 style='color: white'>1</h3>";

            var cible2B = window.document.createElement('div');
            cible2B.style.right = "24%";
            cible2B.className = "cible2Hb"
            cible2B.innerHTML = "&#10060";

            var cible3B = window.document.createElement('div');
            cible3B.className = "cible2Hb"
            cible3B.innerHTML = "&#10060";

            var cible4B = window.document.createElement('div');
            cible4B.style.right = "12.5%";
            cible4B.className = "cible2Hb"
            cible4B.innerHTML = "&#10060";

            var cible5B = window.document.createElement('div');
            cible5B.style.right = "7%";
            cible5B.className = "cible2Hb"
            cible5B.innerHTML = "&#10060";

            var cible6B = window.document.createElement('div');
            cible6B.style.right = "1%";
            cible6B.className = "cible1Hb"
            cible6B.innerHTML = "<h3 style='color: white'>2</h3>";

            var monCarre = window.document.getElementById(mesObjetsCarreNonGlobal.id);
            var monScoreJoueur = window.document.getElementById(mesObjetsCarreNonGlobal.id + 'R');
            if ( ! monCarre ) {
                numberJoueur = numberJoueur + 1;
                monCarre = window.document.createElement('div');
                window.document.body.appendChild(monCarre);
                monScoreJoueur = window.document.createElement('div');
                monMenu.appendChild(monScoreJoueur);
                window.document.body.appendChild(cible1);
                window.document.body.appendChild(cible2);
                window.document.body.appendChild(cible3);
                window.document.body.appendChild(cible4);
                window.document.body.appendChild(cible5);
                window.document.body.appendChild(cible6);
                window.document.body.appendChild(cible1B);
                window.document.body.appendChild(cible2B);
                window.document.body.appendChild(cible3B);
                window.document.body.appendChild(cible4B);
                window.document.body.appendChild(cible5B);
                window.document.body.appendChild(cible6B);
            }
            
            monCarre.style.width = '191px';
            monCarre.style.height = '191px';
            monCarre.style.position = 'absolute';
            monCarre.style.borderRadius = "103px"
            monCarre.style.backgroundImage = "url('../images/sniper.png')";
            monCarre.style.backgroundSize = "191px 191px";
            monCarre.style.margin = "0px 0px 0px -100px"
            monCarre.style.cursor = "none";

            monCarre.id = mesObjetsCarreNonGlobal.id;
            monCarre.style.top = mesObjetsCarreNonGlobal.top;
            monCarre.style.left = mesObjetsCarreNonGlobal.left;
            monCarre.style.border = "2px solid" + mesObjetsCarreNonGlobal.backgroundColor;
            monCarre.style.color =  mesObjetsCarreNonGlobal.backgroundColor;
            monMenu.style.border = "4px solid" + mesObjetsCarreNonGlobal.backgroundColor; 


            var scoreJ1 = "4"
            monScoreJoueur.style.display = "inline-block";
            monScoreJoueur.id = mesObjetsCarreNonGlobal.id + 'R';
            monScoreJoueur.style.fontSize = "18px";
            monScoreJoueur.style.width = "100%";
            monScoreJoueur.style.textTransform = "uppercase";
            monScoreJoueur.style.fontFamily = "sans-serif";
            monScoreJoueur.style.height = "50%";
            monScoreJoueur.style.textShadow = "rgb(0, 0, 0) 0px 1px 3px";
            monScoreJoueur.style.background = mesObjetsCarreNonGlobal.backgroundColor;
            monScoreJoueur.innerHTML = "<h3 style='color: white'> &#8627;" + mesObjetsCarreNonGlobal.monName + " : " + mesObjetsCarreNonGlobal.mesPoints  + " " + "</h3>";
                         
        });

         // ICI on reçoit les données nécessaire à la suppression d'un carré
         websocketConnection.on('supprimerCarreNonGlobal', function( mesObjetsCarreNonGlobal ) {
            var monCarreSupp = window.document.getElementById(mesObjetsCarreNonGlobal.id);
            var mesCroix = window.document.getElementsByClassName(mesObjetsCarreNonGlobal.id + 'Y');
            var monNameScore = window.document.getElementById(mesObjetsCarreNonGlobal.id + 'R');
            if ( monCarreSupp ) {
                numberJoueur = numberJoueur - 1;
                monNameScore.parentNode.removeChild(monNameScore);
                monCarreSupp.parentNode.removeChild(monCarreSupp);
                mesCroix.remove(maCibles);
            }
        });



    }
}

});