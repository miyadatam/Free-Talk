<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFriendsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('friends', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('my_id')->comment('自分のid');
            $table->unsignedBigInteger('your_id')->comment('相手のid');
            $table->boolean('is_favorite')->default(false)->comment('お気に入りかどうか');
            $table->datetime('favorite_at')->nullable()->comment('お気に入りの登録日時');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('friends');
    }
}
