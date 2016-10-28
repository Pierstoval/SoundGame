<?php

namespace Orbitale\SoundGame;

use Orbitale\SoundGame\Geometry\Circle;
use Orbitale\SoundGame\Geometry\CircleList;
use Orbitale\SoundGame\Geometry\Point;
use Orbitale\SoundGame\Model\Food;
use Orbitale\SoundGame\Model\Map;
use Orbitale\SoundGame\Model\Player;
use Orbitale\SoundGame\Model\Pick;

class Serializer
{
    public static function serializeGame(Game $game) : array
    {
        return [
            'p' => self::serializePlayers($game->getPlayers()),
            'm' => static::serializeMap($game->getMap()),
        ];
    }

    public static function serializeMap(Map $map): array
    {
        return [
            'f' => static::serializeFoods(array_values($map->foods)),
        ];
    }

    public static function serializeFoods(array $foods)
    {
        return array_map(function(Food $food) {
            return [
                static::serializeCircle($food->circle),
                $food->value,
                $food->type,
            ];
        }, $foods);
    }

    /**
     * @param Player[] $players a "hash => player" hash
     *
     * @return array
     */
    public static function serializePlayers(array $players) : array
    {
        return array_map(function(Player $player) {
            return [
                'n' => $player->name,
                'c' => $player->color,
                's' => self::serializePick($player->pick),
                'sc' => $player->score
            ];
        }, array_values($players));
    }

    public static function serializePick(Pick $pick) : array
    {
        return [
            'd' => $pick->direction,
            'a' => $pick->headAngle,
            'l' => $pick->length,
            'b' => self::serializeCircleList($pick->getCircleList()),
            'dd' => $pick->destroyed,
        ];
    }

    public static function serializeCircleList(CircleList $bodyParts) : array
    {
        return array_map(function(Circle $bodyPart) {
            return static::serializeCircle($bodyPart);
        }, $bodyParts->getCirclesArray());
    }

    public static function serializeCircle(Circle $circle): array
    {
        return [
            static::serializePoint($circle->centerPoint),
            $circle->radius,
        ];
    }

    public static function serializePoint(Point $point)
    {
        return [
            $point->x,
            $point->y,
        ];
    }
}
