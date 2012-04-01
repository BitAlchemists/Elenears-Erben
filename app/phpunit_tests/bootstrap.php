<?php

require_once __DIR__ . '/SplClassLoader.php';

$classLoaderUnittests = new SplClassLoader('app/phpunit/tests/integration', __DIR__ . '/integration' );
$classLoaderUnittests->register();

require_once __DIR__ . '/../config/bootstrap.php';

