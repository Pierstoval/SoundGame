<?php

namespace Orbitale\SoundGame\Collision;

use Orbitale\SoundGame\Geometry\CircleList;

interface CollisionableInterface
{
    /**
     * @return CircleList
     */
    public function getCircleList(): CircleList;

    /**
     * @param CollisionableInterface $target
     */
    public function collide(CollisionableInterface $target);
}
