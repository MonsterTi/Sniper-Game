let fs = require('fs');
let http = require('http');
let server = http.createServer();
//
const path = require('path');
const url = require('url');
const port = process.env.PORT;
//
const MongoClient = require('mongodb').MongoClient;
// Il faut installer le module mongodb et faire appel à .MonclientClient

const urlMd = process.env.MONGODB_URI
// Nous placons l'url de notre Mongodb
const dbName = 'game';
// Le nom de la database, ce n'est pas la collection (voir ligne 24 pour voir le nom de la collection)


/**
 * Partie HTTP du serveur
 */

server.on('request', function (req, res) {
  console.log(`${req.method} ${req.url}`);
  // découpe l'URL
  const parsedUrl = url.parse(req.url);
  // Extrait le chemin de l'URL
  let pathname = `.${parsedUrl.pathname}`;
  // Associe le type MIME par rapport au suffixe du fichier demandé
  const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'js/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'application/font-sfnt'
  };
  fs.exists(pathname, function (exist) {
    if (!exist) {
      // si le fichier n'existe pas, renvoie 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }
    // s'il s'agit d'un répertoire, on tente d'y trouver un fichier client.html
    if (fs.statSync(pathname).isDirectory()) {
      pathname += '/client.html';
    }
    // lecture du fichier local
    fs.readFile(pathname, function (err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // extraction du suffixe de fichier selon le chemin basé sur l'URL fournie. ex. .js, .doc, ...
        const ext = path.parse(pathname).ext;
        // si le fichier est trouvé, définit le content-type et envoie les données
        res.setHeader('Content-type', mimeType[ext] || 'text/plain');
        res.end(data);
      }
    });
  });
});


const SocketIo = require('socket.io');
let socketIo = new SocketIo(server);

// Mon Objet qui va définir mes carrés
let mesObjetsCarreGlobal = {};
let monTableauGagnant = [];
var nbDeJoueurVar = {};

