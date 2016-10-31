<?php

namespace Orbitale\SoundGame\Collision;

use Orbitale\SoundGame\Geometry\CircleList;

interface CollisionableInterface
{
    /**
     * Any collisionnable object needs a CircleList.
     * Having more complex hitboxes is heavy in terms of memory,
     *  so we allow "large" collisions between Circle objects via the CircleList array.
     *
     * @return CircleList
     */
    public function getCircleList(): CircleList;

    /**
     * @param CollisionableInterface $target
     */
    public function collide(CollisionableInterface $target);
}
