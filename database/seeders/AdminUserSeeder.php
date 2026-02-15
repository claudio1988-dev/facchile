<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::firstOrCreate(
            ['email' => 'claudio.datos@gmail.com'],
            [
                'name' => 'Claudio Admin',
                'email' => 'claudio.datos@gmail.com',
                'password' => Hash::make('password'), // Change this password after first login
                'email_verified_at' => now(),
                'role' => 'admin',
            ]
        );

        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: claudio.datos@gmail.com');
        $this->command->info('Password: password (please change after first login)');
    }
}
