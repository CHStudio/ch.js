<!DOCTYPE html>
<!--[if IE 6]>
<html class="ie6" lang="fr-FR">
<![endif]-->
<!--[if IE 7]>
<html class="ie7" lang="fr-FR">
<![endif]-->
<!--[if IE 8]>
<html class="ie8" lang="fr-FR">
<![endif]-->
<!--[if IE 9]>
<html class="ie9" lang="fr-FR">
<![endif]-->
<!--[if IE 10]>
<html class="ie10" lang="fr-FR">
<![endif]-->
<!--[if !(IE 6) | !(IE 7) | !(IE 8) | !(IE 9) | !(IE 10) ]><!-->
<html lang="fr-FR">
<!--<![endif]-->
	<head>
		<meta charset="utf-8">
		
		<title>CH.js testing page</title>
		
		<meta name="description" content="">
		<meta name="Author" content="Stéphane HULARD <s.hulard@chstudio.fr>" />
		
		<!-- Define a viewport to mobile devices to use - telling the browser to assume that the page is as wide as the device (width=device-width) and setting the initial page zoom level to be 1 (initial-scale=1.0) -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<!-- Add normalize.css which enables browsers to render all elements more consistently and in line with modern standards as it only targets particular styles that need normalizing -->
		<link href="stylesheets/normalize.css" rel="stylesheet" media="all">
		
		<!-- Include the site stylesheet -->
		<link href="stylesheets/theme.css" rel="stylesheet" media="all">
		
		<!-- Include the HTML5 shiv print polyfill for Internet Explorer browsers 8 and below -->
		<!--[if lt IE 9]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js" media="all"></script><![endif]-->

		<link rel="shortcut icon" type="image/x-icon" href="/test/favicon.ico" />
	</head>
	<body>
		<div id="playground"></div>
		<!-- Defer script loading -->
		<script type="text/javascript" src="/src/base.js"></script>
		<?php if( isset( $_GET['test'] ) ): ?>
		<script type="text/javascript" src="/test/javascripts/<?php echo $_GET['test']; ?>.js"></script>
		<?php else: ?>
		<script type="text/javascript" src="/test/javascripts/main.js"></script>
		<?php endif; ?>
	</body>
</html>