socketIo.on('connection', function (websocketConnection) {

  MongoClient.connect(urlMd, {
      useNewUrlParser: true
    }, function (err, client)

    {
      const db = client.db(dbName);
      const collection = db.collection('nameid');
      collection.find({}).sort({
        _id: -1
      }).limit(10).toArray(function (err, docs) {
        if (err) {
          console.log();
        } else {
          websocketConnection.emit('listedesjoueurs', docs);
          console.log(docs);
        }
      });
    });
  //
  // J'effectue ma connection à mon socketIo

  // Mes nombres aléatoires
  function entierAleatoire(min, max) {
    return Math.floor((max - min) * Math.random()) + min;
  };
  var monNomAleatoire = entierAleatoire(1, 10000);


  let maFonctioNumberCible = function (x = 0, min, max) {
    return x >= min && x <= max;
  }
  // Mon objet carré vide
  let mesObjetsCarreNonGlobal = {
    top: '0px',
    left: '0px',
    id: monNomAleatoire,
    backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
    clickTop: '0px',
    clickLeft: '0px',
    mesPoints: 0,
    monName: 0,
    cibles: {
      ciblesFleches: {
        ciblesFleches1: {
          top: 0,
          left: 0,
        },
        ciblesFleches2: {
          top: 0,
          left: 0,
        },
        ciblesFleches3: {
          top: 0,
          left: 0,
        },
        ciblesFleches4: {
          top: 0,
          left: 0,
        },
        ciblesFleches5: {
          top: 0,
          left: 0,
        },
        ciblesFleches6: {
          top: 0,
          left: 0,
        },
        ciblesFleches7: {
          top: 0,
          left: 0,
        },
        ciblesFleches8: {
          top: 0,
          left: 0,
        },
      },
      ciblesCanards: {
        ciblesCanards1: {
          top: 0,
          left: 0,
        },
        ciblesCanards2: {
          top: 0,
          left: 0,
        },
        ciblesCanards3: {
          top: 0,
          left: 0,
        },
        ciblesCanards4: {
          top: 0,
          left: 0,
        },
        ciblesCanards5: {
          top: 0,
          left: 0,
        },
        ciblesCanards6: {
          top: 0,
          left: 0,
        },
        ciblesCanards7: {
          top: 0,
          left: 0,
        },
        ciblesCanards8: {
          top: 0,
          left: 0,
        },
        ciblesCanards9: {
          top: 0,
          left: 0,
        },
        ciblesCanards10: {
          top: 0,
          left: 0,
        },
      },
    }
  };

  // J'ajoute dans mon Objet global, mon carré que je crée pour chaque nouveau socket
  mesObjetsCarreGlobal[mesObjetsCarreNonGlobal.id] = mesObjetsCarreNonGlobal;

  websocketConnection.emit('CreationdeMonCarre', mesObjetsCarreNonGlobal);

  // nbDeJoueurVar.numberJoueur = Object.keys(mesObjetsCarreGlobal).length
  // socketIo.emit('nbDeJoueur', nbDeJoueurVar);
  // Mon tableau gagnant
  monTableauGagnant = [{
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }, {
    monID: 0,
    monTrue: 0,
    mapositionT: 0,
    mapositionL: 0,
  }];

  // Je gére ici les positions de
  websocketConnection.on('mouseClickCoordinates', function (mouseClick) {

    mesObjetsCarreNonGlobal.clickLeft = mouseClick.mouseClickLeft + '%';
    mesObjetsCarreNonGlobal.clickTop = mouseClick.mouseClickTop + 'px';

    // CIBLES FLECHES 1
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches1.top = maFonctioNumberCible(mouseClick.mouseClickTop, 133, 143)
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches1.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 19.444761904761905, 20.492857142857142)
    // CIBLES FLECHES 2
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches2.top = maFonctioNumberCible(mouseClick.mouseClickTop, -4, 6)
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches2.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 38.095238095238095, 38.73380952380952)
    // CIBLES FLECHES 3
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches3.top = maFonctioNumberCible(mouseClick.mouseClickTop, 362, 379)
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches3.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 44.027619047619044, 44.567619047619044)
    // CIBLES FLECHES 4
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches4.top = maFonctioNumberCible(mouseClick.mouseClickTop, 240, 257)
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches4.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 46.88369119420989, 47.39369119420989)
    // CIBLES FLECHES 5
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches5.top = maFonctioNumberCible(mouseClick.mouseClickTop, 155, 173)
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches5.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 55.11857142857143, 55.50857142857143)
    // CIBLES FLECHES 6
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches6.top = maFonctioNumberCible(mouseClick.mouseClickTop, 299, 312)
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches6.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 56.48809523809524, 56.96809523809524)
    // CIBLES FLECHES 7
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches7.top = maFonctioNumberCible(mouseClick.mouseClickTop, 228, 243)
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches7.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 63.86857142857142, 64.46857142857142)
    // CIBLES FLECHES 8
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches8.top = maFonctioNumberCible(mouseClick.mouseClickTop, 395, 408)
    mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches8.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 74.60796139927623, 75.22796139927623)
    ////////////////////////////////////////////////////////////////////////////////////////
    //    
    //
    //
    // CIBLES FLECHES 1
    if (mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches1.top && mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches1.left && monTableauGagnant[0].monID === 0) {
      console.log('test');
      monTableauGagnant[0].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[0].monTrue = true;
      monTableauGagnant[0].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[0].mapositionL = mouseClick.mouseClickLeft + 0.7 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[0].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[0].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[0].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[0].monID);
      monTableauGagnant[0].monTrue = false
    } else {
      console.log("raté ou trop tard");
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[0].monID);
      console.log(mesObjetsCarreGlobal);
      console.log(nbDeJoueurVar);

    }
    // // CIBLES FLECHES 2
    if (mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches2.top && mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches2.left && monTableauGagnant[1].monID === 0) {
      console.log('test');
      monTableauGagnant[1].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[1].monTrue = true;
      monTableauGagnant[1].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[1].mapositionL = mouseClick.mouseClickLeft + 0.7 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[1].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[1].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[1].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[1].monID);
      monTableauGagnant[1].monTrue = false
    }
    // // CIBLES FLECHES 3
    if (mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches3.top && mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches3.left && monTableauGagnant[2].monID === 0) {
      console.log('test');
      monTableauGagnant[2].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[2].monTrue = true;
      monTableauGagnant[2].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[2].mapositionL = mouseClick.mouseClickLeft + 0.7 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[2].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[2].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[2].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[2].monID);
      monTableauGagnant[2].monTrue = false
    }
    // // CIBLES FLECHES 4
    if (mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches4.top && mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches4.left && monTableauGagnant[3].monID === 0) {
      console.log('test');
      monTableauGagnant[3].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[3].monTrue = true;
      monTableauGagnant[3].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[3].mapositionL = mouseClick.mouseClickLeft + 0.4 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[3].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[3].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[3].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[3].monID);
      monTableauGagnant[3].monTrue = false
    }
    // CIBLES FLECHES 5
    if (mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches5.top && mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches5.left && monTableauGagnant[4].monID === 0) {
      console.log('test');
      monTableauGagnant[4].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[4].monTrue = true;
      monTableauGagnant[4].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[4].mapositionL = mouseClick.mouseClickLeft + 0.7 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[4].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[4].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[4].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[4].monID);
      monTableauGagnant[4].monTrue = false
    }
    // CIBLES FLECHES 6
    if (mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches6.top && mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches6.left && monTableauGagnant[5].monID === 0) {
      console.log('test');
      monTableauGagnant[5].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[5].monTrue = true;
      monTableauGagnant[5].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[5].mapositionL = mouseClick.mouseClickLeft + 0.4 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[5].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[5].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[5].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[5].monID);
      monTableauGagnant[5].monTrue = false
    }
    // CIBLES FLECHES 7
    if (mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches7.top && mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches7.left && monTableauGagnant[6].monID === 0) {
      console.log('test');
      monTableauGagnant[6].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[6].monTrue = true;
      monTableauGagnant[6].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[6].mapositionL = mouseClick.mouseClickLeft + 0.4 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[6].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[6].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[6].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[6].monID);
      monTableauGagnant[6].monTrue = false
    }
    // CIBLES FLECHES 8
    if (mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches8.top && mesObjetsCarreNonGlobal.cibles.ciblesFleches.ciblesFleches8.left && monTableauGagnant[7].monID === 0) {
      console.log('test');
      monTableauGagnant[7].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[7].monTrue = true;
      monTableauGagnant[7].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[7].mapositionL = mouseClick.mouseClickLeft + 0.6 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[7].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[7].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[7].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[7].monID);
      monTableauGagnant[7].monTrue = false
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// FIN DES CIBLES FLECHES ///////////////////////////////////

    // CIBLES CANARDS 1
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards1.top = maFonctioNumberCible(mouseClick.mouseClickTop, 297, 315)
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards1.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 22.758866103739444, 23.23980699638118)
    // CIBLES CANARDS 2
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards2.top = maFonctioNumberCible(mouseClick.mouseClickTop, 406, 414)
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards2.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 27.261761158021713, 27.661761158021713)
    // CIBLES CANARDS 3
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards3.top = maFonctioNumberCible(mouseClick.mouseClickTop, 359, 369)
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards3.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 35.886610373944514, 36.386610373944514)
    // CIBLES CANARDS 4
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards4.top = maFonctioNumberCible(mouseClick.mouseClickTop, 296, 309)
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards4.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 36.95351025331725, 37.45351025331725)
    // CIBLES CANARDS 5
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards5.top = maFonctioNumberCible(mouseClick.mouseClickTop, 1, 15)
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards5.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 30.539324487334136, 31.099324487334136)
    // CIBLES CANARDS 6
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards6.top = maFonctioNumberCible(mouseClick.mouseClickTop, 271, 289)
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards6.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 44.35145958986731, 44.75145958986731)
    // CIBLES CANARDS 7
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards7.top = maFonctioNumberCible(mouseClick.mouseClickTop, 195, 209)
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards7.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 48.784354644149576, 49.394354644149576)
    // CIBLES CANARDS 8
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards8.top = maFonctioNumberCible(mouseClick.mouseClickTop, 182, 194)
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards8.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 55.87104945717732, 56.47104945717732)
    // CIBLES CANARDS 9
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards9.top = maFonctioNumberCible(mouseClick.mouseClickTop, 287, 304)
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards9.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 55.20759951749096, 55.79759951749096)
    // CIBLES CANARDS 10
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards10.top = maFonctioNumberCible(mouseClick.mouseClickTop, 263, 280)
    mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards10.left = maFonctioNumberCible(mouseClick.mouseClickLeft, 65.30028950542823, 65.98028950542823)



    ////////////////////////////////////////////////////////////////////////////////////////////
    // CIBLES CANARDS 1
    if (mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards1.top && mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards1.left && monTableauGagnant[8].monID === 0) {
      console.log('test');
      monTableauGagnant[8].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[8].monTrue = true;
      monTableauGagnant[8].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[8].mapositionL = mouseClick.mouseClickLeft + 1 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[8].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[8].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[8].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[8].monID);
      monTableauGagnant[8].monTrue = false
    }
    // CIBLES CANARDS 2
    if (mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards2.top && mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards2.left && monTableauGagnant[9].monID === 0) {
      console.log('test');
      monTableauGagnant[9].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[9].monTrue = true;
      monTableauGagnant[9].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[9].mapositionL = mouseClick.mouseClickLeft + 1 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[9].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[9].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[9].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[9].monID);
      monTableauGagnant[9].monTrue = false
    }
    // CIBLES CANARDS 3
    if (mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards3.top && mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards3.left && monTableauGagnant[10].monID === 0) {
      console.log('test');
      monTableauGagnant[10].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[10].monTrue = true;
      monTableauGagnant[10].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[10].mapositionL = mouseClick.mouseClickLeft + 1 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[10].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[10].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[10].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[10].monID);
      monTableauGagnant[10].monTrue = false
    }
    // CIBLES CANARDS 4
    if (mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards4.top && mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards4.left && monTableauGagnant[11].monID === 0) {
      console.log('test');
      monTableauGagnant[11].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[11].monTrue = true;
      monTableauGagnant[11].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[11].mapositionL = mouseClick.mouseClickLeft + 1 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[11].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[11].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[11].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[11].monID);
      monTableauGagnant[11].monTrue = false
    }
    // CIBLES CANARDS 5
    if (mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards5.top && mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards5.left && monTableauGagnant[12].monID === 0) {
      console.log('test');
      monTableauGagnant[12].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[12].monTrue = true;
      monTableauGagnant[12].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[12].mapositionL = mouseClick.mouseClickLeft + 1 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[12].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[12].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[12].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[12].monID);
      monTableauGagnant[12].monTrue = false
    }
    // CIBLES CANARDS 6
    if (mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards6.top && mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards6.left && monTableauGagnant[13].monID === 0) {
      console.log('test');
      monTableauGagnant[13].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[13].monTrue = true;
      monTableauGagnant[13].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[13].mapositionL = mouseClick.mouseClickLeft + 1 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[13].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[13].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[13].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[13].monID);
      monTableauGagnant[13].monTrue = false
    }
    // CIBLES CANARDS 7
    if (mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards7.top && mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards7.left && monTableauGagnant[14].monID === 0) {
      console.log('test');
      monTableauGagnant[14].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[14].monTrue = true;
      monTableauGagnant[14].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[14].mapositionL = mouseClick.mouseClickLeft + 1 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[14].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[14].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[14].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[14].monID);
      monTableauGagnant[14].monTrue = false
    }
    // CIBLES CANARDS 8
    if (mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards8.top && mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards8.left && monTableauGagnant[15].monID === 0) {
      console.log('test');
      monTableauGagnant[15].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[15].monTrue = true;
      monTableauGagnant[15].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[15].mapositionL = mouseClick.mouseClickLeft + 1 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[15].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[15].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[15].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[15].monID);
      monTableauGagnant[15].monTrue = false
    }
    // CIBLES CANARDS 9
    if (mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards9.top && mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards9.left && monTableauGagnant[16].monID === 0) {
      console.log('test');
      monTableauGagnant[16].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[16].monTrue = true;
      monTableauGagnant[16].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[16].mapositionL = mouseClick.mouseClickLeft + 1 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[16].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[16].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[16].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[16].monID);
      monTableauGagnant[16].monTrue = false
    }
    // CIBLES CANARDS 10
    if (mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards10.top && mesObjetsCarreNonGlobal.cibles.ciblesCanards.ciblesCanards10.left && monTableauGagnant[17].monID === 0) {
      console.log('test');
      monTableauGagnant[17].monID = mesObjetsCarreNonGlobal.id;
      monTableauGagnant[17].monTrue = true;
      monTableauGagnant[17].mapositionT = mouseClick.mouseClickTop + 85 + 'px';
      monTableauGagnant[17].mapositionL = mouseClick.mouseClickLeft + 1 + '%';

      mesObjetsCarreGlobal[monTableauGagnant[17].monID].mesPoints = mesObjetsCarreGlobal[monTableauGagnant[17].monID].mesPoints + 2
      console.log(mesObjetsCarreGlobal);


    } else if (monTableauGagnant[17].monTrue) {
      console.log("Un Gagnant est déjà enregistré " + monTableauGagnant[17].monID);
      monTableauGagnant[17].monTrue = false
    }

    socketIo.emit('InformationdeMesClick', mesObjetsCarreNonGlobal);
    socketIo.emit('monTableauGagnant', monTableauGagnant);
  });


  websocketConnection.on('monNameID', function (monNameID) {
    mesObjetsCarreNonGlobal.monName = monNameID.monName
    console.log(monNameID.monName);

  });

  // ICI j'ai mon server qui écoute, et reçoit les coordoonées dans son argument des mouvement de la souris 
  // Voir l'emit (client) qui s'appelle mouseCoordinates
  websocketConnection.on('mouseCoordinates', function (mouse) {

    var leftPctObj = mouse.leftpct * 100
    // var topPctObj =  mouse.topPctObj * 100
    mesObjetsCarreNonGlobal.top = (mouse.top + -97) + 'px';
    // mesObjetsCarreNonGlobal.top = topPctObj + '%';
    mesObjetsCarreNonGlobal.left = leftPctObj + '%';

    // Envoi à tous les client d'une demande de mise à jour du carré
    // En utilisant socketIO, je l'envoie à tous les 
    socketIo.emit('CreationdeMonCarre', mesObjetsCarreNonGlobal);
  });




  // La déconnexion on envoie l'objet contenant les méta données du carré au front-end pour qu'il soit supprimé.
  websocketConnection.on('disconnect', function () {
    // On supprime le carré stocké dans l'objet squares
    delete mesObjetsCarreGlobal[mesObjetsCarreNonGlobal.id];
    nbDeJoueurVar = Object.keys(mesObjetsCarreGlobal).length

    // On envoie les méta données du carré au front pour suppression du DOM
    socketIo.emit('supprimerCarreNonGlobal', mesObjetsCarreNonGlobal);
    if (mesObjetsCarreNonGlobal.monName !== 0) {

      MongoClient.connect(urlMd, {
          useNewUrlParser: true
        }, function (err, client)

        {
          const db = client.db(dbName);
          const collection = db.collection('nameid');

          collection.insertOne({
            monID: mesObjetsCarreNonGlobal.monName,
            score: mesObjetsCarreNonGlobal.mesPoints
          }, function (err, result) {
            if (err) {
              console.log('erreur');
            }
            if (result) {
              console.log('apparamment ca fonctionne..');
            }
          });

        });

    }
  });

});

server.listen(port);