<?php

namespace Orbitale\SoundGame\Geometry;

class Rectangle
{
    /**
     * @var int
     */
    public $x;

    /**
     * @var int
     */
    public $y;

    /**
     * @var int
     */
    public $width;

    /**
     * @var int
     */
    public $height;

    /**
     * @param int $x
     * @param int $y
     * @param int $width
     * @param int $height
     */
    public function __construct(int $x, int $y, int $width, int $height)
    {
        $this->x = $x;
        $this->y = $y;
        $this->width = $width;
        $this->height = $height;
    }

    /**
     * Intrinsically creates a larger hitbox.
     *
     * @param Circle $circle
     *
     * @return Rectangle
     */
    public static function createFromCircle(Circle $circle): Rectangle
    {
        return new self(
            $circle->getCenterPoint()->getX() - $circle->getRadius(),
            $circle->getCenterPoint()->getY() - $circle->getRadius(),
            $circle->getRadius() * 2,
            $circle->getRadius() * 2
        );
    }
}
