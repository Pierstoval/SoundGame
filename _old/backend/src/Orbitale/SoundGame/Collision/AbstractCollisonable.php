<?php

namespace Orbitale\SoundGame\Collision;

abstract class AbstractCollisonable implements CollisionableInterface
{
    public function collide(CollisionableInterface $target)
    {
        // By default, do nothing.
    }
}
