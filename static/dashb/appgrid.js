// App grid functions


var emptyColor = '#e8e8e8';


// Edit button clicked: show app selection list, enable drag+drop
function showAppselect() {
    $("#appselect").css("display", "block");
    $("#editbutton").css("display", "none");
    $('.dragdrop').attr('draggable', 'true');
    $('.emptybox').attr('draggable', 'false');
}


// App checkbox changed
function appCheck(checkbox) {
    var app_name = checkbox.value;
    if (checkbox.checked) {
        // Add checked app to grid
        var appbox = findbox('');       // find first empty box in grid
        if (appbox) {
            appbox.children[0].innerText = app_name;
            appbox.children[1].innerText = checkbox.attributes.descr.value;
            var a = appbox.parentNode;
            a.href = checkbox.attributes.applink.value;
            var dragdrop = a.parentNode;
            dragdrop.className = 'dragdrop';    // remove class 'emptybox'
            dragdrop.setAttribute('draggable','true');
            var tr = checkbox.parentNode.parentNode;
            dragdrop.style.backgroundColor = tr.style.backgroundColor;
            var appname = tr.getElementsByClassName('appname')[0];
            appbox.firstElementChild.style.color = appname.style.color;
        }
    } else {
        // Remove unchecked app from grid
        var appbox = findbox(app_name);
        if (appbox) {
            appbox.children[0].innerText = '';      // appname
            appbox.children[1].innerText = '';      // appdesc
            var a = appbox.parentNode;
            a.removeAttribute('href');
            var dragdrop = a.parentNode;
            dragdrop.className = 'dragdrop emptybox';  // add class 'emptybox'
            dragdrop.setAttribute('draggable','false');
            dragdrop.style.backgroundColor = emptyColor;
        }
    }
}


// Return first appbox containing given app_name
function findbox(app_name) {
    var appgrid = document.getElementById('appgrid');
    var appboxes = appgrid.getElementsByClassName('appbox');
    for (i = 0; i < appboxes.length; i++) {
        if (appboxes[i].firstElementChild.innerText == app_name) {
            return appboxes[i];
        }
    }
    return null;
}


// Drag-and-drop

function drag(evt) {
    evt.dataTransfer.setData('dragSrcId', evt.target.parentNode.id);
}

function allowDrop(evt) {
    evt.preventDefault();
}

function drop(evt) {
    evt.preventDefault();
    var target = evt.target
    if (target.className != 'appbox') {
        target = target.parentNode;
    }
    var dragSrcId = evt.dataTransfer.getData('dragSrcId');
    var srcParent = document.getElementById(dragSrcId);        // div.gridpos
    var destParent = target.parentNode.parentNode.parentNode;  // div.gridpos
    // swap source and dest
    destParent.appendChild(srcParent.firstElementChild);
    srcParent.appendChild(destParent.firstElementChild);
}


// Collect app positions in grid (triggered by Cancel or Save)
function submitGrid() {
    var appgrid = document.getElementById('appgrid');
    var appboxes = appgrid.getElementsByClassName('appbox');
    var app_positions_list = [];
    var app_name;
    for (i = 0; i < appboxes.length; i++) {
        app_name = appboxes[i].firstElementChild.innerText;
        app_positions_list.push(app_name);
    }
    document.getElementById('app_positions').value = app_positions_list;
}
