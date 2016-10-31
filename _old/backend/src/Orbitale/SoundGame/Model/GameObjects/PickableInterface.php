<?php

namespace Orbitale\SoundGame\Model\GameObjects;

use Orbitale\SoundGame\Collision\CollisionableInterface;
use Orbitale\SoundGame\Model\GameObjects\Pick;

interface PickableInterface extends CollisionableInterface
{
    /**
     * @param Pick $pick
     *
     * @return void
     */
    public function onPick(Pick $pick);
}
