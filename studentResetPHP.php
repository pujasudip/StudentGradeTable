<?php
/**
 * Created by IntelliJ IDEA.
 * User: pujasudip
 * Date: 10/26/18
 * Time: 3:29 PM
 */
$resetfile = file_get_contents('studentResetSQL.sql');
require_once('endpointCredential.php');

mysqli_multi_query($conn, $resetfile);