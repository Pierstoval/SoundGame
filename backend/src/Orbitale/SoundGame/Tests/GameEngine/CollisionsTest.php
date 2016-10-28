<?php

namespace Orbitale\SoundGame\Tests\GameEngine;

use PHPUnit\Framework\TestCase;
use Orbitale\SoundGame\Model\Player;
use Orbitale\SoundGame\Geometry\Circle;
use Orbitale\SoundGame\Geometry\Point;
use Orbitale\SoundGame\Math\CollisionsManager;
use Orbitale\SoundGame\Model\FixedObject;
use Orbitale\SoundGame\Model\Food;
use Orbitale\SoundGame\Model\Map;
use Orbitale\SoundGame\Model\Pick;

class CollisionsTest extends TestCase
{
    public function test two distants circles dont collide()
    {
        $circleA = new Circle(new Point(0, 0));
        $circleB = new Circle(new Point(100, 100));

        static::assertFalse(CollisionsManager::testCirclesCollision($circleA, $circleB));
    }

    public function test two near circles do collide()
    {
        $circleA = new Circle(new Point(0, 0));
        $circleB = new Circle(new Point(12, 12));

        static::assertTrue(CollisionsManager::testCirclesCollision($circleA, $circleB));
    }

    public function test pick and far food dont collide()
    {
        $map = new Map();
        $pick = new Pick($map, new Player($map));
        $pick->appendBodyPart(new Circle(new Point(0, 0), 5));
        $pick->appendBodyPart(new Circle(new Point(-4, -4), 5));

        $food = new Food(new Circle(new Point(20, 20), 10));

        static::assertFalse(CollisionsManager::testCollisionablesCollision($pick, $food));
    }

    public function test pick and near food do collide()
    {
        $map = new Map();
        $pick = new Pick($map, new Player($map));
        $pick->appendBodyPart(new Circle(new Point(0, 0), 5));
        $pick->appendBodyPart(new Circle(new Point(-4, -4), 5));

        $food = new Food(new Circle(new Point(6, 6), 10));

        static::assertTrue(CollisionsManager::testCollisionablesCollision($pick, $food));
    }

    public function test pick and fixed object do collide()
    {
        $map = new Map();
        $pick = new Pick($map, new Player($map));
        $pick->appendBodyPart(new Circle(new Point(0, 0), 5));
        $pick->appendBodyPart(new Circle(new Point(-4, -4), 5));

        $fixedObject = new FixedObject(new Circle(new Point(6, 6)));

        static::assertTrue(CollisionsManager::testCollisionablesCollision($pick, $fixedObject));
    }

    public function test close picks do collide()
    {
        $map = new Map();
        $pickA = new Pick($map, new Player($map));
        $pickA->appendBodyPart(new Circle(new Point(0, 0), 5));
        $pickA->appendBodyPart(new Circle(new Point(-4, -4), 5));

        $map = new Map();
        $pickB = new Pick($map, new Player($map));
        $pickB->appendBodyPart(new Circle(new Point(2, 2), 5));
        $pickB->appendBodyPart(new Circle(new Point(6, 6), 5));

        static::assertTrue(CollisionsManager::testCollisionablesCollision($pickA, $pickB));
    }
}
