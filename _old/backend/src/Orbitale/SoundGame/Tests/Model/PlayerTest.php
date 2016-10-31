<?php

namespace Orbitale\SoundGame\Tests\Model;

use PHPUnit\Framework\TestCase;
use Orbitale\SoundGame\Model\Map;
use Orbitale\SoundGame\Model\Player;

class PlayerTest extends TestCase
{
    public function test only moves left and right()
    {
        $player = new Player(new Map());

        static::assertTrue($player->canChangeDirection('left'));
        static::assertTrue($player->canChangeDirection('right'));
        static::assertFalse($player->canChangeDirection('up'));
        static::assertFalse($player->canChangeDirection('down'));
    }

    public function test change direction also changes pick direction()
    {
        $player = new Player(new Map());

        $player->pick->direction = 'left';
        $player->changeDirection('left');
        static::assertEquals('left', $player->pick->direction);

        $player->pick->direction = 'right';
        $player->changeDirection('right');
        static::assertEquals('right', $player->pick->direction);
    }
}
