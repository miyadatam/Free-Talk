<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeyFriendsTable extends Migration
{
  /**
  * Run the migrations.
  *
  * @return void
  */
  public function up()
  {
    Schema::table('friends', function (Blueprint $table) {
      $table->foreign('my_id')
      ->references('id')
      ->on('users')
      ->onUpdate('cascade')
      ->onDelete('cascade');

      $table->foreign('your_id')
      ->references('id')
      ->on('users')
      ->onUpdate('cascade')
      ->onDelete('cascade');
    });
  }

  /**
  * Reverse the migrations.
  *
  * @return void
  */
  public function down()
  {
    Schema::table('friends', function (Blueprint $table) {
      $table->dropForeign(['myself_id']);
      $table->dropForeign(['your_id']);
    });
  }
}
