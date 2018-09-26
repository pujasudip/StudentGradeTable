<?php

require_once('endpointCredential.php');

if($_SERVER['REQUEST_METHOD'] === 'GET'){
    $query = "SELECT * FROM `students`";

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
    $course = $_POST['course'];
    $grade = $_POST['grade'];

    $query = "INSERT INTO `students`(`name`, `course`, `grade`) VALUES('$name', '$course', $grade)";

    $result = mysqli_query($conn, $query);

    $rowAffected = mysqli_affected_rows($conn);

    $output = [
        'success'=>false,
    ];

    if($rowAffected > 0){
       $output['success'] = true;
    }

    $json_output = json_encode($output);

//    print_r($rowAffected);
    print_r($_POST);
}

if($_SERVER['REQUEST_METHOD'] === 'DELETE'){
    $queryString = $_SERVER["QUERY_STRING"];
    $id = preg_replace('/\D/', '', $queryString);

    $query = "DELETE FROM `students` WHERE id=$id";

    $result = mysqli_query($conn, $query);

    $rowAffected = mysqli_affected_rows($conn);

    $output = [
        'success'=>false,
    ];

    if($rowAffected > 0){
        $output['success'] = true;
    }

    $json_output = json_encode($output);
}

if($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'update'){
    $id = $_POST['student_id'];
    $name = $_POST['name'];
    $course = $_POST['course'];
    $grade = $_POST['grade'];

    $query = "UPDATE `students` SET `name`='$name', `course`='$course', `grade`='$grade' WHERE `id`=$id";

    $result = mysqli_query($conn, $query);

    $rowAffected = mysqli_affected_rows($conn);

    $output = [
        'success'=>false,
    ];

    if($rowAffected > 0){
        $output['success'] = true;
    }

    $json_output = json_encode($output);
}

?>