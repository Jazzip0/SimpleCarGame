<!DOCTYPE html>
<html>
<head>
</head>

<body>
	<?php
	if(strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome'))
		include 'game.php';
	else
		include '../only_chrome/index.php'
		?>
</body>

</html>