<?php

namespace Orbitale\SoundGame\Model;

use Orbitale\SoundGame\Collision\CollisionableInterface;

interface PickableInterface extends CollisionableInterface
{
    /**
     * @param Pick $pick
     *
     * @return void
     */
    public function onPick(Pick $pick);
}
