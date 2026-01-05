<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Clear existing data
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('notifications')->truncate();
        DB::table('violations')->truncate();
        DB::table('reports')->truncate();
        DB::table('messages')->truncate();
        DB::table('conversation_participants')->truncate();
        DB::table('conversations')->truncate();
        DB::table('loans')->truncate();
        DB::table('listings')->truncate();
        DB::table('items')->truncate();
        DB::table('categories')->truncate();
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Seed Users
        $users = [
            [
                'full_name' => 'علی احمدی',
                'username' => 'ali_ahmadi',
                'email' => 'ali@example.com',
                'phone' => '09123456789',
                'password_hash' => Hash::make('password123'),
                'trust_score' => 4.5,
                'role' => 0,
                'address' => 'تهران، خیابان ولیعصر',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'full_name' => 'مریم رضایی',
                'username' => 'maryam_rezaei',
                'email' => 'maryam@example.com',
                'phone' => '09123456790',
                'password_hash' => Hash::make('password123'),
                'trust_score' => 4.8,
                'role' => 0,
                'address' => 'اصفهان، خیابان چهارباغ',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'full_name' => 'محمد کریمی',
                'username' => 'mohammad_karimi',
                'email' => 'mohammad@example.com',
                'phone' => '09123456791',
                'password_hash' => Hash::make('password123'),
                'trust_score' => 4.2,
                'role' => 0,
                'address' => 'شیراز، خیابان زند',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'full_name' => 'زهرا نوری',
                'username' => 'zahra_noori',
                'email' => 'zahra@example.com',
                'phone' => '09123456792',
                'password_hash' => Hash::make('password123'),
                'trust_score' => 4.7,
                'role' => 0,
                'address' => 'مشهد، خیابان امام رضا',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'full_name' => 'مدیر سیستم',
                'username' => 'admin',
                'email' => 'admin@example.com',
                'phone' => '09123456793',
                'password_hash' => Hash::make('admin123'),
                'trust_score' => 5.0,
                'role' => 1,
                'address' => 'تهران',
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($users as $user) {
            DB::table('users')->insert($user);
        }

        // Seed Categories
        $categories = [
            ['title' => 'کتاب', 'description' => 'کتاب‌های مختلف', 'parent_id' => null],
            ['title' => 'ابزار', 'description' => 'ابزارهای مختلف', 'parent_id' => null],
            ['title' => 'لوازم خانگی', 'description' => 'لوازم خانگی', 'parent_id' => null],
            ['title' => 'الکترونیکی', 'description' => 'وسایل الکترونیکی', 'parent_id' => null],
            ['title' => 'اسباب بازی', 'description' => 'اسباب بازی‌ها', 'parent_id' => null],
            ['title' => 'ورزشی', 'description' => 'وسایل ورزشی', 'parent_id' => null],
        ];

        $categoryIds = [];
        foreach ($categories as $category) {
            $id = DB::table('categories')->insertGetId([
                'title' => $category['title'],
                'description' => $category['description'],
                'parent_id' => $category['parent_id'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
            $categoryIds[$category['title']] = $id;
        }

        // Seed Items
        $items = [
            [
                'owner_id' => 1,
                'category_id' => $categoryIds['کتاب'],
                'title' => 'کتاب برنامه‌نویسی Python',
                'description' => 'کتاب کامل آموزش Python برای مبتدیان',
                'item_condition' => 'like_new',
                'images_json' => json_encode(['https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Python+Book']),
            ],
            [
                'owner_id' => 2,
                'category_id' => $categoryIds['ابزار'],
                'title' => 'دریل برقی',
                'description' => 'دریل برقی با کیفیت بالا',
                'item_condition' => 'used',
                'images_json' => json_encode(['https://via.placeholder.com/400x300/10B981/FFFFFF?text=Drill']),
            ],
            [
                'owner_id' => 3,
                'category_id' => $categoryIds['الکترونیکی'],
                'title' => 'لپ‌تاپ Dell',
                'description' => 'لپ‌تاپ Dell با پردازنده Intel Core i7',
                'item_condition' => 'like_new',
                'images_json' => json_encode(['https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Laptop']),
            ],
            [
                'owner_id' => 4,
                'category_id' => $categoryIds['ورزشی'],
                'title' => 'دوچرخه کوهستان',
                'description' => 'دوچرخه کوهستان با کیفیت عالی',
                'item_condition' => 'used',
                'images_json' => json_encode(['https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Bike']),
            ],
            [
                'owner_id' => 1,
                'category_id' => $categoryIds['لوازم خانگی'],
                'title' => 'جارو برقی',
                'description' => 'جارو برقی قدرتمند',
                'item_condition' => 'like_new',
                'images_json' => json_encode(['https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Vacuum']),
            ],
            [
                'owner_id' => 2,
                'category_id' => $categoryIds['اسباب بازی'],
                'title' => 'پازل 1000 تکه',
                'description' => 'پازل زیبا با تصویر طبیعت',
                'item_condition' => 'new',
                'images_json' => json_encode(['https://via.placeholder.com/400x300/EC4899/FFFFFF?text=Puzzle']),
            ],
        ];

        $itemIds = [];
        foreach ($items as $item) {
            $id = DB::table('items')->insertGetId([
                ...$item,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
            $itemIds[] = $id;
        }

        // Seed Listings
        $listings = [
            [
                'item_id' => $itemIds[0],
                'title' => 'اجاره کتاب Python',
                'description' => 'کتاب کامل آموزش Python',
                'daily_fee' => 5000,
                'deposit_amount' => 50000,
                'available_from' => Carbon::now()->toDateString(),
                'available_until' => Carbon::now()->addMonths(3)->toDateString(),
                'status' => 'active',
                'view_count' => 15,
            ],
            [
                'item_id' => $itemIds[1],
                'title' => 'اجاره دریل برقی',
                'description' => 'دریل برقی با کیفیت',
                'daily_fee' => 30000,
                'deposit_amount' => 200000,
                'available_from' => Carbon::now()->toDateString(),
                'available_until' => Carbon::now()->addMonths(6)->toDateString(),
                'status' => 'active',
                'view_count' => 42,
            ],
            [
                'item_id' => $itemIds[2],
                'title' => 'اجاره لپ‌تاپ Dell',
                'description' => 'لپ‌تاپ با پردازنده قدرتمند',
                'daily_fee' => 100000,
                'deposit_amount' => 2000000,
                'available_from' => Carbon::now()->toDateString(),
                'available_until' => Carbon::now()->addMonths(2)->toDateString(),
                'status' => 'active',
                'view_count' => 78,
            ],
            [
                'item_id' => $itemIds[3],
                'title' => 'اجاره دوچرخه کوهستان',
                'description' => 'دوچرخه مناسب برای کوهنوردی',
                'daily_fee' => 50000,
                'deposit_amount' => 500000,
                'available_from' => Carbon::now()->toDateString(),
                'available_until' => Carbon::now()->addMonths(4)->toDateString(),
                'status' => 'active',
                'view_count' => 56,
            ],
            [
                'item_id' => $itemIds[4],
                'title' => 'اجاره جارو برقی',
                'description' => 'جارو برقی قدرتمند',
                'daily_fee' => 20000,
                'deposit_amount' => 300000,
                'available_from' => Carbon::now()->toDateString(),
                'available_until' => Carbon::now()->addMonths(5)->toDateString(),
                'status' => 'active',
                'view_count' => 23,
            ],
            [
                'item_id' => $itemIds[5],
                'title' => 'اجاره پازل 1000 تکه',
                'description' => 'پازل زیبا و سرگرم‌کننده',
                'daily_fee' => 10000,
                'deposit_amount' => 100000,
                'available_from' => Carbon::now()->toDateString(),
                'available_until' => Carbon::now()->addMonths(6)->toDateString(),
                'status' => 'active',
                'view_count' => 12,
            ],
        ];

        $listingIds = [];
        foreach ($listings as $listing) {
            $id = DB::table('listings')->insertGetId([
                ...$listing,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
            $listingIds[] = $id;
        }

        // Seed Loans
        $loans = [
            [
                'listing_id' => $listingIds[0],
                'borrower_id' => 2,
                'request_date' => Carbon::now()->subDays(5),
                'approval_date' => Carbon::now()->subDays(4),
                'start_date' => Carbon::now()->addDays(2)->toDateString(),
                'end_date' => Carbon::now()->addDays(7)->toDateString(),
                'status' => 'approved',
            ],
            [
                'listing_id' => $listingIds[1],
                'borrower_id' => 3,
                'request_date' => Carbon::now()->subDays(2),
                'status' => 'requested',
            ],
            [
                'listing_id' => $listingIds[2],
                'borrower_id' => 4,
                'request_date' => Carbon::now()->subDays(10),
                'approval_date' => Carbon::now()->subDays(9),
                'start_date' => Carbon::now()->subDays(5)->toDateString(),
                'end_date' => Carbon::now()->addDays(2)->toDateString(),
                'status' => 'borrowed',
            ],
        ];

        foreach ($loans as $loan) {
            DB::table('loans')->insert($loan);
        }
    }
}
