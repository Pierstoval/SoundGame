<?php

namespace Orbitale\SoundGame\Geometry;

class Circle
{
    /**
     * @var Point
     */
    private $centerPoint;

    /**
     * @var int
     */
    private $radius;

    /**
     * @param Point $centerPoint
     * @param int $radius
     */
    public function __construct(Point $centerPoint, int $radius = 10)
    {
        $this->centerPoint = $centerPoint;
        $this->radius = $radius;
    }

    /**
     * @return Point
     */
    public function getCenterPoint(): Point
    {
        return $this->centerPoint;
    }

    /**
     * @return int
     */
    public function getRadius(): int
    {
        return $this->radius;
    }
}
