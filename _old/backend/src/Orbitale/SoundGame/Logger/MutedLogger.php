<?php

namespace Orbitale\SoundGame\Logger;

use Psr\Log\AbstractLogger;

class MutedLogger extends AbstractLogger
{
    public function log($level, $message, array $context = array())
    {
    }
}
