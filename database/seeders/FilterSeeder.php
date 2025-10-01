<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FilterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('filter_groups')->insert([
            ['id' => 1, 'title' => 'Genres'],
            ['id' => 2, 'title' => 'Rating'],
            ['id' => 3, 'title' => 'Themes'],
        ]);

        DB::table('filters')->insert([
            ['id' => 1, 'title' => 'Action', 'filter_group_id' => 1],
            ['id' => 2, 'title' => 'Adventure', 'filter_group_id' => 1],
            ['id' => 3, 'title' => 'Avant Garde', 'filter_group_id' => 1],
            ['id' => 4, 'title' => 'Comedy', 'filter_group_id' => 1],
            ['id' => 5, 'title' => 'G', 'filter_group_id' => 2],
            ['id' => 6, 'title' => 'PG', 'filter_group_id' => 2],
            ['id' => 7, 'title' => 'PG-13', 'filter_group_id' => 2],
            ['id' => 8, 'title' => 'R-17', 'filter_group_id' => 2],
            ['id' => 9, 'title' => 'R+', 'filter_group_id' => 2],
            ['id' => 10, 'title' => 'Rx', 'filter_group_id' => 2],
            ['id' => 11, 'title' => 'Urban Fantasy', 'filter_group_id' => 3],
            ['id' => 12, 'title' => 'Villainess', 'filter_group_id' => 3],
            ['id' => 13, 'title' => 'Adult Cast', 'filter_group_id' => 3],
            ['id' => 14, 'title' => 'Anthropomorphic', 'filter_group_id' => 3],
            ['id' => 15, 'title' => 'Award Winning', 'filter_group_id' => 3],
            ['id' => 16, 'title' => 'CGDCT', 'filter_group_id' => 3],
            ['id' => 17, 'title' => 'Childcare', 'filter_group_id' => 3],
        ]);

        DB::table('filter_anime')->insert([
            // category 1
            ['filter_id' => 1, 'product_id' => 1, 'filter_group_id' => 1],
            ['filter_id' => 1, 'product_id' => 2, 'filter_group_id' => 1],
            ['filter_id' => 1, 'product_id' => 4, 'filter_group_id' => 1],
            ['filter_id' => 1, 'product_id' => 6, 'filter_group_id' => 1],
            ['filter_id' => 1, 'product_id' => 7, 'filter_group_id' => 1],
            ['filter_id' => 1, 'product_id' => 9, 'filter_group_id' => 1],
            ['filter_id' => 1, 'product_id' => 10, 'filter_group_id' => 1],
            ['filter_id' => 2, 'product_id' => 5, 'filter_group_id' => 1],
            ['filter_id' => 2, 'product_id' => 8, 'filter_group_id' => 1],
            ['filter_id' => 10, 'product_id' => 1, 'filter_group_id' => 3],
            ['filter_id' => 10, 'product_id' => 2, 'filter_group_id' => 3],
            ['filter_id' => 10, 'product_id' => 4, 'filter_group_id' => 3],
            ['filter_id' => 11, 'product_id' => 2, 'filter_group_id' => 3],
            ['filter_id' => 15, 'product_id' => 5, 'filter_group_id' => 3],

            // category 2
            ['filter_id' => 1, 'product_id' => 11, 'filter_group_id' => 1],
            ['filter_id' => 1, 'product_id' => 12, 'filter_group_id' => 1],
            ['filter_id' => 1, 'product_id' => 14, 'filter_group_id' => 1],
            ['filter_id' => 2, 'product_id' => 15, 'filter_group_id' => 1],
            ['filter_id' => 2, 'product_id' => 18, 'filter_group_id' => 1],
            ['filter_id' => 5, 'product_id' => 11, 'filter_group_id' => 2],
            ['filter_id' => 6, 'product_id' => 12, 'filter_group_id' => 2],
            ['filter_id' => 8, 'product_id' => 14, 'filter_group_id' => 2],
            ['filter_id' => 9, 'product_id' => 15, 'filter_group_id' => 2],

            // category 4
            ['filter_id' => 1, 'product_id' => 21, 'filter_group_id' => 1],
            ['filter_id' => 1, 'product_id' => 22, 'filter_group_id' => 1],
            ['filter_id' => 1, 'product_id' => 24, 'filter_group_id' => 1],
            ['filter_id' => 2, 'product_id' => 25, 'filter_group_id' => 1],
            ['filter_id' => 2, 'product_id' => 28, 'filter_group_id' => 1],
            ['filter_id' => 5, 'product_id' => 21, 'filter_group_id' => 2],
            ['filter_id' => 6, 'product_id' => 22, 'filter_group_id' => 2],
            ['filter_id' => 8, 'product_id' => 24, 'filter_group_id' => 2],
            ['filter_id' => 9, 'product_id' => 25, 'filter_group_id' => 2],
        ]);
    }
}
