<?php

namespace Orbitale\SoundGame\Event;

use Orbitale\SoundGame\Application;
use Orbitale\SoundGame\Game\Game;
use Orbitale\SoundGame\Serializer;
use Orbitale\SoundGame\Socket\WebSocket;
use Thruway\ClientSession;

class EventHandler
{

    /**
     * @var WebSocket
     */
    private $webSocket;

    /**
     * @var Game
     */
    private $game;

    /**
     * @var array
     */
    private $eventQueue = [];

    public function __construct(WebSocket $webSocket, Application $application)
    {
        $this->webSocket = $webSocket;
        $this->game = $application;
    }

    public function start()
    {
        $this->listenIncomingMessages();
        $this->broadcastTick();
        $this->listenForNewPlayers();
    }

    /**
     * @param Event $event
     */
    public function addEvent(Event $event)
    {
        $this->eventQueue[] = $event;
    }

    /**
     * Handles the "INCOMING_ACTION" event from browser.
     */
    private function listenIncomingMessages()
    {
        $game = $this->game;
        $eventManager = $this;

        $this->webSocket->promiseSession()->then(function (ClientSession $session) use ($game, $eventManager) {
            $session->subscribe(Events::INCOMING_ACTION, function ($_, $args) use ($game, $eventManager) {
                if (!isset($args->playerName)) {
                    return;
                }

                $eventManager->addEvent(new Event($game->getPlayerByName($args->playerName), $args->direction, $args->pressed));
            });
        });
    }

    /**
     * Sends the "TICK" event to the browser.
     */
    private function broadcastTick()
    {
        $game = $this->game;

        $game->on(Events::INTERNAL_TICK, function () use ($game) {
            $data = Serializer::serializeGame($game);
            if ($session = $this->webSocket->getSession()) {
                $session->publish(Events::OUTGOING_TICK, null, $data);
            }
        });
    }

    /**
     * Handles the "JOIN" event received from browser.
     */
    private function listenForNewPlayers()
    {
        $game = $this->game;

        $this->webSocket->promiseSession()->then(function (ClientSession $session) use ($game) {
            $session->subscribe(Events::INCOMING_JOIN, function($_, $args) use ($game) {
                if (!isset($args->playerName) || strlen($args->playerName) < 3) {
                    return;
                }

                $game->initializePlayer($args->playerName);
            });
        });
    }
}
