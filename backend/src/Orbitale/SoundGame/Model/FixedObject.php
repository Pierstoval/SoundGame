<?php

namespace Orbitale\SoundGame\Model;

use Orbitale\SoundGame\Collision\AbstractCollisonable;
use Orbitale\SoundGame\Geometry\Circle;
use Orbitale\SoundGame\Geometry\CircleList;

class FixedObject extends AbstractCollisonable
{
    /**
     * @var CircleList
     */
    public $circle;

    public function __construct(Circle $circle)
    {
        $this->circle = $circle;
    }

    /**
     * {@inheritdoc}
     */
    public function getCircleList(): CircleList
    {
        return new CircleList([$this->circle]);
    }

}
