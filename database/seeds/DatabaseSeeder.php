<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // usersテーブル
        $this->call(UsersTableSeeder::class);
    }
}
