// 2015  John J. McAssey (JJMack) 

// ======================================================= */

// This script is supplied as is. It is provided as freeware. 

// The author accepts no liability for any problems arising from its use.

// enable double-clicking from Mac Finder or Windows Explorer

#target photoshop // this command only works in Photoshop CS2 and higher

// bring application forward for double-click events

app.bringToFront();

// ensure at least one document open

if (!documents.length) alert('There are no documents open.', 'No Document');

else {

//Set First Time Defaults here

var dfltCpys = 12; // default number of copies including the original

var dfltPos = 4; // default Middle Center

//End Defaults

var Prefs ={}; //Object to hold preferences.

var prefsFile = File(Folder.temp + "/RotateLayerAboutPreferences.dat");

//If preferences do not exit use Defaults from above

if(!prefsFile.exists){

Prefs.Cpys  = dfltCpys;

Prefs.Pos  = dfltPos;

prefsFile.open('w');

prefsFile.write(Prefs.toSource());

prefsFile.close();

}

else{//Preferences exist so open them

prefsFile.open('r');

Prefs = eval(prefsFile.read());

prefsFile.close();

}

try {

function createDialog(){

// begin dialog layout

var DupRotateDialog = new Window('dialog');

DupRotateDialog.text = 'Duplicate and Rotate Layer';

DupRotateDialog.frameLocation = [78, 100];

DupRotateDialog.alignChildren = 'center';

DupRotateDialog.NumLayerPnl = DupRotateDialog.add('panel', [2, 2, 300, 56], 'Number of Layers and Rotation Anchor Point');

DupRotateDialog.NumLayerPnl.add('statictext', [10, 16, 50, 48], 'Copies ');

DupRotateDialog.NumLayerPnl.imgCpysEdt = DupRotateDialog.NumLayerPnl.add('edittext', [50, 13, 90, 34], Prefs.Cpys, {name:'imgCpys'});

DupRotateDialog.NumLayerPnl.imgCpysEdt.helpTip = 'Number of copies of selected Layer';

DupRotateDialog.NumLayerPnl.add('statictext',[96, 16, 240, 48],'Location');

var position =['Center'];

DupRotateDialog.NumLayerPnl.dd1 = DupRotateDialog.NumLayerPnl.add('dropdownlist',[150, 13, 260, 34],position);

DupRotateDialog.NumLayerPnl.dd1.selection=Prefs.Pos;

var buttons = DupRotateDialog.add('group');

buttons.orientation = 'row';

var okBtn = buttons.add('button');

okBtn.text = 'OK';

okBtn.properties = {name: 'ok'};

var cancelBtn = buttons.add('button');

cancelBtn.text = 'Cancel';

cancelBtn.properties = {name: 'cancel'};

return DupRotateDialog;

}

dispdlg(createDialog());

function dispdlg(DupRotateDialog){ 

// display dialog and only continues on OK button press (OK = 1, Cancel = 2)

DupRotateDialog.onShow = function() {

var ww = DupRotateDialog.bounds.width;  

var hh = DupRotateDialog.bounds.height;  

DupRotateDialog.bounds.x  = 78;  

DupRotateDialog.bounds.y  = 100;  

DupRotateDialog.bounds.width  = ww;  

DupRotateDialog.bounds.height  = hh;  

}

if (DupRotateDialog.show() == 1) {

//variables passed from user interface

var copies = String(DupRotateDialog.NumLayerPnl.imgCpys.text); if (copies=="") { copies = Prefs.Cpys;}

if (isNaN(copies)) { alert("Non numeric value entered"); dispdlg(createDialog());}

else {

if (copies<2 || copies>360) { alert("Number of layer allow is 2 to 360"); dispdlg(createDialog());}  // Not in range

else {

var AnchorPoint = Number(DupRotateDialog.NumLayerPnl.dd1.selection.index) + 1;

cTID = function(s) { return app.charIDToTypeID(s); };

sTID = function(s) { return app.stringIDToTypeID(s); };

// Save the current preferences

Prefs.Cpys  = copies;

Prefs.Pos  = Number(DupRotateDialog.NumLayerPnl.dd1.selection.index);

prefsFile.open('w');

prefsFile.write(Prefs.toSource());

prefsFile.close();

var startRulerUnits = app.preferences.rulerUnits;

var startTypeUnits = app.preferences.typeUnits;

var startDisplayDialogs = app.displayDialogs;

// Set Photoshop to use pixels and display no dialogs

app.preferences.rulerUnits = Units.PIXELS;

app.preferences.typeUnits = TypeUnits.PIXELS;

app.displayDialogs = DialogModes.NO;

app.togglePalettes();

try { app.activeDocument.suspendHistory('RotateLayerAbout','main(copies, AnchorPoint)' );} 

catch(e) {alert(e + ': on line ' + e.line);} 

// Return the app preferences

app.togglePalettes();

app.preferences.rulerUnits = startRulerUnits;

app.preferences.typeUnits = startTypeUnits;

app.displayDialogs = startDisplayDialogs;

}

}

}

else {

//alert('Operation Canceled.');

}

}

}

catch(err){

// Lot's of things can go wrong, Give a generic alert and see if they want the details

if ( confirm("Sorry, something major happened and I can't continue! Would you like to see more info?" ) ) { alert(err + ': on line ' + err.line ); }

}

}

