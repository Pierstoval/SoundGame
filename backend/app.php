<?php

require_once __DIR__ . '/vendor/autoload.php';

use React\EventLoop\Factory;
use Orbitale\SoundGame\Game;

$loop = Factory::create();
$game = new Game($loop);
$game->run();
$loop->run();
