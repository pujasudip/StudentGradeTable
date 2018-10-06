/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);
var student_arrayFromServer = [];
var stagedToBeDeleted = '';
var editEntryIndex = '';
var currentPage = 1;

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp() {
    addClickHandlersToElements();
    getDataFromServer();

    $('.studentInfoAdd').on('input', handleStudentAddForm);
    $('.editStudentInfo').on('input', handleStudentEditForm);
}

function handleStudentAddForm(){
    var inputType = $(this).attr('name');

    if(inputType === 'studentName'){
        if($(this).val().length > 1){
            $('.nameError').text('');
            $('#studentName').removeClass('inputError');
        }
    }
    if(inputType === 'course'){
        if($(this).val().length > 1){
            $('.courseError').text('');
            $('#course').removeClass('inputError');
        }
    }
    if(inputType === 'studentGrade'){
        if(!isNaN($(this).val())){
            $('.gradeError').text('');
            $('#studentGrade').removeClass('inputError');
        }
    }
}

function handleStudentEditForm(){
    var inputType = $(this).attr('name');

    if(inputType === 'studentName'){
        if($(this).val().length > 1){
            $('.nameEditError').text('');
            $('#nameEdit').removeClass('inputError');
        }
    }
    if(inputType === 'course'){
        if($(this).val().length > 1){
            $('.courseEditError').text('');
            $('#courseEdit').removeClass('inputError');
        }
    }
    if(inputType === 'studentGrade'){
        if(!isNaN($(this).val())){
            $('.gradeEditError').text('');
            $('#gradeEdit').removeClass('inputError');
        }
    }
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined}
* @returns  {undefined}
*
*/
function addClickHandlersToElements(){
    $('tbody').on('click', '#delete', confirmDeleteModal);
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

function confirmDeleteModal(){
    var row = $(this);
    var id =  row.parent().parent().attr('id');
    var firstTd = row.parent().parent().find('td')[0];
    stagedToBeDeleted = $(firstTd).text();
    $('#nameConfirm').text(stagedToBeDeleted);
    $('#deleteConfirm').modal('show');
    $('#confirmDelete').click(function(){
        deleteStudent(id);
    });
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
    var validData = true;

    if(studentName.val().length < 2) {
        validData = false;
        $('.nameError').text('Name should be at least two character.');
        $('#studentName').addClass('inputError');
    }
    if(course.val().length < 2){
        validData = false;
        $('.courseError').text('Course should be at least two character.');
        $('#course').addClass('inputError');
    }
    if(studentGrade.val() === ''){
        validData = false;
        $('.gradeError').text('Invalid grade');
        $('#studentGrade').addClass('inputError');
    } else if(studentGrade.val() > 100 || studentGrade.val() < 0){
        validData = false;
        $('.gradeError').text('Grade out of range');
        $('#studentGrade').addClass('inputError');
    } else if(isNaN(studentGrade.val())){
        validData = false;
        $('.gradeError').text('Grade should be a number');
        $('#studentGrade').addClass('inputError');
    }

    var studentInfo = {
        id: '',
        name: studentName.val(),
        course: course.val(),
        grade: parseInt(studentGrade.val())
    };
    if(validData){
        clearAddStudentFormInputs();
        pushDataToServer(studentInfo);
        // updateStudentList(studentInfo);
        $('*').click(function(){
            $('input').removeClass('inputError');
            $('.invalidInput').css('visibility', 'hidden');
        })
    }
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
    $("input[name='studentName']").val('');
    $("#course").val('');
    $("input[name='studentGrade']").val('');
    $('.nameError').text('');
    $('.courseError').text('');
    $('.gradeError').text('');
    $('#studentName').removeClass('inputError');
    $('#course').removeClass('inputError');
    $('#studentGrade').removeClass('inputError');
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentIndividual){
    var tableBody = $('tbody');
    var tableRow = $('<tr>').attr('id', studentIndividual.id);
    tableBody.append(tableRow);
    tableRow.append(`<td> ${studentIndividual.name}</td>`);
    tableRow.append(`<td> ${studentIndividual.course}</td>`);
    tableRow.append(`<td> ${studentIndividual.grade}</td>`);
    tableRow.append(`<td class="text-center"><button id="delete" class="btn btn-danger studentDelete opBtn"><span class="visible-lg visible-md visible-sm">Delete</span><i class="fa fa-trash-o visible-xs"></i></button>
                         <button id="edit" class="btn btn-warning opBtn" data-toggle="modal" data-target="#editEntry"><span class="visible-lg visible-md visible-sm">Edit</span><i class="fa fa-edit visible-xs"></i></button></td>`);
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
        sum += parseInt(student_arrayFromServer[studentIndex].grade);
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

function deleteStudent(id){
    deleteDataFromServer(id);
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
    };

    $.ajax(lfzAPICall);
}

function studentInfoFromServerSuccess(studentInfo){
    student_arrayFromServer = studentInfo.data;
    for(var serverStIndex = 0; serverStIndex < student_arrayFromServer.length; serverStIndex++){
        renderStudentOnDom(student_arrayFromServer[serverStIndex]);
    }
    renderGradeAverage(calculateGradeAverage());
}

function failedToRetrieve(){
    $('#errorModal').modal('show');
}

function pushDataToServer(studentInfo){
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
        method: 'POST',
        success: function(response){
            if(response.success){
                $('tbody.studentInfo').empty();
                getDataFromServer();
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

function failedToPush(){
    console.log('failed to push');
}

function deleteDataFromServer(idOfStudent){
    let data = {
        api_key: 'odvQ9PAoKc',
        student_id: idOfStudent
    };
    var lfzAPICall = {
        data: data,
        dataType: 'json',
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
        $('tbody.studentInfo').empty();
        getDataFromServer();
    }
}

function failedDeletionProcess(){
    $('#tryDeletion').text(stagedToBeDeleted);
    $('#deleteFailed').modal('show');
}

function entryToBeEdited(){
    editEntryIndex = $(this).parent().parent().index();
    var oneStudent = student_arrayFromServer[editEntryIndex];
    $('#nameEdit').val(oneStudent.name);
    $('#courseEdit').val(oneStudent.course);
    $('#gradeEdit').val(oneStudent.grade);
}

function editStudentInfo(){
    var nameEdit = $('#nameEdit').val();
    var courseEdit = $('#courseEdit').val();
    var gradeEdit = parseInt($('#gradeEdit').val());
    var validData = true;

    if(nameEdit.length < 2) {
        validData = false;
        $('.nameEditError').text('Name should be at least two characters.');
        $('#nameEdit').addClass('inputError');
    }
    if(courseEdit.length < 2){
        validData = false;
        $('.courseEditError').text('Course should be at least two characters.');
        $('#courseEdit').addClass('inputError');
    }
    if(gradeEdit === ''){
        validData = false;
        $('.gradeEditError').text('Invalid grade');
        $('#gradeEdit').addClass('inputError');
    } else if(gradeEdit > 100 || gradeEdit < 0){
        validData = false;
        $('.gradeEditError').text('Grade out of range');
        $('#gradeEdit').addClass('inputError');
    } else if(isNaN(gradeEdit)){
        validData = false;
        $('.gradeEditError').text('Grade should be a number');
        $('#gradeEdit').addClass('inputError');
    }

    var editedStudent = {
        name: nameEdit,
        course: courseEdit,
        grade: gradeEdit
    }

    if(validData){
        $('#editEntry').modal('hide');
        var editedStudentId = student_arrayFromServer[editEntryIndex].id;
        editInfoOnServer(editedStudent, editedStudentId);
    }
}

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
        success: function(response){
            if(response.success){
                $('tbody.studentInfo').empty();
                getDataFromServer();
            }
        },
        error: function(){
            console.log('Error');
        },
    };

    $.ajax(lfzAPICall);
}