<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class CreateUsersTable extends Migration
{
  /**
  * Run the migrations.
  *
  * @return void
  */
  public function up()
  {
    Schema::create('users', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('username', 60)->comment('名前');
      $table->string('username_kana', 60)->comment('なまえ');
      $table->string('email', 255)->unique()->comment('メールアドレス');
      $table->string('password', 255)->comment('パスワード');
      $table->string('image', 500)->nullable()->comment('画像');
      $table->string('bio', 160)->nullable()->comment('自己紹介');
      $table->rememberToken();
      $table->timestamps();
      $table->softDeletes();
    });
  }

  public function down()
  {
    Schema::dropIfExists('users');
  }
}
