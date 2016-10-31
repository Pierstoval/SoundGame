<?php

namespace Orbitale\SoundGame;

use Orbitale\SoundGame\Event\EventHandler;
use Orbitale\SoundGame\Game\Game;
use Orbitale\SoundGame\Socket\WebSocket;
use React\EventLoop\Factory;

class Application
{
    const CROSSBAR_WEBSOCKET_PORT = 7777;
    const CROSSBAR_WEBSOCKET_PATH = 'Orbitale\SoundGame';
    const CROSSBAR_WEBSOCKET_HOST = '127.0.0.1';

    /**
     * @var Game[]
     */
    private $games = [];

    /**
     * @var WebSocket
     */
    private $webSocket;

    /**
     * @var EventHandler
     */
    private $eventManager;

    public function __construct($host)
    {
        $loop = Factory::create();
        $this->webSocket = new WebSocket($host, self::CROSSBAR_WEBSOCKET_PORT, self::CROSSBAR_WEBSOCKET_PATH, $loop);
        $this->eventManager = new EventHandler($this->webSocket, $this);
    }

    public function run()
    {
        $this->eventManager->start();
        $this->webSocket->start();
    }

    /**
     * @return Game[]
     */
    public function getGames(): array
    {
        return $this->games;
    }

    public function newGame()
    {
        $game = new Game();
    }
}
