<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->string('semester');
            $table->integer('credits')->default(3);
            $table->string('cover_image_url')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE', 'ARCHIVED'])->default('ACTIVE');
            $table->integer('max_students')->default(50);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['teacher_id']);
            $table->index(['semester']);
            $table->index(['status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('courses');
    }
};