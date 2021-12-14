<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

// Batchクラス
use App\Box\Other\Informations\BatchInformation;
use App\Box\SchoolManage\AggregateProgresses\BatchMonthAggregateProgress;
use App\Box\SchoolManage\AggregateProgresses\BatchWeekAggregateProgress;
use App\Box\SchoolManage\UserScores\BatchUserScore;
use App\Box\SchoolManage\GoalScores\BatchGoalScore;

class Kernel extends ConsoleKernel
{
  protected $commands = [
    //
  ];

  protected function schedule(Schedule $schedule)
  {
    // データベースのバックアップ
    $schedule->command('backup:clean --disable-notifications')->monthly();
    $schedule->command('backup:run --disable-notifications --only-db')->daily();
  }

  protected function commands()
  {
    $this->load(__DIR__.'/Commands');

    require base_path('routes/console.php');
  }
}
