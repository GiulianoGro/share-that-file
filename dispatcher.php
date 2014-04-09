<?php
$mysqli = new mysqli('173.194.87.61', 'root', 'sharethatfile', 'shareThatFile');
$mysqli->set_charset("utf8");

// getallheaders polyfill
if (!function_exists('getallheaders')){ 
  function getallheaders(){ 
    $headers = ''; 
    foreach ($_SERVER as $name => $value){ 
      if (substr($name, 0, 5) == 'HTTP_'){ 
        $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value; 
      } 
    }
    return $headers; 
  } 
} 

if($_POST['action'] == 'postAction'){
  $from = $mysqli->real_escape_string($_POST['sender']);
  $message = $mysqli->real_escape_string($_POST['message']);
  $event = $mysqli->real_escape_string($_POST['event']);
  $receiver =  $mysqli->real_escape_string($_POST['receiver']);
  $mysqli->query("INSERT INTO messages (sender,receiver,type,message,expire) VALUES ('$from','$receiver','$event','$message', DATE_ADD(NOW(), INTERVAL 10 MINUTE))");
  exit();
} elseif($_GET['action'] == 'eventsPing') {
  $all_headers = getallheaders();
  $last_event_id = $mysqli->real_escape_string($all_headers['Last-Event-ID']);
  $asker = $mysqli->real_escape_string($_GET['asker']);
  if($result = $mysqli->query("SELECT * FROM messages WHERE sender != '$asker' AND (receiver = '*' OR receiver = '$asker') AND expire >= NOW() " . ($last_event_id ? " AND id > $last_event_id" : ""))){
    header("Content-Type: text/event-stream\n\n");
    while($message = $result->fetch_object()){ 
      echo "event: " . $message->type . "\n";
      echo "id:" . $message->id . "\n";
      echo "data: " . $message->message;
      echo "\n\n";
    }
  }
  exit();
}
?>