<?php

namespace Orbitale\SoundGame;

use Orbitale\SoundGame\Game\Game;
use Orbitale\SoundGame\Geometry\Circle;
use Orbitale\SoundGame\Geometry\CircleList;
use Orbitale\SoundGame\Geometry\Point;
use Orbitale\SoundGame\Model\GameObjects\Food;
use Orbitale\SoundGame\Model\Map;
use Orbitale\SoundGame\Model\Player;
use Orbitale\SoundGame\Model\GameObjects\Pick;

class Serializer
{
    /**
     * "p" for "player"
     * "m" for "map"
     *
     * @param Game $game
     *
     * @return array
     */
    public static function serializeGame(Game $game) : array
    {
        return [
            'p' => self::serializePlayers($game->getPlayers()),
            'm' => static::serializeMap($game->getMap()),
        ];
    }

    /**
     * "f" for "foods"
     *
     * @param Map $map
     *
     * @return array
     */
    public static function serializeMap(Map $map): array
    {
        return [
            'f' => static::serializeFoods(array_values($map->foods)),
        ];
    }

    /**
     * @param array $foods
     *
     * @return array
     */
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
     * "n" for "name"
     * "c" for "color"
     * "p" for "pick"
     * "s" for "score"
     *
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
                'p' => self::serializePick($player->pick),
                's' => $player->score
            ];
        }, array_values($players));
    }

    /**
     * "d" for "direction"
     * "a" for "angle"
     * "b" for "body"
     * "dd" for "destroyed"
     *
     * @param Pick $pick
     *
     * @return array
     */
    public static function serializePick(Pick $pick) : array
    {
        return [
            'd' => $pick->direction,
            'a' => $pick->headAngle,
            'b' => self::serializeCircleList($pick->getCircleList()),
            'dd' => $pick->destroyed,
        ];
    }

    /**
     * @param CircleList $bodyParts
     *
     * @return array
     */
    public static function serializeCircleList(CircleList $bodyParts) : array
    {
        return array_map(function(Circle $bodyPart) {
            return static::serializeCircle($bodyPart);
        }, $bodyParts->getCirclesArray());
    }

    /**
     * @param Circle $circle
     *
     * @return array
     */
    public static function serializeCircle(Circle $circle): array
    {
        return [
            static::serializePoint($circle->getCenterPoint()),
            $circle->getRadius(),
        ];
    }

    /**
     * @param Point $point
     *
     * @return array
     */
    public static function serializePoint(Point $point)
    {
        return [
            $point->getX(),
            $point->getY(),
        ];
    }
}
