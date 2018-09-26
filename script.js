/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */

var student_arrayFromServer = [];
var stagedToBeDeletedIndex = '';
var editEntryIndex = '';
var my_array = [];
var currentPage = 1;
if(localStorage.localArray.length === 0){
    localStorage.setItem('localArray', JSON.stringify(my_array));
}


/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp() {
    addClickHandlersToElements();
    getDataFromServer();
    $('.btn').on('click', function () {
        var $this = $(this);
        $this.button('loading');
        setTimeout(function () {
            $this.button('reset');
        }, 1000);
    });
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined}
* @returns  {undefined}
*
*/
function addClickHandlersToElements(){
    $('tbody').on('click', '#delete', deleteStudent);
    $('tbody').on('click', '#edit', entryToBeEdited);
    $('#save').click(editStudentInfo);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return:
       none
 */
function handleAddClicked(){
    addStudent();
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
    clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent(){
    var studentName = $("input[name='studentName']");
    var course = $("#course");
    var studentGrade = $("input[name='studentGrade']");
    var studentInfo = {
        id: '',
        name: studentName.val(),
        course: course.val(),
        grade: parseInt(studentGrade.val())
    };
    pushDataToServer(studentInfo);
    clearAddStudentFormInputs();
    updateStudentList(studentInfo);
    $('*').click(function(){
        $('input').removeClass('inputError');
        $('.invalidInput').css('visibility', 'hidden');
    })
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
    $("input[name='studentName']").val('');
    $("#course").val('');
    $("input[name='studentGrade']").val('');
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentIndividual){
    var tableBody = $('tbody');
    var tableRow = $('<tr>');
    tableBody.append(tableRow);
    tableRow.append(`<td contenteditable> ${studentIndividual.name}</td>`);
    tableRow.append(`<td contenteditable> ${studentIndividual.course}</td>`);
    tableRow.append(`<td contenteditable> ${studentIndividual.grade}</td>`);
    tableRow.append(`<td><button id="delete" class="btn btn-danger studentDelete">Delete</button></td>`)
    tableRow.append(`<td><button id="edit" class="btn btn-warning" data-toggle="modal" data-target="#editEntry">Edit</button></td>`);
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(singleStudent){
    renderStudentOnDom(singleStudent);
    var studentAvg = calculateGradeAverage();
    renderGradeAverage(studentAvg);
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(){
    var sum = 0;
    for(var studentIndex = 0; studentIndex < student_arrayFromServer.length; studentIndex++){
        sum += student_arrayFromServer[studentIndex].grade;
    }
    var average = (sum/student_arrayFromServer.length).toFixed(2);
    return average;
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(average){
    $('.avgGrade').text(average);
}

function deleteStudent(){
    var studentIndex = $(this).parent().parent().index();
    stagedToBeDeletedIndex = studentIndex;
    var studentID = student_arrayFromServer[studentIndex].id;
    deleteDataFromServer(studentID);
}

function getDataFromServer(){
    var API_KEY = {'api_key': 'practice001'};
    var lfzAPICall = {
        data: API_KEY,
        dataType: 'json',
        url: "dataEndpoint.php",
        // url: "http://s-apis.learningfuze.com/sgt/adfasdfdsaf",
        method: 'GET',
        success: studentInfoFromServerSuccess,
        error: failedToRetrieve,
    }

    $.ajax(lfzAPICall);
}

function studentInfoFromServerSuccess(studentInfo){
    student_arrayFromServer = studentInfo.data;
    console.log('successfully retrieved');
    console.log('test:', student_arrayFromServer);
    for(var serverStIndex = 0; serverStIndex < student_arrayFromServer.length; serverStIndex++){
        renderStudentOnDom(student_arrayFromServer[serverStIndex]);
    }
    renderGradeAverage(calculateGradeAverage());
    deleteButtonModify();
}

function failedToRetrieve(){
    $('#errorModal').modal('show');
}

function pushDataToServer(studentInfo){
    debugger;
    var lfzAPICall = {
        data: {
            action: 'enter',
            api_key: 'odvQ9PAoKc',
            name: studentInfo.name,
            grade: studentInfo.grade,
            course: studentInfo.course
        },
        dataType: 'json',
        url: "dataEndpoint.php",
        // url: "http://s-apis.learningfuze.com/sgt/adfasdfdsaf",
        method: 'POST',
        success: function(response){
            if(response.success){
                console.log('pushing successful', response);
                studentInfo.id = response.new_id;
                console.log('id: ', response.new_id);
                student_arrayFromServer.push(studentInfo);
                my_array = JSON.parse(localStorage.getItem('localArray'));
                my_array.push(studentInfo);
                localStorage.setItem('localArray', JSON.stringify(my_array));
                deleteButtonModify();
                renderGradeAverage(calculateGradeAverage());
            } else {
                $('#studentName').addClass('inputError');
                $('#course').addClass('inputError');
                $('#studentGrade').addClass('inputError');
                $('.invalidInput').css('visibility', 'visible');
            }
        },
        error: failedToPush,
    }

    $.ajax(lfzAPICall);
}

// function pushToServerSuccess(response){
//     console.log('pushing successful', response);
//     my_student_array.push();
// }

function failedToPush(){
    console.log('failed to push');
}

function deleteDataFromServer(idOfStudent){
    console.log('student length: ', student_arrayFromServer.length);
    console.log('id to be deleted: ', idOfStudent);
    let data = {
        api_key: 'odvQ9PAoKc',
        student_id: idOfStudent
    };
    var lfzAPICall = {
        data: data,
        dataType: 'json',
        // url: "http://s-apis.learningfuze.com/sgt/delete",
        // url: "http://s-apis.learningfuze.com/sgt/adfasdfdsaf",
        url: "dataEndpoint.php?id=" + data['student_id'],
        method: 'DELETE',
        success: deleteFromServerSuccess,
        error: failedDeletionProcess,
    }

    $.ajax(lfzAPICall);
}

function deleteFromServerSuccess(response){
    if(response.success){
        $('.toastMessage').fadeIn(200).delay(2000).fadeOut(200);
        $('.studentInfo > tr').eq(stagedToBeDeletedIndex).remove();
        student_arrayFromServer.splice(stagedToBeDeletedIndex, 1);
        renderGradeAverage(calculateGradeAverage());

    } else {
        console.log('deletion unsuccessful');
        var studentTried = student_arrayFromServer[stagedToBeDeletedIndex].name;
        $('#tryDeletion').text(studentTried);
        $('#deleteFailed').modal('show');
    }
}

function failedDeletionProcess(){
    console.log('deletion failed');
}

function entryToBeEdited(){
    editEntryIndex = $(this).parent().parent().index();
    var oneStudent = student_arrayFromServer[editEntryIndex]
    $('#nameEdit').val(oneStudent.name);
    $('#courseEdit').val(oneStudent.course);
    $('#gradeEdit').val(oneStudent.grade);
}

function editStudentInfo(){
    var nameEdit = $('#nameEdit').val();
    var courseEdit = $('#courseEdit').val();
    var gradeEdit = $('#gradeEdit').val();

    var editedStudent = {
        name: nameEdit,
        course: courseEdit,
        grade: gradeEdit
    }

    var editedStudentId = student_arrayFromServer[editEntryIndex].id;
    editInfoOnServer(editedStudent, editedStudentId)

}

// entry point is not available in the server
// so I just did manipulation with the DOM.
function editInfoOnServer(individualStudent, id){
    console.log(id);
    var lfzAPICall = {
        data: {
            action: 'update',
            api_key: 'odvQ9PAoKc',
            student_id: id,
            name: individualStudent.name,
            grade: individualStudent.grade,
            course: individualStudent.course
        },
        dataType: 'json',
        // url: "http://s-apis.learningfuze.com/sgt/edit",
        // url: "http://s-apis.learningfuze.com/sgt/adfasdfdsaf",
        url: 'dataEndpoint.php',
        method: 'POST',
        success: editOnServerSuccess(),
        error: function(){
            student_arrayFromServer[editEntryIndex] = individualStudent;
            var rowHTML = $('<tr>');
            rowHTML.append(`<td contenteditable> ${individualStudent.name}</td>`);
            rowHTML.append(`<td contenteditable> ${individualStudent.course}</td>`);
            rowHTML.append(`<td contenteditable> ${individualStudent.grade}</td>`);
            rowHTML.append(`<td><button id="delete" class="btn btn-danger studentDelete">Delete</button></td>`)
            rowHTML.append(`<td><button id="edit" class="btn btn-warning" data-toggle="modal" data-target="#editEntry">Edit</button></td>`);
            $('tbody > tr').eq(editEntryIndex).replaceWith(rowHTML);
        },
    }

    $.ajax(lfzAPICall);
}

function editOnServerSuccess(){
    console.log('edit successful');
}

function deleteButtonModify(){
    var filterStudentMy = JSON.parse(localStorage.getItem('localArray'));
    var localKeys = [];
    var serverKeys = [];

    if(filterStudentMy.length !== 0){
        for(var localIndex = 0; localIndex < filterStudentMy.length; localIndex++){
            var keyL = filterStudentMy[localIndex].id;
            localKeys.push(keyL);
        }
    }

    for(var serverIndex = 0; serverIndex < student_arrayFromServer.length; serverIndex++){
        var keyS = student_arrayFromServer[serverIndex].id;
        serverKeys.push(keyS);
    }

    var allTableRows = $('tbody > tr');

    for(var rowIndex = 0; rowIndex < allTableRows.length; rowIndex++) {
        var id = student_arrayFromServer[rowIndex].id;
        if (localKeys.includes(id)) {
            allTableRows.eq(rowIndex).css('background-color', 'green');
        }
    }
}