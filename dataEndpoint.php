<?php

require_once('endpointCredential.php');

session_start();
$session_id = session_id();

if($_SERVER['REQUEST_METHOD'] === 'GET'){
    $query = "SELECT * FROM `gradetable`";

    $result = mysqli_query($conn, $query);

    $rowNum = mysqli_num_rows($result);

    $output = [
        'success'=>false,
        'data'=> [],
    ];

    if($rowNum > 0){
        while($row = mysqli_fetch_assoc($result)){
            $output['success'] = true;
            $output['data'][] = $row;
        }
    }

    $json_output = json_encode($output);

    print_r($json_output);
}

if($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'enter'){
    $name = $_POST['name'];
    $course = ($_POST['course']);
    $grade = $_POST['grade'];

    //sql sanitization
    $name = mysqli_real_escape_string($conn, $name);
    $course = mysqli_real_escape_string($conn, $course);
    $grade = mysqli_real_escape_string($conn, $grade);

    //html sanitization
    $name = htmlentities($name);
    $course = htmlentities($course);
    $grade = htmlentities($grade);
    $timeAccessed =

    $query = "INSERT INTO `gradetable`(`name`, `course`, `grade`) VALUES('$name', '$course', $grade)";

    $result = mysqli_query($conn, $query);

    $rowAffected = mysqli_affected_rows($conn);

    $output = [
        'success'=>false,
    ];

    if($rowAffected > 0){
       $output['success'] = true;
       $queryStuId = "SELECT id FROM `gradetable` WHERE name='$name' AND course='$course' AND grade=$grade";
       $stuIdResult = mysqli_query($conn, $queryStuId);

       $stuIdRow = mysqli_affected_rows($conn);

       $stuId = [];

       if($stuIdRow > 0){
           while($rowId = mysqli_fetch_assoc($stuIdResult)){
               $stuId[] = $rowId;
           }
           $stuId = json_encode($stuId[0]['id']);
       }
       $querySession = "INSERT INTO `student_session`(`student_id`, `session_id`, `last_accessed`, `action_done`) VALUES($stuId, '$session_id', CURRENT_TIMESTAMP, 'add')";
       mysqli_query($conn, $querySession);
    }

    $json_output = json_encode($output);

    print($json_output);
}

if($_SERVER['REQUEST_METHOD'] === 'DELETE'){
    $queryString = $_SERVER["QUERY_STRING"];
    $id = preg_replace('/\D/', '', $queryString);

    //sql sanitization
    $id = mysqli_real_escape_string($conn, $id);

    //html sanitization
    $id = htmlentities($id);

    $query = "DELETE FROM `gradetable` WHERE id=$id";

    $result = mysqli_query($conn, $query);

    $rowAffected = mysqli_affected_rows($conn);

    $output = [
        'success'=>false,
    ];

    if($rowAffected > 0){
        $output['success'] = true;
        $querySession = "INSERT INTO `student_session`(`student_id`, `session_id`, `last_accessed`, `action_done`) VALUES($id, '$session_id', CURRENT_TIMESTAMP, 'delete')";
        mysqli_query($conn, $querySession);
    }

    $json_output = json_encode($output);

    print($json_output);
}

if($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'update'){
    $id = $_POST['student_id'];
    $name = $_POST['name'];
    $course = $_POST['course'];
    $grade = $_POST['grade'];

    //sql sanitization
    $id = mysqli_real_escape_string($conn, $id);
    $name = mysqli_real_escape_string($conn, $name);
    $course = mysqli_real_escape_string($conn, $course);
    $grade = mysqli_real_escape_string($conn, $grade);

    //html sanitization
    $id = htmlentities($id);
    $name = htmlentities($name);
    $course = htmlentities($course);
    $grade = htmlentities($grade);

    $query = "UPDATE `gradetable` SET `name`='$name', `course`='$course', `grade`='$grade' WHERE `id`=$id";

    $result = mysqli_query($conn, $query);

    $rowAffected = mysqli_affected_rows($conn);

    $output = [
        'success'=>false,
    ];

    if($rowAffected > 0){
        $output['success'] = true;
        $querySession = "INSERT INTO `student_session`(`student_id`, `session_id`, `last_accessed`, `action_done`) VALUES($id, '$session_id', CURRENT_TIMESTAMP, 'edit')";
        mysqli_query($conn, $querySession);
    }

    $json_output = json_encode($output);
    print($json_output);
}

?>