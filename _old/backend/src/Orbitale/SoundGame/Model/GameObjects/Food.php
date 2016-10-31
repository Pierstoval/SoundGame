<?php

namespace Orbitale\SoundGame\Model\GameObjects;

use Orbitale\SoundGame\Collision\AbstractCollisonable;
use Orbitale\SoundGame\Collision\CollisionableInterface;
use Orbitale\SoundGame\Geometry\Circle;
use Orbitale\SoundGame\Geometry\CircleList;

/**
 * This is the basic object that sits on the game area.
 * Its goal is to be picked by players.
 */
class Food extends AbstractCollisonable
{
    /**
     * @var Circle
     */
    public $circle;

    /**
     * @var int
     */
    public $value;

    /**
     * @var int
     */
    public $lifetime;

    /**
     * @var int
     */
    public $type;

    public function __construct(Circle $circle, $type = null, int $value = 1, $lifetime = 100)
    {
        $this->circle = $circle;
        $this->value = $value;
        $this->type = $type;
        $this->lifetime = $lifetime;
    }

    /**
     * {@inheritdoc}
     */
    public function getCircleList(): CircleList
    {
        return new CircleList([$this->circle]);
    }

    /**
     * {@inheritdoc}
     */
    public function collide(CollisionableInterface $target)
    {
        if (!$target instanceof Pick) {
            // Collides only with picks.
            return;
        }

        $target->player->score += $this->value;

        // Search food object in map.
        $foodIndex = array_search($this, $target->map->foods, true);

        // Remove food object from the map.
        unset($target->map->foods[$foodIndex]);
    }
}
