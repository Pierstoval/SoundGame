<?php

namespace Orbitale\SoundGame\Tests\Model;

use PHPUnit\Framework\TestCase;
use Orbitale\SoundGame\Model\Player;
use Orbitale\SoundGame\Geometry\Circle;
use Orbitale\SoundGame\Geometry\Point;
use Orbitale\SoundGame\Model\GameObjects\Food;
use Orbitale\SoundGame\Model\Map;
use Orbitale\SoundGame\Model\GameObjects\Pick;

class FoodTest extends TestCase
{
    public function test picking food()
    {
        $map = new Map();

        $food = new Food(new Circle(new Point(0, 0)));
        $map->foods[] = $food;

        $pick = new Pick($map, new Player($map));
        $pick->length = 1;

        $food->collide($pick);

        static::assertEmpty($map->foods);
        static::assertEquals(6, $pick->length);
    }
}
