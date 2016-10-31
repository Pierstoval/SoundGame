<?php

namespace Orbitale\SoundGame\Event;

final class Events
{
    /**
     * Internal event representing the tick action.
     * Should send an "outgoing tick" via the websocket.
     */
    const INTERNAL_TICK = 'event_tick';

    /**
     * This represent an internal collision.
     * It is sent to webserver via websocket
     */
    const INTERNAL_COLLISION = 'event_collision';

    /**
     * Outgoing tick to the websocket & front application.
     * Should be handled in Javascript with the same name.
     */
    const OUTGOING_TICK = 'tick';

    /**
     * Mostly a "keydown" or "keyup" action.
     */
    const INCOMING_ACTION = 'action';

    /**
     * When a user enters the game, it sends this event via websocket.
     */
    const INCOMING_JOIN = 'join';
}
