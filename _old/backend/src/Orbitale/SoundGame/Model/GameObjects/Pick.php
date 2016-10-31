<?php

namespace Orbitale\SoundGame\Model\GameObjects;

use Orbitale\SoundGame\Collision\AbstractCollisonable;
use Orbitale\SoundGame\Collision\CollisionableInterface;
use Orbitale\SoundGame\Geometry\Circle;
use Orbitale\SoundGame\Geometry\CircleList;
use Orbitale\SoundGame\Geometry\Point;
use Orbitale\SoundGame\Math\CollisionsManager;
use Orbitale\SoundGame\Model\Map;
use Orbitale\SoundGame\Model\Player;

class Pick extends AbstractCollisonable
{
    const DEFAULT_HEAD_ANGLE = 0; // In degrees.
    const DEFAULT_HEAD_ANGLE_TICK = 10; // In degrees.
    const DEFAULT_SPEED = 10; // In pixels.

    /**
     * @var Player
     */
    public $player;

    /**
     * Number of body parts.
     * If > count(bodyParts), it means we have to create a new bodyPart.
     *
     * @var int
     */
    public $length = 1;

    /**
     * From 0 to 360°.
     * Represents the clock.
     *
     * @var int
     */
    public $headAngle;

    /**
     * Left, right
     *
     * @var string
     */
    public $direction;

    /**
     * The amount of pixels crossed on each tick.
     *
     * @var int
     */
    public $speed;

    /**
     * @var Map
     */
    public $map;

    /**
     * @var bool
     */
    public $destroyed = false;

    /**
     * First body part is the head, last is the tail.
     *
     * @var Circle
     */
    protected $body;

    public function __construct(Map $map, Player $player, int $speed = self::DEFAULT_SPEED, int $headAngle = self::DEFAULT_HEAD_ANGLE)
    {
        $randomPosition = new Circle(new Point(
            rand(-1000, 1000),
            rand(-1000, 1000)
        ));

        $randomAngle = rand(0, 360);


        $this->player    = $player;
        $this->body      = $randomPosition;
        $this->speed     = $speed;
        $this->headAngle = $headAngle !== 0 ?: $randomAngle;
        $this->map       = $map;
    }

    /**
     * {@inheritdoc}
     */
    public function getCircleList(): CircleList
    {
        return new CircleList([$this->body]);
    }

    public function getBody(): Circle
    {
        return $this->body;
    }

    /**
     * Using trigonometry to get coordinates of the next point.
     */
    public function calculateNextCoordinatePoint(): Point
    {
        $headPoint = $this->getBody()->getCenterPoint();

        $angleInRadians = deg2rad($this->headAngle);

        $y = $headPoint->getY() + ($this->speed * cos($angleInRadians));
        $x = $headPoint->getX() + ($this->speed * sin($angleInRadians));

        return new Point(round($x), round($y));
    }

    /**
     * 1. Check head angle.
     * 2. Calculate next point.
     * 3. Evaluate collisions
     * 3. a. Handle collisions with Food
     * 3. b. Handle game over on collisions with fixed objects, walls and other players.
     * 4. Move the player if he can, else, send game over!
     *
     * @return bool
     */
    public function move()
    {
        $this->changeHeadAngle();
        $this->checkFoodCollisions();
        $collides = $this->checkOtherCollisions();

        if (!$collides) {
            $newPoint = $this->calculateNextCoordinatePoint();

            $this->body = new Circle($newPoint);

            // Has moved successfully.
            return true;
        }

        // Has failed to move because it collided with a physical object.
        return false;
    }

    /**
     * Change the head angle based on current's player direction,
     *  but only if a key is pressed by the player.
     *
     * @return true
     */
    public function changeHeadAngle()
    {
        if ($this->player->keyPressed) {
            // Will help handle positive or negative angles.
            $directionRatio = $this->direction === Player::DIRECTION_LEFT ? 1 : -1;

            $this->headAngle += ($directionRatio * self::DEFAULT_HEAD_ANGLE_TICK);

            return true;
        }

        return false;
    }

    /**
     * If player has a collision with food, we run the onPick method.
     *
     * @return bool
     */
    public function checkFoodCollisions()
    {
        foreach ($this->map->foods as $k => $food) {
            if (CollisionsManager::testCollisionablesCollision($this, $food)) {
                $food->collide($this);

                return true;
            }
        }

        return false;
    }

    /**
     * Checks if the player's position is colliding with any other position.
     *
     * @return bool
     */
    public function checkOtherCollisions()
    {
        foreach ($this->map->picks as $pick) {
            if ($this !== $pick) {
                continue;
            }
            // Handle "other" player collision.
            if (CollisionsManager::testCollisionablesCollision($this->getCircleList(), $pick)) {
                echo sprintf(
                    '%s is colliding with %s',
                    $this->player->name, $pick->player->name
                ), PHP_EOL;
                return true;
            }
        }

        return false;
    }

    /**
     * {@inheritdoc}
     */
    public function collide(CollisionableInterface $target)
    {
        if ($target instanceof Pick) {
            $this->player->score = 0;
        }
    }
}
