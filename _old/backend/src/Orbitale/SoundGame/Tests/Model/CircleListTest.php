<?php

namespace Orbitale\SoundGame\Tests\Model;

use PHPUnit\Framework\TestCase;
use Orbitale\SoundGame\Geometry\Circle;
use Orbitale\SoundGame\Geometry\CircleList;
use Orbitale\SoundGame\Geometry\Point;

class CircleListTest extends TestCase
{
    /**
     * @expectedException \InvalidArgumentException
     * @expectedExceptionMessage Objects added in circle list must extend Circle, "stdClass" given.
     */
    public function test circle list constructor accepts only circle objects()
    {
        new CircleList([new \stdClass()]);
    }

    /**
     * @expectedException \InvalidArgumentException
     * @expectedExceptionMessage Objects added in circle list must extend Circle, "stdClass" given.
     */
    public function test circle list add accepts only circle objects()
    {
        $circleList = new CircleList();

        $circleList[] = new \stdClass();
    }

    public function test non existing returns null()
    {
        $circleList = new CircleList();

        static::assertNull($circleList['unexisting_key']);
    }

    public function test it accepts specified keys()
    {
        $circleList = new CircleList();

        $circle = new Circle(new Point(0, 0));

        $circleList['key'] = $circle;

        static::assertEquals($circle, $circleList['key']);
    }
}
