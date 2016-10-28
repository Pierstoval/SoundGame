<?php

use Orbitale\SoundGame\Logger\MutedLogger;
use Thruway\Logging\Logger as ThruLogger;

require_once __DIR__ . '/vendor/autoload.php';

if (in_array('--mute', $argv, true)) {
    ThruLogger::set(new MutedLogger());
}

use Orbitale\SoundGame\Application;

$app = new Application();