function main(stemsAmount, Position) {

// Save selected layer to variable:

var originalStem = app.activeDocument.activeLayer;

// Run the copying process

if(stemsAmount != null){ 

// Calculate the rotation angle

// var angle = 360 / parseInt(stemsAmount);

var angle = 1;

// Create a group for stems

var stemsGroup = app.activeDocument.layerSets.add();

stemsGroup.name = originalStem.name + " ("+stemsAmount+" stems)";

// Place original layer in group

originalStem.move(stemsGroup, ElementPlacement.INSIDE);

// Duplicate and rotate layers:

for(var i = 1; i < stemsAmount; i++){

// Duplicate original layer and save it to the variable

var newStem = originalStem.duplicate();

// Rotate new layer

// newStem.rotate(angle * i, AnchorPosition.MIDDLECENTER);

newStem.rotate(angle, AnchorPosition.MIDDLECENTER);

for(var j = 1; j < i; j++){

    k = newStem.rotate(angle, AnchorPosition.MIDDLECENTER);

};

// Add index to new layers

newStem.name = originalStem.name + " " + (i+1);

// Place new layer inside stems group

newStem.move(stemsGroup, ElementPlacement.PLACEATEND);

};

// Add index to the original layer

originalStem.name += " 1";

};

activeDocument.activeLayer = activeDocument.layers[0]; // Target top

var groupname = app.activeDocument.activeLayer.name // remember name of group  

var idungroupLayersEvent = stringIDToTypeID( "ungroupLayersEvent" ); // this part from  Script Listene -- ungroup group  

var desc14 = new ActionDescriptor();  

var idnull = charIDToTypeID( "null" );  

var ref13 = new ActionReference();  

var idLyr = charIDToTypeID( "Lyr " );  

var idOrdn = charIDToTypeID( "Ordn" );  

var idTrgt = charIDToTypeID( "Trgt" );  

ref13.putEnumerated( idLyr, idOrdn, idTrgt );  

desc14.putReference( idnull, ref13 );  

executeAction( idungroupLayersEvent, desc14, DialogModes.NO );  

var idMk = charIDToTypeID( "Mk  " ); // this part from  Script Listene --  group selected layers  

var desc15 = new ActionDescriptor();  

var idnull = charIDToTypeID( "null" );  

var ref14 = new ActionReference();  

var idlayerSection = stringIDToTypeID( "layerSection" );  

ref14.putClass( idlayerSection );  

desc15.putReference( idnull, ref14 );  

var idFrom = charIDToTypeID( "From" );  

var ref15 = new ActionReference();  

var idLyr = charIDToTypeID( "Lyr " );  

var idOrdn = charIDToTypeID( "Ordn" );  

var idTrgt = charIDToTypeID( "Trgt" );  

ref15.putEnumerated( idLyr, idOrdn, idTrgt );  

desc15.putReference( idFrom, ref15 );  

executeAction( idMk, desc15, DialogModes.NO );  

app.activeDocument.activeLayer.name = groupname // recall group name  

}

function rotateAroundPosition(_angle,x,y) {  

    var desc1 = new ActionDescriptor();  

    var desc2 = new ActionDescriptor();  

    var ref1 = new ActionReference();  

    ref1.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));  

    desc1.putReference(charIDToTypeID('null'), ref1);  

    desc1.putEnumerated(charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), stringIDToTypeID("QCSIndependent"));  

    desc2.putUnitDouble(charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), x);  

    desc2.putUnitDouble(charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), y);  

    desc1.putObject(charIDToTypeID('Pstn'), charIDToTypeID('Pnt '), desc2);  

    desc1.putUnitDouble(charIDToTypeID('Angl'), charIDToTypeID('#Ang'), _angle);  

    desc1.putEnumerated(charIDToTypeID('Intr'), charIDToTypeID('Intp'), charIDToTypeID('Bcbc'));  

    executeAction(charIDToTypeID('Trnf'), desc1, DialogModes.NO);  

}

////// determine selected path //////

function selectedPath () {

try {

var ref = new ActionReference(); 

ref.putEnumerated( charIDToTypeID("Path"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") ); 

var desc = executeActionGet(ref);

var theName = desc.getString(charIDToTypeID("PthN"));

return app.activeDocument.pathItems.getByName(theName)

}

catch (e) {

return undefined

}

};

////// michael l hale’s code //////

function extractSubPathInfo(pathObj){  

    var pathArray = new Array();// each element can be used as the second arugment in pathItems.add ie doc.pathItems.add("myPath1", [pathArray[0]]);  

    var pl = pathObj.subPathItems.length;  

    for(var s=0;s<pl;s++){  

        var pArray = new Array();  

          for(var i=0;i<pathObj.subPathItems.pathPoints.length;i++){  

             pArray = new PathPointInfo;  

             pArray.kind = pathObj.subPathItems.pathPoints.kind;  

             pArray.anchor = pathObj.subPathItems.pathPoints.anchor;  

//alert("Anchor " + pathObj.subPathItems.pathPoints.anchor );

             pArray.leftDirection = pathObj.subPathItems.pathPoints.leftDirection;  

             pArray.rightDirection = pathObj.subPathItems.pathPoints.rightDirection;  

          };  

        pathArray[pathArray.length] = new Array();  

        pathArray[pathArray.length - 1] = new SubPathInfo();  

        pathArray[pathArray.length - 1].operation = pathObj.subPathItems.operation;  

        pathArray[pathArray.length - 1].closed = pathObj.subPathItems.closed;  

        pathArray[pathArray.length - 1].entireSubPath = pArray;  

    };  

    return pathArray;  

}; 