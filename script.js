//1.)grab ls if any...
var notesBackup = localStorage.getItem('notes');

if (notesBackup) 
{
    var arrNotes = JSON.parse(notesBackup);
    buildClassList(arrNotes);
} else {

    var arrNotes = [];
}

function buildClassList(arrNotes) 
{
    var divList = document.querySelector('.list-reminder-note');
    for (var i = 0; i < arrNotes.length; i++) {
        var notes = createNote(arrNotes[i]);

        divList.append(notes);
    }
}
editText();
function editText()
{
    var x = document.querySelectorAll(".note > p");
    for (var i = 0; i < x.length; i++) 
    {
        x[i].addEventListener('click', function(event) 
        {
            var dd = event.target;
            console.log(event);
            var previous = dd.textContent;
            console.log(typeof previous);
            dd.innerHTML = '<textarea type="text" class="col-md-7"></textarea>';
            console.log(dd.value);
            dd.value = previous; 

        }) 
    }
}

document.querySelector('form').addEventListener('submit', function(event) 
{
        event.preventDefault();
        var form = event.target;
        var textArea = checkText(form.querySelector('[name=textarea]').value);
        var date = checkDate(form.querySelector('[name=date]').value);

    if (!textArea === false && !date === false) {

        var newNoteObj = {
            textRem: textArea,
            dateRem: date,
        }

        var newNote = createNote(newNoteObj);
console.log(newNote);
        newNote.classList.remove('is-paused');
        document.querySelector('.list-reminder-note').prepend(newNote);    
        arrNotes.unshift(newNoteObj);

        updateBackup(arrNotes);
        editText();
    }

});



//send arrNotes to backup
function updateBackup(array) 
{
    localStorage.setItem('notes', JSON.stringify(array));
}

function createNote(newNoteObj) 
{
    var pText = document.createElement('p');
        pText.textContent = newNoteObj.textRem;
        pText.classList.add("col-md-7");

    var spanDate = document.createElement('span');
        spanDate.textContent = newNoteObj.dateRem;

    var divNote = document.createElement('div');
        divNote.classList.add("note","col-md-3", "fade-in" );

    var btnDel = document.createElement('button');
        btnDel.textContent = '✖';
        btnDel.addEventListener('click', deleteNote);

        divNote.append(pText);
        divNote.append(spanDate);
        divNote.append(btnDel);

    return divNote;

}

function deleteNote(event) 
{

    var deleteBtn = event.target;
    var note = deleteBtn.parentNode;

    var notes = document.querySelectorAll('.list-reminder-note div');


    for (var i = 0; i < notes.length; i++) {
        if (notes[i] == note) {
            break;
        }
    }
    arrNotes.splice(i, 1);

    note.remove();

    // // update the localStorage
    updateBackup(arrNotes);
}


function checkText (textValue) {
    if (document.querySelector('#invalid_Alert_text')) {

            document.querySelector('#invalid_Alert_text').innerHTML = '';
    }
    var alertText = document.querySelector('#invalid_Alert_text');

    var WordingRegExp = /^[a-zA-Z\s]+$/;

console.log(textValue);
    if (textValue.length > 1 && (WordingRegExp.test(textValue) === true)) {
        // document.querySelector('textarea').value = '';
        alertText.innerHTML = '';
        // textValue = true;
    } else {
        if (textValue.length <= 1) {
            var noText = document.createElement('bold');
                noText.textContent = "*please type more text";
                alertText.append(noText);
                textValue = false;
        } else if (WordingRegExp.test(textValue) === false) {
            var onlyAlphaText = document.createElement('bold');
                onlyAlphaText.textContent = "*please type only charcters";
                alertText.append(onlyAlphaText);
                textValue = false;
        }

    }
    return textValue;
}
function checkDate (dateValue) {

    if (document.querySelector('#invalid_Alert_date')) {

            document.querySelector('#invalid_Alert_date').innerHTML = '';
    }
    var alertDate = document.querySelector('#invalid_Alert_date');

    var dateRegExp = /[0-1]{1}[0-9]{1}[-|\/]{1}[0-3]{1}[0-9]{1}[-|\/]{1}[1,2]{1}[9,0]{1}[0-9]{1}[0-9]{1}/;
    var isrTmpDate = getFinalDate(new Date(dateValue));
    var now = Date.parse(new Date());
    var futureDate = Date.parse(new Date(dateValue));
console.log(futureDate)

    if (!isrTmpDate || isrTmpDate === undefined ||(dateRegExp.test(isrTmpDate) === false) ) {
            var invalidDate =  document.createElement('bold');
                invalidDate.textContent = "*please insert a valid date";
                alertDate.append(invalidDate);
                isrTmpDate = false;
                console.log(isrTmpDate)
        } else if (futureDate < now) {
                var pastDate = document.createElement('bold');
                    pastDate.textContent = "*please insert a future date";
                    alertDate.append(pastDate);
                    isrTmpDate = false;
        }  
        return isrTmpDate;
}

function getFinalDate(formatDate) 
{ 
    var year = formatDate.getFullYear();
    var month = ("0" + (formatDate.getMonth() + 1)).slice(-2)
    var day = ('0' + formatDate.getDate()).slice(-2);
    var min = formatDate.getMinutes();
    var hour = formatDate.getHours();

    return (day + "/" + month + "/" + year + " " + hour + " : " + min);
};
