<!DOCTYPE html>
<html>
<head>
</head>

<body>
	<?php
	if(strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome'))
		include 'controller.php';
	else
		include '../only_chrome/index.php'
		?>
</body>

</html>