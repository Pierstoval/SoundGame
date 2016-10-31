<?php

namespace Orbitale\SoundGame\Model;

use Orbitale\SoundGame\Model\GameObjects\Food;
use Orbitale\SoundGame\Model\GameObjects\Pick;

class Map
{
    /**
     * @var Pick[]
     */
    public $picks = [];

    /**
     * @var Food[]
     */
    public $foods = [];
}
